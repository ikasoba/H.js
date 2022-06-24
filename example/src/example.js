import {h, Receiver, style, setStyle} from "../H.js"

const name = setStyle(style`
  border: 0.5rem solid #F00;
  color: #0F0;
  background: #00F;
  font-size: 2rem;
`)

const button = () => {
  const i = new Receiver(0)
  return h("button",{
    on:{
      click(){
        i.send(i+1)
      }
    },
    class: name
  },
    "i: ",i
  )
}

const main = () => {
  return h("div",{},
    button(),button(),button()
  )
}
document.body.append(main())