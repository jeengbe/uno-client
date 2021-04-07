export class Match {
  public readonly ID: string;
  public readonly name: string;

  constructor(data: MatchDataMatch) {
    this.ID = data.ID;
    this.name = data.name;
  }
}