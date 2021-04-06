import { Component } from "react";
import { Cards } from "./Cards";

export interface Props {
  cards: number[];
}

export interface State {}

export class Hand extends Component<Props, State> {
  render() {
    return (
      <div className="hand">
        <Cards cards={this.props.cards} />
      </div>
    );
  }
}
