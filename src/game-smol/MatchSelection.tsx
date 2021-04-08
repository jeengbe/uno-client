import React, { Component } from "react";

import "./matchSelection.scss";

export interface Props {
  joinMatch: (matchID: number) => void;
  matches: MatchDataPublic[];
}

export interface State {}

export class MatchSelection extends Component<Props, State> {
  render(): JSX.Element {
    return (
      <div className="matchSelection">
        <h1>Select a match:</h1>
        {this.props.matches.map(match => (
          <div key={match.ID} className="matchPreview" onClick={() => void this.props.joinMatch(match.ID)}>
            <div className="name">{match.name}</div>
            <div className="id">{match.ID}</div>
          </div>
        ))}
      </div>
    );
  }
}
