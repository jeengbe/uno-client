import React, { Component } from "react";

import "./App.scss";
import { Game } from "./game/Game";
import { Match } from "./game/Match";
import { MatchSelection } from "./game/MatchSelection";

interface Props {}

export interface State {
  state:
    | "SOCKET_ERROR"
    // Connection
    | "SOCKET_CONNECTING" // Establishing connection
    | "SOCKET_AUTH" // Waiting for authentication
    | "SOCKET_AUTH_ERROR" // Authentication error
    | "SOCKET_SUCCESS" // Connection successfull
    // Match selection
    | "MATCHES_LOADING" // Loading matches
    | "MATCHES_SELECT" // Awaiting match selection
    // Actual game
    | "MATCH_JOINING" // Joining a match
    | "MATCH_LOADING"; // Loading match data after join
  matches: MatchDataPublic[];
  currentMatch: Match | null;
}

export default class App extends Component<Props, State> {
  private readonly game: Game;

  constructor(props: Props) {
    super(props);
    console.clear();

    this.state = {
      state: "SOCKET_CONNECTING",
      matches: [],
      currentMatch: null,
    };

    this.game = new Game("game1", "Jesper");
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      state: "SOCKET_CONNECTING",
    });

    // Init connection
    await this.game.connect(
      err =>
        void this.setState({
          state: err,
        })
    );

    await this.game.welcome();
    this.setState({
      state: "SOCKET_AUTH",
    });

    // Login
    try {
      await this.game.auth();
    } catch (err) {
      return void this.setState({
        state: "SOCKET_AUTH_ERROR",
      });
    }
    this.setState({
      state: "SOCKET_SUCCESS",
    });

    this.loadMatches();
  }

  private async loadMatches(): Promise<void> {
    this.setState({
      state: "MATCHES_LOADING",
    });
    try {
      this.setState({
        matches: await this.game.loadMatches(),
      });
      this.setState({
        state: "MATCHES_SELECT",
      });
    } catch (err) {
      this.setState({
        state: "SOCKET_ERROR",
      });
    }
  }

  /**
   * Join a match
   */
  public async joinMatch(matchID: string): Promise<void> {
    this.setState({
      state: "MATCH_JOINING",
    });
    await this.game.joinMatch(matchID);
    this.setState({
      state: "MATCH_LOADING",
    });
    this.setState({
      currentMatch: new Match(await this.game.loadCurrentMatchData()),
    });
  }

  componentWillUnmount(): void {
    this.game.disconnect();
  }

  render(): JSX.Element {
    return {
      SOCKET_ERROR: <h1 className="status error">Unknown error</h1>,
      SOCKET_CONNECTING: <h1 className="status">Connecting</h1>,
      SOCKET_AUTH: <h1 className="status">Logging in</h1>,
      SOCKET_AUTH_ERROR: <h1 className="status error">Error logging in</h1>,
      SOCKET_SUCCESS: <h1 className="status">Successfully connected</h1>,
      MATCHES_LOADING: <h1 className="status">Loading matches</h1>,
      MATCHES_SELECT: <MatchSelection joinMatch={this.joinMatch.bind(this)} matches={this.state.matches} />,
      MATCH_JOINING: <h1 className="status">Joining match</h1>,
      MATCH_LOADING: <h1 className="status">Loading match data</h1>,
    }[this.state.state];
  }
}
