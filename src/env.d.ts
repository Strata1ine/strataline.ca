/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

interface PageSchema {
  t: string,
  id: string,
}

declare namespace App {
  interface Locals {
    index: CollectionEntry<"index">;
    services: CollectionEntry<"services">[];
    schema: PageSchema,
    faqData: Array<any>;
    reviewData: Array<any>;
    nextPos: Pos;
    getNextPos: () => Pos;
    nextSwap: Pos;
    getNextSwap: () => Pos;
    globalDefaults: any;
  }
}
