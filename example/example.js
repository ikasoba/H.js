import {h, Receiver, style, setStyle} from "../H.js"

const name = setStyle(style`
  border: 0.5rem solid #F00;
  color: #0F0;
  background: #00F;
  font-size: 2rem;
`)

const state = new Receiver(0)
const main = h("button",{
              on:{
                click(){
                  state.send(state+1)
                }
              },
              class: name
            },[
              "i: ",state
            ])
document.body.append(main)