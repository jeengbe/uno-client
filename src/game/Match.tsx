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
   * Whether the player is the game master
   */
  public isMaster: boolean | null = null;

  /**
   * Whether it is the player's turn
   */
  public isOwnTurn = false;

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

  /**
   * The indices (of `Match.hand`) of the cards the player will play
   */
  public cardsToPlay: number[] = [];

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

  public setTopCard(topCard: number): void {
    this.topCard = topCard;
    this.app.forceUpdate();
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

  public setIsOwnTurn(isOwnTurn: boolean): void {
    this.isOwnTurn = isOwnTurn;
    this.app.forceUpdate();
  }

  public takeCard(): void {
    this.app.player.takeCard();
  }

  public leave(): void {
    console.log("Left match");
  }
}
