import classNames from "classnames";
import React, { Component } from "react";
import { Card } from "./Card";

import "./Cards.scss";

export interface Props {
  cards: number[];
  height: string;
  inline?: boolean;
  overlap?: boolean;
  onCardClick?: (cardIndex: number) => void;
}

export interface State {}

export class Cards extends Component<Props, State> {
  render(): JSX.Element {
    return (
      <div style={{ height: this.props.height }} className={classNames({ cards: true, overlap: this.props.overlap !== false })}>
        {this.props.cards.map((card, i) => (
          <Card onClick={() => this.props.onCardClick && this.props.onCardClick(i)} key={i} card={card} inline={this.props.inline} />
        ))}
      </div>
    );
  }
}
