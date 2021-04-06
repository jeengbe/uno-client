import React, { Component } from "react";
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
   * - 0000-1001: 0-9
   * - 1010 (10): +2
   * - 1001 (11): No U
   * - 1010 (12): Skip
   * - 1011 (13): +4
   * - 1100 (14): Change Color
   */
  card: number;
  inline?: boolean;
}

export interface State {
  flipped: boolean;
}

export type Color = "red" | "green" | "blue" | "yellow";
export type Value = "n0" | "n1" | "n2" | "n3" | "n4" | "n5" | "n6" | "n7" | "n8" | "n9" | "p2" | "noU" | "skip" | "p4" | "clr";

const colors: Color[] = ["red", "green", "blue", "yellow"];
const values: Value[] = ["n0", "n1", "n2", "n3", "n4", "n5", "n6", "n7", "n8", "n9", "p2", "noU", "skip", "p4", "clr"];

export class Card extends Component<Props, State> {
  public static readonly CONFIG = {
    radius: 20,
    width: 560,
    height: 889,
    cornerMargin: 80,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      flipped: false,
    };
  }

  render(): JSX.Element {
    const { card } = this.props;
    const color = colors[card >> 4];
    const value = card & 15;

    const { width, height, radius } = Card.CONFIG;
    const stripesTop = (19 * height) / 20;

    return (
      <div
        className="cardContainer"
        onClick={() => {
          this.setState(state => ({
            flipped: !state.flipped,
          }));
        }}
      >
        <svg
          className={classNames({
            card: true,
            [color]: true,
            dark: value >= 13 || this.state.flipped,
          })}
          viewBox="0 0 560 889"
        >
          <path className="background" d={`M ${radius},0 l ${width - 2 * radius},0 a ${radius},${radius} 0 0,1 ${radius},${radius} l 0,${height - 2 * radius} a ${radius},${radius} 0 0,1 -${radius},${radius} l -${width - 2 * radius},0 a ${radius},${radius} 0 0,1 -${radius},-${radius} l 0,-${height - 2 * radius} a ${radius},${radius} 0 0,1 ${radius},-${radius}`} />
          {this.state.flipped ? (
            <>
              <path strokeWidth={15} stroke="var(--green)" style={{ fill: "none" }} d={`M 0,${stripesTop} l ${width / 4},0`} />
              <path strokeWidth={15} stroke="var(--red)" style={{ fill: "none" }} d={`M ${width / 4},${stripesTop} l ${width / 4},0`} />
              <path strokeWidth={15} stroke="var(--blue)" style={{ fill: "none" }} d={`M ${(2 * width) / 4},${stripesTop} l ${width / 4},0`} />
              <path strokeWidth={15} stroke="var(--yellow)" style={{ fill: "none" }} d={`M ${(3 * width) / 4},${stripesTop} l ${width / 4},0`} />
            </>
          ) : (
            <>
              {getCornerTop(value)}
              {getMiddle(value)}
              {getCornerBottom(value)}
            </>
          )}
        </svg>
      </div>
    );
  }
}

export const buildCard = (color: Color, value: Value): number => (colors.indexOf(color) << 4) | values.indexOf(value);

/**
 * @deprecated
 */
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

/**
 * Get the top corner symbol of a card
 */
const getCornerTop = (value: number) => {
  const { cornerMargin } = Card.CONFIG;
  const radius = 50;

  if (value < 10) {
    return (
      <text textAnchor="middle" alignmentBaseline="mathematical" fontSize="100" fill="var(--on-red)" transform={`translate(${cornerMargin}, ${cornerMargin})`}>
        {value}
      </text>
    );
  }

  switch (value) {
    case 10: // +2
      return (
        <text textAnchor="middle" alignmentBaseline="mathematical" fontSize="100" fill="var(--on-red)" transform={`translate(${cornerMargin}, ${cornerMargin})`}>
          +2
        </text>
      );
    case 11: // No U
      return (
        <text textAnchor="middle" alignmentBaseline="mathematical" fontSize="100" fill="var(--on-red)" transform={`translate(${cornerMargin}, ${cornerMargin})`}>
          No
        </text>
      );
    case 12: // Skip
      return <g transform={`translate(${cornerMargin}, ${cornerMargin})`}>{skip(radius, 10)}</g>;
    case 13: // +4
      return (
        <text textAnchor="middle" alignmentBaseline="mathematical" fontSize="100" fill="var(--on-red)" transform={`translate(${cornerMargin}, ${cornerMargin})`}>
          +4
        </text>
      );
    case 14: // Change Color
      return <g transform={`translate(${cornerMargin}, ${cornerMargin})`}>{changeColor(radius, 10, 50 / 3)}</g>;
    default:
      throw new Error("Unknown card value: " + value);
  }
};

/**
 * Get the bottom corner symbol of a card
 */
