import { Component } from "react";
import { Cards } from "./Cards";

export interface Props {
  cards: number[];
}

export interface State {}

export class Hand extends Component<Props, State> {
  render(): JSX.Element {
    return (
      <div className="hand">
        <Cards height="15rem" cards={this.props.cards} />
      </div>
    );
  }
}
