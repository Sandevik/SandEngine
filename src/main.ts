import './style.css'
import Engine from './Engine'


const screen = new Engine();


screen.addEffect((e) => {
  
  if (e?.mouseOneDown.value) {
    screen.drawSquare(e.mousePosition.value, "lg", e.buttonsPressed.value.includes("b") ? [0x00, 0x00, 0xff, 0xeb]: [0x00, 0xff, 0x00, 0xff])
    document.body.style.cursor = "crosshair"
  } else {
    document.body.style.cursor = "default"
  }

}, ["mousePosition"])

screen.addEffect((e) => {
  if (e?.buttonsPressed.value.includes("r")) screen.clear();
}, ["buttonsPressed"])