const getCornerBottom = (value: number) => {
  const { width, height, cornerMargin } = Card.CONFIG;
  const radius = 50;

  if (value < 10) {
    return (
      <text textAnchor="middle" alignmentBaseline="mathematical" fontSize="100" fill="var(--on-red)" transform={`translate(${width - cornerMargin}, ${height - cornerMargin}) rotate(180)`}>
        {value}
      </text>
    );
  }

  switch (value) {
    case 10: // +2
      return (
        <text textAnchor="middle" alignmentBaseline="mathematical" fontSize="100" fill="var(--on-red)" transform={`translate(${width - cornerMargin}, ${height - cornerMargin}) rotate(180)`}>
          +2
        </text>
      );
    case 11: // No U
      return (
        <text textAnchor="middle" alignmentBaseline="mathematical" fontSize="100" fill="var(--on-red)" transform={`translate(${width - cornerMargin}, ${height - cornerMargin}) rotate(180)`}>
          No
        </text>
      );
    case 12: // Skip
      return <g transform={`translate(${width - cornerMargin}, ${height - cornerMargin}) rotate(180)`}>{skip(radius, 10)}</g>;
    case 13: // +4
      return (
        <text textAnchor="middle" alignmentBaseline="mathematical" fontSize="100" fill="var(--on-red)" transform={`translate(${width - cornerMargin}, ${height - cornerMargin}) rotate(180)`}>
          +4
        </text>
      );
    case 14: // Change Color
      return <g transform={`translate(${width - cornerMargin}, ${height - cornerMargin}) rotate(180)`}>{changeColor(radius, 10, 50 / 3)}</g>;
    default:
      throw new Error("Unknown card value: " + value);
  }
};

/**
 * Get the middle symbol of a card
 */
const getMiddle = (value: number) => {
  const { width, height } = Card.CONFIG;
  const radius = 180;

  if (value < 10) {
    return (
      <text x="280" y="444.5" textAnchor="middle" alignmentBaseline="central" fontSize="400" fill="currentColor">
        {value}
      </text>
    );
  }
  switch (value) {
    case 10: // +2
      return (
        <text x="280" y="444.5" textAnchor="middle" alignmentBaseline="central" fontSize="400" fill="currentColor">
          +2
        </text>
      );
    case 11: // No U
      return (
        <text x="280" y="444.5" textAnchor="middle" alignmentBaseline="central" fontSize="400" fill="currentColor">
          U
        </text>
      );
    case 12: // Skip
      return <g transform={`translate(${width / 2},${height / 2})`}>{skip(radius, 15)}</g>;
    case 13: // +4
      return <g transform={`translate(${width / 2},${height / 2})`}>{plusFour(height / 10, width / 10, 10, 5, 10)}</g>;
    case 14: // Change Color
      return <g transform={`translate(${width / 2},${height / 2})`}>{changeColor(radius, 15, 60)}</g>;
    default:
      throw new Error("Unknown card value: " + value);
  }
};

