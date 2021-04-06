import { Component } from "react";
import { Hand } from "./Game/Hand";

import "./App.scss";
import { Game } from "./Game/Game";

interface Props {}

interface State {
  state: "SOCKET_CONNECT" | "SOCKET_AUTH" | "SOCKET_AUTH_ERROR" | "SOCKET_SUCCESS" | "SOCKET_ERROR";
}

export default class App extends Component<Props, State> {
  private readonly game: Game;

  constructor(props: Props) {
    super(props);
    console.clear();

    this.state = {
      state: "SOCKET_CONNECT",
    };

    this.game = new Game("Jesper");
  }

  async componentDidMount(): Promise<void> {
    this.setState({
      state: "SOCKET_CONNECT",
    });

    // Init connection
    try {
      await this.game.connect();
    } catch (err) {
      return void this.setState({
        state: "SOCKET_ERROR",
      });
    }
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
  }

  componentWillUnmount(): void {
    this.game.disconnect();
  }

  render(): JSX.Element {
    return (
      <div className="app">
        {
          {
            SOCKET_ERROR: <h1 className="status error">Unknown error</h1>,
            SOCKET_CONNECT: <h1 className="status">Connecting</h1>,
            SOCKET_AUTH: <h1 className="status">Logging in</h1>,
            SOCKET_AUTH_ERROR: <h1 className="status error">Error logging in</h1>,
            SOCKET_SUCCESS: <Hand cards={[]} />,
          }[this.state.state]
        }
      </div>
    );
  }
}
