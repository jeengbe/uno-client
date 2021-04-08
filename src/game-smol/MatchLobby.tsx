import React, { Component } from "react";
import { Game } from "./Game";
import { Match } from "./Match";

export interface Props {
  game: Game;
  match: Match;
}

export interface State {}

export class MatchLobby extends Component<Props, State> {
  render(): JSX.Element {
    return (
      <>
        <h1 className="status">Waiting for match to start: {this.props.match.name}</h1>
        {this.props.match.isMaster && <button onClick={() => this.props.game.startMatch()}>Start match</button>}
        <button onClick={() => this.props.match.leave()}>Disconnect</button>
        <div className="playerList">
          {this.props.match.players.map(player => (
            <div key={player.ID} className="player">
              {player.username}
            </div>
          ))}
        </div>
      </>
    );
  }
}
