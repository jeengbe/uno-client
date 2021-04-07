import React, { Component } from "react";
import { Match } from "./Match";

export interface Props {
  match: Match;
  startMatch: () => void;
}

export interface State {}

export class MatchLobby extends Component<Props, State> {
  render(): JSX.Element {
    return (
      <>
        <h1 className="status">Waiting for match to start</h1>
        {this.props.match.isMaster && <button onClick={this.props.startMatch}>Start match</button>}
      </>
    );
  }
}
