import { Card } from "./Card";
import { Player } from "./Player";
import { Hand } from "./Hand";

import "./match.scss";
import { Component } from "react";

export interface Props {
  player: Player;
}

export interface State {}

export class Table extends Component<Props, State> {
  render(): JSX.Element {
    const match = this.props.player.currentMatch!;

    return (
      <>
        <div className="table">
          <h1 className="status">{match.name}</h1>
          <div className="topCard">
            <Card card={match.topCard!} />
          </div>
          <Hand cards={match.hand} />
        </div>
      </>
    );
  }
}
