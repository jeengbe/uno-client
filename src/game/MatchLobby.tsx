import React, { Component } from "react";
import { Player } from "./Player";

export interface Props {
  player: Player;
}

export interface State {}

export class MatchLobby extends Component<Props, State> {
  render(): JSX.Element {
    const match = this.props.player.currentMatch!;

    return (
      <>
        <h1 className="status">Waiting for match to start: {match.name}</h1>
        {match.isMaster && <button onClick={() => this.props.player.startMatch()}>Start match</button>}
        <button onClick={() => match.leave()}>Disconnect</button>
        <div className="playerList">
          {Array.from(match.players).map(([_nr, player]) => (
            <div key={player.ID} className="player">
              {player.username}
            </div>
          ))}
        </div>
      </>
    );
  }
}
