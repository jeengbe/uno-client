import { Component } from "react";
import { Cards } from "./Cards";

export interface Props {
  height: string;
  cards: number[];
  onCardClick?: (cardIndex: number) => void;
}

export interface State {}

export class Hand extends Component<Props, State> {
  render(): JSX.Element {
    return (
      <div className="hand">
        <Cards onCardClick={this.props.onCardClick} height={this.props.height} cards={this.props.cards} />
      </div>
    );
  }
}
