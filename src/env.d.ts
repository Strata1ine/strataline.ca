/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    index: CollectionEntry<"index">;
    services: CollectionEntry<"services">[];
    faqData: Array<any>;
    reviewData: Array<any>;
    nextPos: Pos;
    getNextPos: () => Pos;
  }
}
