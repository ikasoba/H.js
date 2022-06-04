import type { Attrs } from "./H"

export type * from "./H"

export namespace JSX {
  export type IntrinsicElements = HTMLElement & Attrs
}