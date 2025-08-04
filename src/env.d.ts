/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    faqData: import("@sections/registry").SubPropsOf<"Faq", "content">,
    reviewData: import("@sections/registry").SubPropsOf<"Reviews", "content">,
  }
}
