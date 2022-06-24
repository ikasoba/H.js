/**
 * @template {Function} T
 * @typedef {T extends (k:string,v:infer F) => any ? F : never} Listener
 */

/**
 * @typedef {{
 *   on?: Record<string,Listener<Element["addEventListener"]>>,
 *   style?: string | Record<string,string|(string|Receiver<any>)[]>,
 *   [key:string]: string | undefined | Record<string,string|(string|Receiver<any>)[]> | Record<string,Listener<Element["addEventListener"]>>
 * }} Attrs
 */

/** @typedef {(attrs:Attrs,...children:(Element|string|Receiver<any>)[]) => HTMLElement} HJSComponent */

/** @type {(a:any[])=>a is string[]} */
const isStringArray = a => a.every(x => (typeof x === "string" && /** @type {any} */(x)?.raw==undefined));

export const generateRandomName = () => "H__"+crypto.getRandomValues(new Uint32Array(new ArrayBuffer(8)))[0].toString(16).padStart(8,"0")+"__"

/**
 * CSSスタイルを生成します。
 * @param {[TemplateStringsArray,...any[]]|string[]} template
 * @returns {[string,HTMLStyleElement]}
 */
export const style = (...template) => {
  const e = document.createElement("style")
  const a = (isStringArray(template) ? /** @type {[{raw:string[]}]} */([{raw:template}]) : template)
  const name = generateRandomName()
  e.textContent = `.${name} {${String.raw(a[0], ...a.slice(1))}}`
  return [name,e]
};

/**
 * @type {(arg:[string,HTMLStyleElement])=>string}
 */
export const setStyle = ([name,style]) => {
  document.head.append(style)
  return name
}

/** @template T */
export class Receiver {
  listeners = new Set()
  value = /** @type {T} */(/** @type {any} */(undefined))

  /** @param {T} v */
  constructor(v){
    this.value = v
  }
  /** @param {(v:T,p:T)=>void} f */
  listen(f){
    this.listeners.add(f)
  }
  
  /** @param {T} v */
  send(v){
    const pre = this.value
    this.value = v
    this.listeners.forEach( f => f(v,pre) )
  }
  [Symbol.toPrimitive](){
    return this.value
  }
}

class HTTPStatusError extends Error {
  /** @param {Response} res */
  constructor (res){
    super(`status: ${res.status} ${res.statusText}`)
  }
}

/** @param {string} url */
export const createStyleFromURL = async (url) => {
  const res = await fetch(url)
  if (!res.ok)throw new HTTPStatusError(res);
  const raw = await res.text()
  return style(raw)
};

/**
 * @param {Receiver<any>} r
 * @param {Text|Element} n
 */
export function receiverListener(r,n){
  r.listen((v) => {
    if (n instanceof Text){
      n.textContent = "" + v
    }else{
      n.replaceWith(v)
      n=v
    }
  })
  return n
}

/**
 * @param {string|HJSComponent} tag
 * @param {Attrs|undefined|null} attrs
 * @param {(Element|string|Receiver<any>)[]} children
 */
export const h = (tag,attrs={},...children) => {
  if (attrs==undefined)attrs = {};
  if (tag instanceof Function){
    return tag(attrs,...children)
  }
  const e = document.createElement(tag)

  // イベント設定
  Object.entries(attrs.on || {}).forEach(([k,v]) => e.addEventListener(k,v))
  delete attrs.on

  // スタイル設定
  if (typeof attrs.style === "string"){
    e.style.cssText = attrs.style
  }else if (attrs.style){
    Object.entries(attrs.style).forEach(([key,value])=>{
      if (value instanceof Array){
        e.style.setProperty(key,value.map(x=>{
          if (x instanceof Receiver){
            x.listen(() => {
              e.style.setProperty(key,value.join())
            })
            return ""+x
          }else return x
        }).join(""))
      }else e.style.setProperty(key,value)
    })
  }
  delete attrs.style

  // その他属性設定
  Object.entries(/** @type {Record<string,string>} */(attrs)).forEach(([k,v]) => e.setAttribute(k,v))

  // 子を設定
  e.append(...children.map( x => x instanceof Receiver ? receiverListener(x,!(x.value instanceof Element) ? document.createTextNode(""+x.value) : x.value) : x))
  return e
};

/**
 * @param {string} url
 */
export const goto = (url) => void(h("a",{href:url}).click());