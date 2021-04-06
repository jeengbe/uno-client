import { Component } from "react";
import classNames from "classnames";

export interface Props {
  /**
   * 000-0000
   *
   * Colors:
   * - 000: Red
   * - 001: Green
   * - 010: Blue
   * - 011: Yellow
   *
   * Value:
   * - 000-1001: 0-9
   * - 1010: +2
   * - 1011: +4
   * - 1100: No U
   * - 1101: Skip
   */
  card: number;
}

export interface State {
  flipped: boolean;
}

export type Color = "red" | "green" | "blue" | "yellow";
export type Value = "n0" | "n1" | "n2" | "n3" | "n4" | "n5" | "n6" | "n7" | "n8" | "n9" | "p2" | "noU" | "skip" | "p4" | "clr";

const colors: Color[] = ["red", "green", "blue", "yellow"],
  values: Value[] = ["n0", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9", "p2", "noU", "skip", "p4", "clr"],
  middle = {
    n0: "0",
    n1: "1",
    n2: "2",
    n3: "3",
    n4: "4",
    n5: "5",
    n6: "6",
    n7: "7",
    n8: "8",
    n9: "9",
    noU: "U",
    p2: "+2",
    skip: (
      <svg viewBox="-4 -4 108 108">
        <path strokeWidth="8px" stroke="currentColor" fill="none" d="M 0,50 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0 M 14.6446609407,85.3553390593 L 85.3553390593,14.6446609407" />
      </svg>
    ),
    p4: "+4",
    clr: (
      <svg viewBox="-3 -3 106 106">
        <path strokeWidth="6px" stroke="#7fb814" fill="none" d="M 50,0 m 1,0 a 48,48 0 0,1 49,49" />
        <path strokeWidth="6px" stroke="#c34824" fill="none" d="M 100,50 m 0,1 a 48,48 0 0,1 -49,49" />
        <path strokeWidth="6px" stroke="#1559b1" fill="none" d="M 50,100 m -1,0 a 48,48 0 0,1 -49,-49" />
        <path strokeWidth="6px" stroke="#dac508" fill="none" d="M 0,50 m 0,-1 a 48,48 0 0,1 49,-49" />
      </svg>
    ),
  },
  corner = {
    n0: "0",
    n1: "1",
    n2: "2",
    n3: "3",
    n4: "4",
    n5: "5",
    n6: "6",
    n7: "7",
    n8: "8",
    n9: "9",
    noU: "U",
    p2: "+2",
    skip: (
      <svg viewBox="-4 -4 108 108">
        <path strokeWidth="8px" stroke="currentColor" fill="none" d="M 0,50 a 50,50 0 1,1 100,0 a 50,50 0 1,1 -100,0 M 14.6446609407,85.3553390593 L 85.3553390593,14.6446609407" />
      </svg>
    ),
    p4: "+4",
    clr: (
      <svg viewBox="-3 -3 106 106">
        <path strokeWidth="6px" stroke="#7fb814" fill="none" d="M 50,0 m 1,0 a 48,48 0 0,1 49,49" />
        <path strokeWidth="6px" stroke="#c34824" fill="none" d="M 100,50 m 0,1 a 48,48 0 0,1 -49,49" />
        <path strokeWidth="6px" stroke="#1559b1" fill="none" d="M 50,100 m -1,0 a 48,48 0 0,1 -49,-49" />
        <path strokeWidth="6px" stroke="#dac508" fill="none" d="M 0,50 m 0,-1 a 48,48 0 0,1 49,-49" />
      </svg>
    ),
  };

export class Card extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      flipped: false,
    };
  }

  render(): JSX.Element {
    const { card } = this.props,
      color = colors[card >> 4],
      value = values[card & 15];

    return (
      <div
        className={classNames({
          card: true,
          flipped: this.state.flipped,
          [color]: true,
          [value]: true,
          underline: ["n6", "n9"].includes(value),
        })}
        onClick={() => {
          this.setState(state => ({
            flipped: !state.flipped,
          }));
        }}
        style={{ top: `${Math.random() * 20 - 10}px` }}
      >
        {this.state.flipped || (
          <>
            <div className="top">{corner[value]}</div>
            <div className="middle">{middle[value]}</div>
            <div className="bottom">{corner[value]}</div>
          </>
        )}
      </div>
    );
  }
}

export const buildCard = (color: Color, value: Value): number => (colors.indexOf(color) << 4) | values.indexOf(value);

export const svgNum = (number: number): string => {
  const padding = 2;
  switch (number) {
  case 0:
    const radius = 25;
    return `M 50,${padding} a ${radius},${radius} 0 0,1 ${radius},${radius} l 0,${100 - 2 * radius - 2 * padding} a ${radius},${radius} 0 0,1 -${radius},${radius} a ${radius},${radius} 0 0,1 -${radius},-${radius} l 0,-${100 - 2 * radius - 2 * padding} a ${radius},${radius} 0 0,1 ${radius},-${radius}`;
  default:
    throw new Error("Not implemented!");
  }
};
