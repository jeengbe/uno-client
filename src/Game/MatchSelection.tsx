import React, { Component } from "react";
import { Cards } from "./Cards";

import "./matchSelection.scss";

export interface Props {
  matches: MatchData[];
}

export interface State {}

export class MatchSelection extends Component<Props, State> {
  render(): JSX.Element {
    return (
      <div className="matchSelection">
        <h1>Select a match:</h1>
        {this.props.matches.map(match => (
          <div key={match.ID} className="matchPreview">
            <Cards cards={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]} overlap={true} />
            <div className="name">{match.name}</div>
            <div className="id">{match.ID}</div>
          </div>
        ))}
      </div>
    );
  }
}
