export enum Pos {
  Left = "left",
  Right = "right",
}

export function swapPos(pos: Pos): Pos {
  return pos === Pos.Left ? Pos.Right : Pos.Left;
}

let nextPos = Pos.Right;

export function setNextPos(pos: Pos) {
  nextPos = pos;
};

export function getNextPos(): Pos {
  nextPos = swapPos(nextPos);
  return nextPos;
};
