import './style.css'
import SandEngine from './models/Engine/SandEngine'
import EngineUiElement from './models/Engine/EngineUiElement';
import Vector from './models/Math/Vector';
import Matrix from './models/Math/Matrix';


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


let vec1 = new Vector(3).set([1,2,3]);
let vec2 = new Vector(3).set([4,5,6]);
let vec3 = new Vector(3).set([7,8,9])

let m = new Matrix([vec1, vec2, vec3]);

let complexM = new Matrix([new Vector(3).set([7,3,2]), new Vector(3).set([4,2,5]), new Vector(3).set([2,2,2])])

let vec4 = complexM.multiplyWithVector(vec3);
console.log(vec4.vec, m.transform(complexM).print())
