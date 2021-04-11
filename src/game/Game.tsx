import App from "../App";
import { CONFIG } from "../Config";

export class Game {
  private readonly match: string | null;
  private readonly username: string;
  private socket: WebSocket | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onMessage: ((data: Record<string, any>) => void) | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private eventHandlers: Map<(Protocol.ServerToClient & { method: "EVENT" })["event"], (data: Record<string, any>) => void>;

  /**
   * Initialise a new game
   *
   * @param match Desired match to play
   * @param username Player's username
   */
  constructor(match: string | null, username: string) {
    this.match = match;
    this.username = username;
    this.eventHandlers = new Map();
  }

  /**
   * Connect to the game socket
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public connect(setError: (error: any) => void): Promise<void> {
    return new Promise<void>(resolve => {
      this.socket = new WebSocket(CONFIG.SOCKET);
      this.onMessage = (): void => void 0;

      this.socket.onopen = () => void resolve();
      this.socket.onmessage = e => {
        try {
          const message = JSON.parse(e.data.toString());
          console.log("Message received: ");
          console.dir(message, { depth: null });
          if (!("method" in message)) throw new Error("Missing key 'method'");
          if (typeof message.method !== "string") throw new Error("Invalid 'method' type");
          const method = message.method;

          this.onMessage === null || this.onMessage(message);
          this.onMessage = null;
          if (method === "EVENT") {
            if (!("event" in message)) throw new Error("Missing key 'event'");
            const event = message.event;

            if (this.eventHandlers.has(event)) this.eventHandlers.get(event)!(message.data || {});
          }
        } catch (err) {
          this.disconnect();
        }
      };
      this.socket.onerror = err => void console.log(err);
      this.socket.onclose = () => void setError("SOCKET_ERROR");
    });
  }

  /**
   * Stop the game connection
   */
  public disconnect(): void {
    if (this.socket !== null) {
      this.socket.onerror = null;
      this.socket.onclose = null;
      this.socket.close();
    }
  }

  /**
   * Send a message to the game server
   */
  private send(message: Protocol.ClientToServer): void {
    this.socket?.send(JSON.stringify(message));
  }

  /**
   * Await ready for authentication
   */
  public welcome(): Promise<void> {
    return new Promise<void>(resolve => {
      this.onMessage = message => {
        if (message.method !== "WELCOME") throw new Error("Awaiting welcome");

        resolve();
      };
    });
  }

  /**
   * Start authentication
   */
  public auth(): Promise<void> {
    return new Promise<void>(resolve => {
      this.send({
        method: "AUTH",
        username: this.username,
      });

      this.onMessage = message => {
        if (message.method !== "AUTH") throw new Error("Awaiting authentication");

        resolve();
      };
    });
  }

  /**
   * Load available matches
   */
  public loadMatches(): Promise<MatchDataPublic[]> {
    return new Promise<MatchDataPublic[]>(resolve => {
      this.send({
        method: "LIST_MATCHES",
      });

      this.onMessage = message => {
        if (message.method !== "LIST_MATCHES") throw new Error("Wrong method");
        if (!("data" in message)) throw new Error("Missing key 'data'");
        const data = message.data;
        if (!("matches" in data)) throw new Error("Missing key 'data.matches'");

        resolve(data.matches);
      };
    });
  }

  /**
   * Join a match
   */
  public joinMatch(matchID: number): Promise<void> {
    return new Promise<void>(resolve => {
      this.send({
        method: "JOIN_MATCH",
        data: {
          matchID: matchID,
        },
      });

      this.onMessage = message => {
        if (message.method !== "JOIN_MATCH") throw new Error("Wrong method");
        resolve();
      };
    });
  }

  /**
   * Load data of the currently playing match
   */
  public loadCurrentMatchData(): Promise<MatchDataWaiting> {
    return new Promise<MatchDataWaiting>(resolve => {
      this.send({
        method: "LOAD_MATCH_DATA",
      });

      this.onMessage = message => {
        if (message.method !== "LOAD_MATCH_DATA") throw new Error("Wrong method");
        if (!("data" in message)) throw new Error("Missing key 'data'");
        const data = message.data;
        if (!("match" in data)) throw new Error("Missing key 'data.match'");

        resolve(data.match);
      };
    });
  }

  /**
   * Start the match
   */
  public startMatch(): Promise<void> {
    return new Promise<void>(resolve => {
      this.send({
        method: "START_MATCH",
      });

      this.onMessage = message => {
        if (message.method !== "START_MATCH") throw new Error("Wrong method");

        resolve();
      };
    });
  }

  /**
   * Attach event handlers for a running game
   */
  public readyForGame(app: App): void {
    this.eventHandlers.set("PROMOTE", () => {
      app.state.currentMatch!.isMaster = true;
      app.forceUpdate();
    });

    this.eventHandlers.set("ADD_PLAYER", data => {
      if (!("player" in data)) throw new Error("Missing key 'data.player'");

      app.state.currentMatch!.addPlayer(data.player);
      app.forceUpdate();
    });

    this.eventHandlers.set("REMOVE_PLAYER", data => {
      if (!("playerID" in data)) throw new Error("Missing key 'data.playerID'");

      app.state.currentMatch!.removePlayer(data.playerID);
      app.forceUpdate();
    });

    this.eventHandlers.set("START_MATCH", data => {
      if (!("topCard" in data)) throw new Error("Missing key 'data.topCard'");
      if (!("cards" in data)) throw new Error("Missing key 'data.cards'");

      app.startMatch({ topCard: data.topCard, cards: data.cards });
    });

    this.eventHandlers.set("ADD_CARD_TO_HAND", data => {
      if (!("card" in data)) throw new Error("Missing key 'data.card'");

      app.state.currentMatch!.addCardToHand(data.card);
    });
  }
}
