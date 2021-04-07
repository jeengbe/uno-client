import { CONFIG } from "../Config";

export class Game {
  private readonly match: string | null;
  private readonly username: string;
  private socket: WebSocket | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onMessage: ((data: Record<string, any>) => void) | null = null;

  /**
   * Initialise a new game
   *
   * @param match Desired match to play
   * @param username Player's username
   */
  constructor(match: string | null, username: string) {
    this.match = match;
    this.username = username;
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
          this.onMessage === null || this.onMessage(message);
          this.onMessage = null;
        } catch (err) {
          this.disconnect();
        }
      };
      this.socket.onerror = () => void setError("SOCKET_ERROR");
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

      this.onMessage = () => resolve();
    });
  }

  /**
   * Load data of the currently playing match
   */
  public loadCurrentMatchData(): Promise<MatchDataMatch> {
    return new Promise<MatchDataMatch>(resolve => {
      this.send({
        method: "LOAD_MATCH_DATA",
      });

      this.onMessage = message => {
        if (!("data" in message)) throw new Error("Missing key 'data'");
        const data = message.data;
        if (!("match" in data)) throw new Error("Missing key 'data.match'");

        resolve(data.match);
      };
    });
  }
}
