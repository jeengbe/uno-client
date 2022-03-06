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
   * Whether the player is the game master
   */
  public isMaster: boolean | null = null;

  /**
   * Whether it is the player's turn
   */
  public isOwnTurn = false;

  /**
   * Cards that lay on the table
   */
  public stack: number[] = [];

  /**
   * Index of `Match.players` of the player whose turn it is
   */
  private turn = 0;

  /**
   * The current draw streak
   */
  public drawStreak = 0;

  /**
   * The player's cards
   */
  public hand: number[] = [];

  /**
   * The indices (of `Match.hand`) of the cards the player will play
   */
  public cardsToPlay: number[] = [];

  /**
   * Whether the player has taken a card already
   */
  public hasTakenCardAlready = false;

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

  public start(startingCard: number[], hand: number[]): void {
    this.stack = startingCard;
    this.hand = hand;
    this.app.forceUpdate();
  }

  public pushToStack(cards: number[]): void {
    this.stack.push(...cards);
    this.app.forceUpdate();
  }

  public setDrawStreak(drawStreak: number): void {
    this.drawStreak = drawStreak;
    this.app.forceUpdate();
  }

  public getTopCard(): number {
    return this.stack[this.stack.length - 1]!;
  }

  /**
   * @param index Index of the card to play
   */
  public unplayCard(index: number): void {
    this.cardsToPlay.splice(index, 1);

    this.app.forceUpdate();
  }

  /**
   * @param index Index of the card to play
   */
  public preparePlay(index: number): void {
    this.cardsToPlay.push(index);
    this.app.forceUpdate();
  }

  public async playCards(): Promise<void> {
    if (await this.app.player.playCards(this.cardsToPlay)) {
      for (const index of this.cardsToPlay.sort((a, b) => b - a)) {
        this.hand.splice(index, 1);
      }
      this.cardsToPlay = [];
      this.app.forceUpdate();
    } else {
      console.log("Invalid Play");
    }
  }

  public setTurn(turn: number): void {
    this.isOwnTurn = this.app.player.playerNumber === turn;
    this.turn = turn;
    this.hasTakenCardAlready = false;
    this.app.forceUpdate();
  }

  public takeCard(): void {
    this.hasTakenCardAlready = true;
    this.app.player.takeCard();
  }

  public skip(): void {
    this.app.player.skip();
  }

  public leave(): void {
    console.log("Left match");
  }
}
