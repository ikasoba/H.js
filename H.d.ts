/**
 * @param {Receiver<any>} r
 * @param {Text} n
 */
export function receiverListener(r: Receiver<any>, n: Text): Text;
export function generateRandomName(): string;
export function style(...template: [TemplateStringsArray, ...any[]] | string[]): (string | HTMLStyleElement)[];
/**
 * @type {(name:string,style:HTMLStyleElement)=>string}
 */
export const setStyle: (name: string, style: HTMLStyleElement) => string;
/** @template T */
export class Receiver<T> {
    /** @param {T} v */
    constructor(v: T);
    listeners: Set<any>;
    value: T;
    /** @param {(v:T)=>void} f */
    listen(f: (v: T) => void): void;
    /** @param {T} v */
    send(v: T): void;
    [Symbol.toPrimitive](): T;
}
export function createStyleFromURL(url: string): Promise<(string | HTMLStyleElement)[]>;
export function h(tag: string | HJSComponent, attrs?: Attrs | undefined | null, ...children: (Element | string | Receiver<any>)[]): HTMLElement;
export function goto(url: string): undefined;
export type Listener<T extends Function> = T extends (k: string, v: infer F) => any ? F : never;
export type Attrs = {
    on?: Record<string, Listener<Element["addEventListener"]>>;
    style?: string | CSSStyleDeclaration;
} & Record<string, string>;
export type HJSComponent = (attrs: Attrs, ...children: (Element | string | Receiver<any>)[]) => HTMLElement;
