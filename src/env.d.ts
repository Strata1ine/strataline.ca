/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
  }
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady(): void;
  }
}
