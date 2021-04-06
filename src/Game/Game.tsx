import { CONFIG } from "../Config";

export class Game {
  private readonly username: string;
  private socket: WebSocket | null = null;

  /**
   * Initialise a new game
   *
   * @param username Player's username
   */
  constructor(username: string) {
    this.username = username;
  }

  /**
   * Connect to the game socket
   */
  public connect(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.socket = new WebSocket(CONFIG.SOCKET);

      this.socket.onopen = () => void resolve();
      this.socket.onerror = () => void reject();
    });
  }

  /**
   * Stop the game connection
   */
  public disconnect(): void {
    this.socket?.close();
  }

  /**
   * Start authentication
   */
  public auth(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.socket === null) throw new Error("Socket not connected!");

      this.socket.send("0;" + this.username);
      this.socket.onmessage = e => {
        if (e.data === "0") return reject();
        return resolve();
      };
    });
  }
}
