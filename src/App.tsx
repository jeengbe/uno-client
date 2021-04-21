import React, { Component } from "react";

import "./App.scss";
import { Game as Player } from "./game/Player";
import { Match } from "./game/Match";
import { MatchLobby } from "./game/MatchLobby";
import { MatchOngoing } from "./game/MatchOngoing";
import { MatchSelection } from "./game/MatchSelection";

interface Props {}

export interface State {
  state:
    | "SOCKET_ERROR" // General error
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
    | "MATCH_LOADING" // Loading match data after join
    | "MATCH_WAITING" // Waiting for the match to start
    | "MATCH_ONGOING"; // Currently in a match

  matches: MatchDataPublic[];
  currentMatch: Match | null;
}

export default class App extends Component<Props, State> {
  private readonly player: Player;
  private reconnectTimeout: number | null;
  private readonly timeToReconnect = 100000000000;

  constructor(props: Props) {
    super(props);
    console.clear();

    this.state = {
      state: "SOCKET_CONNECTING",
      matches: [],
      currentMatch: null,
    };

    this.player = new Player(window.location.hash);
    this.reconnectTimeout = null;
  }

  async componentDidMount(): Promise<void> {
    await this.connect();
  }

  /**
   * Connect to the game socket
   *
   * @return When matches have loaded
   */
  private async connect(): Promise<void> {
    this.setState({
      state: "SOCKET_CONNECTING",
    });

    // Init connection
    await this.player.connect(err => {
      console.log(err);
      this.setState({
        state: err,
      });
      this.reconnectTimeout = window.setTimeout(() => void this.connect(), this.timeToReconnect);
    });

    await this.player.awaitWelcome();
    this.setState({
      state: "SOCKET_AUTH",
    });

    // Login
    try {
      await this.player.doAuth();
    } catch (err) {
      return void this.setState({
        state: "SOCKET_AUTH_ERROR",
      });
    }
    this.setState({
      state: "SOCKET_SUCCESS",
    });

    await this.loadMatches();
  }

  private async loadMatches(): Promise<void> {
    this.setState({
      state: "MATCHES_LOADING",
    });
    try {
      this.setState({
        matches: await this.player.loadMatches(),
      });
      this.setState({
        state: "MATCHES_SELECT",
      });
    } catch (err) {
      this.setState({
        state: "SOCKET_ERROR",
      });
    }

    // TODO: Remove
    this.joinMatch(1);
  }

  /**
   * Join a match
   */
  public async joinMatch(matchID: number): Promise<void> {
    this.setState({
      state: "MATCH_JOINING",
    });
    await this.player.joinMatch(matchID);
    this.setState({
      state: "MATCH_LOADING",
    });
    this.setState({
      state: "MATCH_WAITING",
      currentMatch: new Match(this, await this.player.loadCurrentMatchData()),
    });

    this.player.attachMatchHandlers(this);

    // TODO: Remove
    this.player.startMatch();
  }

  /**
   * Start the current match
   */
  public startMatch(data: { topCard: number; cards: number[] }): void {
    const { topCard, cards } = data;

    this.state.currentMatch!.topCard = topCard;
    this.state.currentMatch!.cards = cards;

    this.setState({
      state: "MATCH_ONGOING",
    });
  }

  public leave(): void {
    this.loadMatches();
  }

  componentWillUnmount(): void {
    if (this.reconnectTimeout !== null) {
      window.clearTimeout(this.reconnectTimeout);
    }
    this.player.disconnect();
  }

  render(): JSX.Element {
    // return (
    //   <div className="cardShowcase">
    //     <CardShowcase cards={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]} />
    //     <CardShowcase cards={[16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]} />
    //     <CardShowcase cards={[32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46]} />
    //     <CardShowcase cards={[48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62]} />
    //   </div>
    // );

    return {
      SOCKET_ERROR: (
        <>
          <h1 className="status error">Server error</h1>
          <h2 className="status">Waiting to reconnect</h2>
        </>
      ),
      SOCKET_CONNECTING: <h1 className="status">Connecting</h1>,
      SOCKET_AUTH: <h1 className="status">Logging in</h1>,
      SOCKET_AUTH_ERROR: <h1 className="status error">Error logging in</h1>,
      SOCKET_SUCCESS: <h1 className="status">Successfully connected</h1>,
      MATCHES_LOADING: <h1 className="status">Loading matches</h1>,
      MATCHES_SELECT: <MatchSelection joinMatch={this.joinMatch.bind(this)} matches={this.state.matches} />,
      MATCH_JOINING: <h1 className="status">Joining match</h1>,
      MATCH_LOADING: <h1 className="status">Loading match data</h1>,
      MATCH_WAITING: <MatchLobby game={this.player} match={this.state.currentMatch!} />,
      MATCH_ONGOING: <MatchOngoing game={this.player} match={this.state.currentMatch!} />,
    }[this.state.state];
  }
}
