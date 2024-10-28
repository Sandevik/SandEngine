import './style.css'
import Engine from './Engine'


const screen = new Engine({updateFrequency: 15});




screen.addEffect((e) => {
  
  if (e?.mouseOneDown.value) {
    console.log("draw square")
    screen.drawSquare(e.mousePosition.value, "md", [0x000, 0x000, 0xfff, 0xfff])
  }



}, ["mousePosition"])