const plusFour = (height: number, width: number, radius: number, strokeWidth: number, strokeGap: number) => {
  return (
    <>
      <path strokeWidth={strokeWidth + strokeGap} stroke="var(--card-bg)" style={{ fill: "none" }} d={`M ${-(11 / 7) * width},${-(-1 / 7) * height} m ${radius},0 l ${width - 2 * radius},0 a ${radius},${radius} 0 0,1 ${radius},${radius} l 0,${height - 2 * radius} a ${radius},${radius} 0 0,1 -${radius},${radius} l -${width - 2 * radius},0 a ${radius},${radius} 0 0,1 -${radius},-${radius} l 0,-${height - 2 * radius} a ${radius},${radius} 0 0,1 ${radius},-${radius}`} />
      <path strokeWidth={strokeWidth} stroke="var(--yellow)" style={{ fill: "none" }} d={`M ${-(11 / 7) * width},${-(-1 / 7) * height} m ${radius},0 l ${width - 2 * radius},0 a ${radius},${radius} 0 0,1 ${radius},${radius} l 0,${height - 2 * radius} a ${radius},${radius} 0 0,1 -${radius},${radius} l -${width - 2 * radius},0 a ${radius},${radius} 0 0,1 -${radius},-${radius} l 0,-${height - 2 * radius} a ${radius},${radius} 0 0,1 ${radius},-${radius}`} />
      <path strokeWidth={strokeWidth + strokeGap} stroke="var(--card-bg)" style={{ fill: "none" }} d={`M ${-(6 / 7) * width},${-(5 / 7) * height} m ${radius},0 l ${width - 2 * radius},0 a ${radius},${radius} 0 0,1 ${radius},${radius} l 0,${height - 2 * radius} a ${radius},${radius} 0 0,1 -${radius},${radius} l -${width - 2 * radius},0 a ${radius},${radius} 0 0,1 -${radius},-${radius} l 0,-${height - 2 * radius} a ${radius},${radius} 0 0,1 ${radius},-${radius}`} />
      <path strokeWidth={strokeWidth} stroke="var(--red)" style={{ fill: "none" }} d={`M ${-(6 / 7) * width},${-(5 / 7) * height} m ${radius},0 l ${width - 2 * radius},0 a ${radius},${radius} 0 0,1 ${radius},${radius} l 0,${height - 2 * radius} a ${radius},${radius} 0 0,1 -${radius},${radius} l -${width - 2 * radius},0 a ${radius},${radius} 0 0,1 -${radius},-${radius} l 0,-${height - 2 * radius} a ${radius},${radius} 0 0,1 ${radius},-${radius}`} />
      <path strokeWidth={strokeWidth + strokeGap} stroke="var(--card-bg)" style={{ fill: "none" }} d={`M ${-(1 / 7) * width},${-(2 / 7) * height} m ${radius},0 l ${width - 2 * radius},0 a ${radius},${radius} 0 0,1 ${radius},${radius} l 0,${height - 2 * radius} a ${radius},${radius} 0 0,1 -${radius},${radius} l -${width - 2 * radius},0 a ${radius},${radius} 0 0,1 -${radius},-${radius} l 0,-${height - 2 * radius} a ${radius},${radius} 0 0,1 ${radius},-${radius}`} />
      <path strokeWidth={strokeWidth} stroke="var(--green)" style={{ fill: "none" }} d={`M ${-(1 / 7) * width},${-(2 / 7) * height} m ${radius},0 l ${width - 2 * radius},0 a ${radius},${radius} 0 0,1 ${radius},${radius} l 0,${height - 2 * radius} a ${radius},${radius} 0 0,1 -${radius},${radius} l -${width - 2 * radius},0 a ${radius},${radius} 0 0,1 -${radius},-${radius} l 0,-${height - 2 * radius} a ${radius},${radius} 0 0,1 ${radius},-${radius}`} />
      <path strokeWidth={strokeWidth + strokeGap} stroke="var(--card-bg)" style={{ fill: "none" }} d={`M ${(4 / 7) * width},${-(8 / 7) * height} m ${radius},0 l ${width - 2 * radius},0 a ${radius},${radius} 0 0,1 ${radius},${radius} l 0,${height - 2 * radius} a ${radius},${radius} 0 0,1 -${radius},${radius} l -${width - 2 * radius},0 a ${radius},${radius} 0 0,1 -${radius},-${radius} l 0,-${height - 2 * radius} a ${radius},${radius} 0 0,1 ${radius},-${radius}`} />
      <path strokeWidth={strokeWidth} stroke="var(--blue)" style={{ fill: "none" }} d={`M ${(4 / 7) * width},${-(8 / 7) * height} m ${radius},0 l ${width - 2 * radius},0 a ${radius},${radius} 0 0,1 ${radius},${radius} l 0,${height - 2 * radius} a ${radius},${radius} 0 0,1 -${radius},${radius} l -${width - 2 * radius},0 a ${radius},${radius} 0 0,1 -${radius},-${radius} l 0,-${height - 2 * radius} a ${radius},${radius} 0 0,1 ${radius},-${radius}`} />
    </>
  );
};

const changeColor = (radius: number, strokeWidth: number, gap: number) => {
  return (
    <>
      <path strokeWidth={strokeWidth} stroke="var(--green)" style={{ fill: "none" }} d={`M 0,-${radius} m ${gap},0 a ${radius - gap},${radius - gap} 0 0,1 ${radius - gap},${radius - gap}`} />
      <path strokeWidth={strokeWidth} stroke="var(--red)" style={{ fill: "none" }} d={`M ${radius},0 m 0,${gap} a ${radius - gap},${radius - gap} 0 0,1 -${radius - gap},${radius - gap}`} />
      <path strokeWidth={strokeWidth} stroke="var(--blue)" style={{ fill: "none" }} d={`M 0,${radius} m -${gap},0 a ${radius - gap},${radius - gap} 0 0,1 -${radius - gap},-${radius - gap}`} />
      <path strokeWidth={strokeWidth} stroke="var(--yellow)" style={{ fill: "none" }} d={`M -${radius},0 m 0,-${gap} a ${radius - gap},${radius - gap} 0 0,1 ${radius - gap},-${radius - gap}`} />
    </>
  );
};

const skip = (radius: number, strokeWidth: number) => (
  <>
    <circle strokeWidth={strokeWidth} stroke="currentColor" fill="none" cx="0" cy="0" r={radius} />
    <line strokeWidth={strokeWidth} stroke="currentColor" fill="none" x1={-radius * Math.cos(Math.PI / 4)} y1={radius * Math.sin(Math.PI / 4)} x2={radius * Math.cos(Math.PI / 4)} y2={-radius * Math.sin(Math.PI / 4)} />
  </>
);
