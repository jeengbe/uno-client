import React, { Component } from "react";
import { Cards } from "./Cards";

export interface Props {
  cards: number[];
}

export interface State {}

export class CardShowcase extends Component<Props, State> {
  render(): JSX.Element {
    return (
      <div style={{ height: Math.min(window.innerHeight - 40, ((document.body.clientWidth - 80) / this.props.cards.length) * (889 / 560) + 80), padding: "40px 40px 0 40px", textAlign: "center" }}>
        <Cards cards={this.props.cards} inline={this.props.cards.length < 3} />
      </div>
    );
  }
}
