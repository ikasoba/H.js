import type {Attrs} from "./H"
export type * from "./H"

declare global {
  declare namespace JSX {
    export type ElementClass = never
    export interface Element extends Attrs,HTMLElement {}
    export interface IntrinsicAttributes extends Attrs {}
    export interface IntrinsicElements {}
  }
}
