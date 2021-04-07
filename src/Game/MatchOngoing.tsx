import React, { Component } from "react";
import { Game } from "./Game";
import { Hand } from "./Hand";
import { Match } from "./Match";

export interface Props {
  game: Game;
  match: Match;
}

export interface State {}

export class MatchOngoing extends Component<Props, State> {
  render(): JSX.Element {
    return (
      <>
        <h1 className="status">{this.props.match.name}</h1>
        <Hand cards={this.props.match.cards} />
      </>
    );
  }
}
