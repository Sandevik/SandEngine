import './style.css'
import SandEngine from './models/SandEngine'
import EngineUiElement from './models/EngineUiElement';


const screen = new SandEngine();


screen.addEffect((e) => {
  
  if (e?.mouseOneDown.value) {
    screen.drawSquare(e.mousePosition.value, "lg", e.buttonsPressed.value.includes("b") ? [0x00, 0x00, 0xff, 0xeb] : [0x00, 0xff, 0x00, 0xff])
    document.body.style.cursor = "crosshair"
  } else {
    document.body.style.cursor = "default"
  }

}, ["mousePosition"])

const btn = new EngineUiElement({backgroundColor: [0x0f, 0x0f, 0xde, 0xff], position: {x: 50, y: 50}, size: {dx: 100, dy: 50}})

screen.addElement(btn);

screen.addEffect((e) => {
  if (e?.buttonsPressed.value.includes("r")) screen.clear();
}, ["buttonsPressed"])