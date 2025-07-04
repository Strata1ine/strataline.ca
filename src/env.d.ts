/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    nextPos: Pos;
    getNextPos: () => Pos;
    nextSwap: Pos;
    getNextSwap: () => Pos;
  }
}
