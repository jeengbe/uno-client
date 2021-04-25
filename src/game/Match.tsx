import App from "../App";

export class Match {
  private readonly app: App;

  public readonly ID: number;
  public name: string | null = null;
  public isRunning = false;

  /**
   * Players in the match
   * @key Player's turn number
   * @value Player
   */
  public players: Map<number, PlayerData> = new Map();

  /**
   * Top card on the draw stack
   */
  public topCard: number | null = null;

  /**
   * Player who is in control of the game (May start, pause, etc.)
   */
  public isMaster: boolean | null = null;

  /**
   * Index of `Match.players` of the player whose turn it is
   */
  private turn = 0;

  /**
   * The current draw streak
   */
  private drawStreak = 0;

  /**
   * The player's cards
   */
  public hand: number[] = [];

  constructor(app: App, ID: number) {
    this.app = app;
    this.ID = ID;
  }

  public setData(data: MatchDataMatch): void {
    this.isMaster = data.isMaster;
    this.name = data.name;
    for (const [number, player] of Object.entries(data.players)) {
      this.players.set((number as unknown) as number, player);
    }
  }

  public addPlayer(turnNumber: number, player: PlayerData): void {
    this.players.set(turnNumber, player);
    this.app.forceUpdate();
  }

  public removePlayer(turnNumber: number): void {
    this.players.delete(turnNumber);
    this.app.forceUpdate();
  }

  public addCardsToHand(cards: number[]): void {
    this.hand.push(...cards);
    this.app.forceUpdate();
  }

  public start(topCard: number, hand: number[]): void {
    this.topCard = topCard;
    this.hand = hand;
    this.app.forceUpdate();
  }

  public leave(): void {
    console.log("Left match");
  }
}
