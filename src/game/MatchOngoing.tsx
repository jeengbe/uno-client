import React, { Component } from "react";
import { Card } from "./Card";
import { Game } from "./Player";
import { Hand } from "./Hand";
import { Match } from "./Match";

import "./match.scss";

export interface Props {
  game: Game;
  match: Match;
}

export interface State {}

export class MatchOngoing extends Component<Props, State> {
  render(): JSX.Element {
    return (
      <>
        <div className="table">
          <h1 className="status">{this.props.match.name}</h1>
          <div className="topCard">
            <Card card={this.props.match.topCard!} />
          </div>
          <Hand cards={this.props.match.cards} />
        </div>
      </>
    );
  }
}
