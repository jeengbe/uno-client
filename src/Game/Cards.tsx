import classNames from "classnames";
import React, { Component } from "react";
import { Card } from "./Card";

import "./Cards.scss";

export interface Props {
  cards: number[];
  inline?: boolean;
  overlap?: boolean;
}

export interface State {}

export class Cards extends Component<Props, State> {
  render(): JSX.Element {
    return (
      <div className={classNames({ cards: true, overlap: this.props.overlap })}>
        {this.props.cards.map((card, i) => (
          <Card key={i} card={card} inline={this.props.inline} />
        ))}
      </div>
    );
  }
}
