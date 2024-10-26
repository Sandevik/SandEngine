import './style.css'
import Engine from './Engine'


const screen = new Engine();


/* screen.addEventListener("click", (e) => {
  console.log(e);
  //@ts-ignore
  const pos = {x: e.clientX - 13, y: e.clientY - 20}

  screen.drawSquare({x1: 10+pos.x, x2: 20+pos.x, y1: 20+pos.y, y2: 30+pos.y},[0x001,0xfff,0x001,0xfff])
}) */

  screen.addEventListener("drag", (e) => {
    //@ts-ignore
    console.log(e.clientY)
    //@ts-ignore
    const pos = {x: e.clientX, y:e.clientY}
    screen.drawPixel(pos, [0x001,0x000,0xfff,0xfff])
    //screen.drawSquare({x1: 10+pos.x, x2: 20+pos.x, y1: 20+pos.y, y2: 30+pos.y},[0x001,0x000,0xfff,0xfff])
  })