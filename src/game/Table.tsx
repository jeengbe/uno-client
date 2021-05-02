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
    const handCards = [...match.hand];
    for (const index of match.cardsToPlay) {
      delete handCards[index];
    }

    return (
      <>
        <div className="table">
          <h1 className="status">{match.name}</h1>
          <div className="topCard">
            <Card card={match.topCard!} />
          </div>
          <Hand height="5rem" cards={match.cardsToPlay.map(index => match.hand[index])} onCardClick={index => match.unplayCard(index)} />
          {match.cardsToPlay.length > 0 && <button onClick={() => match.playCards()}>Play</button>}
          {match.isOwnTurn && <h3>Your turn!</h3>}
          {match.isOwnTurn && <button onClick={() => match.takeCard()}>Take Card</button>}
          <Hand height="15rem" cards={handCards} onCardClick={index => match.preparePlay(index)} />
        </div>
      </>
    );
  }
}
