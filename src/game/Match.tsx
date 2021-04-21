import App from "../App";

export class Match {
  public readonly app: App;
  public readonly ID: number;
  public readonly name: string;
  public isMaster: boolean;

  public topCard: number | null;
  public cards: number[];

  /**
   * @key PlayerID
   * @value Player data
   */
  public players: Record<number, PlayerData>;

  constructor(app: App, data: MatchDataMatch) {
    this.app = app;
    this.ID = data.ID;
    this.name = data.name;
    this.isMaster = data.isMaster;
    this.topCard = null;
    this.cards = [];
    this.players = data.players;
  }

  public addPlayer(player: PlayerData): void {
    this.players.push(player);
  }

  public removePlayer(playerID: number): void {
    this.players.splice(
      this.players.findIndex(player => player.ID === playerID),
      1
    );
  }

  public addCardsToHand(cards: number[]): void {
    this.cards.push(...cards);
    this.app.forceUpdate();
  }

  public leave(): void {
    this.app.leave();
  }
}
