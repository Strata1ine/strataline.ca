/// <reference types="astro/client" />
/// <reference path="../.astro/types.d.ts" />

declare module "*.yaml" {
  const value: any;
  export default value;
}
