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
      <div className={classNames({ cards: true, overlap: this.props.overlap })} style={{ width: this.props.overlap === true ? 50 / this.props.cards.length + 50 + "%" : undefined }}>
        {this.props.cards.map((card, i) => (
          <Card key={i} card={card} inline={this.props.inline} />
        ))}
      </div>
    );
  }
}
