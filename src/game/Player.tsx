import App, { GameState } from "../App";
import { CONFIG } from "../Config";
import { Match } from "./Match";

type EventPacket = Protocol.ServerToClient & { method: "EVENT" };

interface EventHandlersMap {
  clear(): void;
  delete<Event extends EventPacket["event"]>(key: Event): boolean;
  has<Event extends EventPacket["event"]>(key: Event): boolean;
  set<Event extends EventPacket["event"]>(key: Event, value: (message: EventPacket & { event: Event }) => void): this;
  get<Event extends EventPacket["event"]>(key: Event): (message: EventPacket & { event: Event }) => void | undefined;
  readonly size: number;
}

export class Player {
  private readonly username: string;
  public currentMatch: Match | null = null;
  private readonly app: App;
  private socket: WebSocket | null = null;

  /**
   * Priority handler for an incoming message
   */
  private messageHandler: ((message: Protocol.ServerToClient) => void) | null = null;
  private eventHandlers: EventHandlersMap = new Map();

  /**
   * Initialise a new player
   *
   * @param username Player's username
   */
  constructor(app: App, username: string) {
    this.app = app;
    this.username = username;
  }

  /**
   * Connect to the game socket and register the initial message handlers
   */
  public connect(setError: (error: GameState) => void): Promise<void> {
    return new Promise<void>(resolve => {
      this.socket = new WebSocket(CONFIG.SOCKET);

      this.socket.onopen = () => void resolve();
      this.socket.onmessage = e => {
        try {
          console.log("Message received: ");
          const message = JSON.parse(e.data.toString()) as Protocol.ServerToClient;
          console.dir(message, { depth: null });

          const method = message.method;

          try {
            if (this.messageHandler !== null) this.messageHandler(message);
            this.messageHandler = null;

            if (method === "EVENT") {
              if (!("event" in message)) throw new Error("Missing key 'event'");
              if (typeof message.event !== "string") throw new Error("Invalid 'event' type");
              const event = message.event;

              if (this.eventHandlers.has(event)) {
                this.eventHandlers.get(event)!(message);
              }
            }
          } catch (err) {
            // Runtime error handling message
            console.error(err);
          }
        } catch (err) {
          // Error decoding JSON
          console.log(e.data.toString());
          this.disconnect();
        }
      };
      this.socket.onerror = err => void console.log(err);
      // Must have extra function for this so that we can call this, even when outside of the actual try-catch block
      this.socket.onclose = () => void setError("SOCKET_ERROR");
    });
  }

  /**
   * Stop the game connection
   */
  public disconnect(reason?: string): void {
    console.log("Disconnecting" + (typeof reason !== "undefined" ? " with reason " + reason : ""));
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
   * Await welcome
   */
  public awaitWelcome(): Promise<void> {
    return new Promise<void>(resolve => {
      this.messageHandler = async message => {
        if (message.method !== "WELCOME") throw new Error("Awaiting welcome");

        resolve();
      };
    });
  }

  /**
   * Start authentication
   */
  public doAuth(): Promise<void> {
    return new Promise<void>(resolve => {
      this.send({
        method: "AUTH",
        username: this.username,
      });

      this.messageHandler = message => {
        if (message.method !== "AUTH") throw new Error("Awaiting authentication");
        resolve();
      };
    });
  }

  //
  // Lobby messages
  //

  /**
   * Load available matches
   */
  public loadMatches(): Promise<MatchDataPublic[]> {
    return new Promise<MatchDataPublic[]>(resolve => {
      this.send({
        method: "LIST_MATCHES",
      });

      this.messageHandler = message => {
        if (message.method !== "LIST_MATCHES") throw new Error("Wrong method");
        const data = message.data;

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

      this.messageHandler = message => {
        if (message.method !== "JOIN_MATCH") throw new Error("Wrong method");

        this.currentMatch = new Match(this.app, matchID);
        resolve();
      };
    });
  }

  //
  // Match messages
  //

  /**
   * Load data of the currently playing match
   */
  public loadCurrentMatchData(): Promise<MatchDataMatch> {
    return new Promise<MatchDataMatch>(resolve => {
      this.send({
        method: "LOAD_MATCH_DATA",
      });

      this.messageHandler = message => {
        if (message.method !== "LOAD_MATCH_DATA") throw new Error("Wrong method");
        const data = message.data;

        this.currentMatch!.setData(data.match);

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

      this.messageHandler = message => {
        if (message.method !== "START_MATCH") throw new Error("Wrong method");

        resolve();
      };
    });
  }

  /**
   * Attach incoming message handlers for a match
   */
  public attachMatchHandlers(): void {
    this.eventHandlers.set("PROMOTE", () => {
      this.currentMatch!.isMaster = true;
    });

    this.eventHandlers.set("ADD_PLAYER", ({ data }) => {
      this.currentMatch!.addPlayer(data.playerNumber, data.player);
    });

    this.eventHandlers.set("REMOVE_PLAYER", ({ data }) => {
      this.currentMatch!.removePlayer(data.playerNumber);
    });

    this.eventHandlers.set("START_MATCH", ({ data }) => {
      this.currentMatch!.start(data.topCard, data.cards);
      this.app.startMatch();
    });

    this.eventHandlers.set("ADD_CARDS_TO_HAND", ({ data }) => {
      this.currentMatch!.addCardsToHand(data.cards);
    });
  }

  /**
   * Detach incoming message handlers for a match
   */
  public detachMatchHandlers(): void {
    this.eventHandlers.delete("PROMOTE");
    this.eventHandlers.delete("ADD_PLAYER");
    this.eventHandlers.delete("REMOVE_PLAYER");
    this.eventHandlers.delete("START_MATCH");
    this.eventHandlers.delete("ADD_CARDS_TO_HAND");
  }
}
