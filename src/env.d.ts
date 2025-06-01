/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    index: CollectionEntry<"index">;
    services: CollectionEntry<"services">[];
    serviceCovers: Map<string, OptimizedImage[]>;
    nextPos: Pos;
    getNextPos: () => Pos;
    nextSwap: Pos;
    getNextSwap: () => Pos;
  }
}
