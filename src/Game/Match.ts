export class Match {
  public readonly ID: number;
  public readonly name: string;
  public readonly isMaster: boolean;

  public topCard: number | null;
  public cards: number[];

  constructor(data: MatchDataWaiting) {
    this.ID = data.ID;
    this.name = data.name;
    this.isMaster = data.isMaster;
    this.topCard = null;
    this.cards = [];
  }
}