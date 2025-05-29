/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    index: CollectionEntry<"index">;
    services: CollectionEntry<"services">[];
    nextPos: Pos;
    getNextPos: () => Pos;
    nextSwap: Pos;
    getNextSwap: () => Pos;
  }
}
