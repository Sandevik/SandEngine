import './style.css'
import Engine from './Engine'


const screen = new Engine({updateFrequency: 15});

screen.addEventListener("mousedown", () => {
  screen.addEventListener("mousemove", (e) => {
    //@ts-ignore
    //console.log(e.clientY)
    //@ts-ignore
    const pos = {x: e.clientX, y: e.clientY}
    screen.drawSquare(pos, "md", [0x001,0x000,0xfff,0xfff])
  })
  screen.removeEventListener("mousemove")
})