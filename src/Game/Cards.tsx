import { Component } from "react";
import { Card } from "./Card";

import "./Cards.scss";

export interface Props {
  cards: number[];
}

export interface State {}

export class Cards extends Component<Props, State> {
  render() {
    return (
      <div style={{ display: "flex", justifyContent: "center", margin: "40px" }}>
        <div className="cards" style={{ width: this.props.cards.length * 100 + 110 + "px" }}>
          {this.props.cards.map(card => (
            <Card card={card} />
          ))}
        </div>
      </div>
    );
  }
}
