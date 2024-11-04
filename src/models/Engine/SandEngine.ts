import EngineUiElement from "./EngineUiElement";

const defaultConfig: IEngineConfig = {
    clearColor: [0xff, 0xff, 0xff, 0xff],
    updateFrequency: 30
}

export default class SandEngine {

    private config: IEngineConfig; 
    private dimensions: {width: number, height: number;}
    private state: IEngineState = {mouseOneDown: {value: false, hasChanged: false}, mouseOneUp: {value: false, hasChanged: false}, mouseOneClick: {value: false, hasChanged: false}, buttonsPressed: {value: [], hasChanged: false}, mousePosition: {value: {x: 0, y: 0}, hasChanged: false}};
    private canvas: HTMLCanvasElement;
    private gl: WebGLRenderingContext;
    private buffer: WebGLBuffer;
    private program: WebGLProgram;
    private texture: WebGLTexture;
    private activeImageBuffer: Uint8ClampedArray;
    private bufferHasChanged: boolean;
    private effects: IEffect<keyof IEngineState>[] = [];
    private elements: EngineUiElement[] = [];
    private immutableIndecies: number[] = [];

    constructor(config?: IEngineConfig){
        this.config = {...defaultConfig, ...config};
        this.canvas = document.createElement("canvas");
        document.querySelector("body")?.appendChild(this.canvas);

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.dimensions = {height: window.innerHeight, width: window.innerWidth}

        const gl = this.canvas.getContext("webgl");
        if (gl == null) throw new Error("ERROR: Could not get WebGL context from canvas")
        this.gl = gl;

        this.addEventListeners();

        this.buffer = this.gl.createBuffer()!;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
            -1,  1,
             1, -1,
             1,  1,
        ]), this.gl.STATIC_DRAW);

        this.texture = this.gl.createTexture()!;
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

        const [vertexShader, fragmentShader] = this.createShaders();
        this.program = this.createProgram(vertexShader, fragmentShader);
    
        const positionLocation = this.gl.getAttribLocation(this.program, "a_position");
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.useProgram(this.program);
        this.gl.viewport(0, 0, this.dimensions.width, this.dimensions.height);

        
        const buffer = new Uint8ClampedArray(this.dimensions.width * this.dimensions.height * 4);
        for (let i = 0; i < buffer.length; i += 4) {
            buffer[i] = this.config.clearColor[0];     
            buffer[i + 1] = this.config.clearColor[1];
            buffer[i + 2] = this.config.clearColor[2];
            buffer[i + 3] = this.config.clearColor[3];
        }
        this.activeImageBuffer = buffer;
        this.bufferHasChanged = true;
        this.loop();
    }

    private createShaders(): WebGLShader[] {
        const vertexShaderSource = `
            attribute vec2 a_position;
            varying vec2 v_texCoord;
            void main() {
                gl_Position = vec4(a_position, 0, 1);
                v_texCoord = a_position * 0.5 + 0.5;
            }
        `;
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShaderSource = `
            precision mediump float;
            varying vec2 v_texCoord;
            uniform sampler2D u_image;
            void main() {
                gl_FragColor = texture2D(u_image, v_texCoord);
            }
        `;
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
        return [vertexShader, fragmentShader]
    }

    private createShader(type: GLenum, source: string): WebGLShader {
        const shader = this.gl.createShader(type);
        if (!shader) throw new Error("ERROR: Could not create shader");
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader)
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            const info = this.gl.getShaderInfoLog(shader);
            this.gl.deleteShader(shader);
            throw new Error(`ERROR: Could not compile shader, \n ${info}`);
        }
        return shader;
    }

    private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
        const program = this.gl.createProgram();
        if (!program) throw new Error("ERROR: Could not create program");
        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);
        if(!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            const info = this.gl.getProgramInfoLog(program);
            this.gl.deleteProgram(program);
            throw new Error(`ERROR: Could not link program: \n ${info}`)
        }
        this.gl.useProgram(program);
        return program;
    }
    
    public updateScreen(): void {
        this.bufferHasChanged = false;
        
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.dimensions.width, this.dimensions.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.activeImageBuffer);
        this.render();
        
    }
    
   
    private render(): void {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

   


    public getDimensions(): {height: number, width: number} {
        return this.dimensions;
    }
    
    public getState(): IEngineState {
        return this.state
    }


    // Some type of game loop
    private loop(): void {
        setInterval(() => {

            this.effects.forEach(effect => {
                let effectWillRun = false;
                effect.stateDependencies.forEach(effect => {
                    if (this.state[effect].hasChanged) {
                        effectWillRun = true;
                        this.state[effect].hasChanged = false;
                    }
                })

                // check if state dependencies has changed before running this
                if (effectWillRun) {

                    //todo: omit hasChanged Prop from state as it is unnessesary
                    effect.fn(this.state);
                }
            })

            if (this.bufferHasChanged) this.updateScreen();

        }, 1/(this.config.updateFrequency || 60)*1000);
    }

    private addEventListeners(): void {
        window.addEventListener("mousemove", (e) => {
            const pos = {x: e.clientX, y: e.clientY}

            this.state.mousePosition.value.x = pos.x;
            this.state.mousePosition.value.y = pos.y;
            this.state.mousePosition.hasChanged = true;
            
        })
    
        window.addEventListener("resize", () => {
            this.dimensions.width = window.innerWidth;
            this.dimensions.height = window.innerHeight;
            this.dimensions = {height: window.innerHeight, width: window.innerWidth}
    
            this.gl.viewport(0,0,this.dimensions.width, this.dimensions.height);
        })
    
        window.addEventListener("mousedown", () => {
            this.state.mouseOneUp.value = false;
            this.state.mouseOneDown.value = true;
            this.state.mouseOneDown.hasChanged = true;
        });
    
        window.addEventListener("mouseup", () => {
            this.state.mouseOneDown.value = false;
            this.state.mouseOneUp.value = true
            this.state.mouseOneUp.hasChanged = true;
        })

        window.addEventListener("click", () => {
            this.state.mouseOneDown.value = false;
            this.state.mouseOneUp.value = false;
            this.state.mouseOneClick.value = true;
            this.state.mouseOneClick.hasChanged = true
        })
    
        window.addEventListener("keydown", (e) => {
            if (!this.state.buttonsPressed.value.includes(e.key)) this.state.buttonsPressed.value.push(e.key);
            this.state.buttonsPressed.hasChanged = true;
        })
    
        window.addEventListener("keyup", (e) => {
            this.state.buttonsPressed.value = this.state.buttonsPressed.value.filter(key => key !== e.key);
            this.state.buttonsPressed.hasChanged = true;
        })
    }

    private modifyBuffer(callback: () => void) {
        this.bufferHasChanged = true;
        callback()
    }

    private renderElement(element: EngineUiElement): void {
        //render element and make pixel area immutable
        const currentBuf = this.activeImageBuffer;
        for (let y = element.position.y; y <= element.size.dy + element.position.y; y++) {
            for (let x = element.position.x; x <= element.size.dx + element.position.x; x++) {
                let pixelPos = this.positionToBufferIndex({x, y: this.dimensions.height - y});
                this.drawPixel({x, y: this.dimensions.height - y}, element.backgroundColor);
                if (!element.overDrawable) this.immutableIndecies.push(pixelPos);
            }
        }
        this.activeImageBuffer = currentBuf;
        this.bufferHasChanged = true;
    }

    public addEffect<T extends (keyof IEngineState)>(callback: (engineState?: IEngineState) => void, dep: T[], /* specificKey: ContainsButtonPressed<T> */): void {
        this.effects.push({fn: callback, stateDependencies: dep})
    }


    public addElement(element: EngineUiElement): void {
        this.elements.push(element);
        this.renderElement(element);
        this.updateScreen();

    }

    private positionToBufferIndex(pos: {x: number,y: number}): number {
        return pos.x*4 + pos.y*this.dimensions.width*4;
    }
    


    public drawPixel(pos: {x: number, y: number}, color: number[]): void {
        const pixelPos = this.positionToBufferIndex(pos);

        this.modifyBuffer(() => {
            if (!this.immutableIndecies.includes(pixelPos)) {
                if (color[3] === 0xff || this.activeImageBuffer[pixelPos] === 0xff && this.activeImageBuffer[pixelPos + 1] === 0xff && this.activeImageBuffer[pixelPos+2] === 0xff && this.activeImageBuffer[pixelPos+3] === 0xff) {
                    // if opacity (alpha) of the new pixel is max, replace the pixel color
                    this.activeImageBuffer[pixelPos] = color[0];
                    this.activeImageBuffer[pixelPos + 1] = color[1];
                    this.activeImageBuffer[pixelPos + 2] = color[2];
                    this.activeImageBuffer[pixelPos + 3] = color[3];
                } else {
                    // else combine the colors
                    this.activeImageBuffer[pixelPos] = color[0] + this.activeImageBuffer[pixelPos];
                    this.activeImageBuffer[pixelPos + 1] = color[1] + this.activeImageBuffer[pixelPos + 1];
                    this.activeImageBuffer[pixelPos + 2] = color[2] + this.activeImageBuffer[pixelPos + 2];
                    this.activeImageBuffer[pixelPos + 3] = color[3] + this.activeImageBuffer[pixelPos + 3];
                }
            }   
        })
        
    }

    public clear(): void {
        const buffer = new Uint8ClampedArray(this.dimensions.width * this.dimensions.height * 4);
        for (let i = 0; i < buffer.length; i += 4) {
            if (!this.immutableIndecies.includes(i)) {
                buffer[i] = this.config.clearColor[0];     
                buffer[i + 1] = this.config.clearColor[1];
                buffer[i + 2] = this.config.clearColor[2];
                buffer[i + 3] = this.config.clearColor[3];
            }
        }
        this.activeImageBuffer = buffer;
        this.elements.forEach(element => {this.renderElement(element)});
        this.bufferHasChanged = true;
        this.updateScreen()
    }


    public drawSquare(pos: {x: number, y: number}, size: "sm" | "md" | "lg" , color: number[]): void {
        //invert height for some reason
        pos.y = this.dimensions.height - pos.y;

        switch (size) {
            case "sm":
                //2x2
                this.drawPixel(pos, color)
                this.drawPixel({x: pos.x+1, y: pos.y+1}, color)
                this.drawPixel({x: pos.x, y: pos.y+1}, color)
                this.drawPixel({x: pos.x+1, y: pos.y}, color)
                this.drawPixel({x: pos.x, y: pos.y}, color)
                break;
            case "md":
                //3x3
                this.drawPixel({x: pos.x, y:pos.y}, color)
                this.drawPixel({x: pos.x+1, y:pos.y}, color)
                this.drawPixel({x: pos.x-1, y:pos.y}, color)
                this.drawPixel({x: pos.x, y:pos.y+1}, color)
                this.drawPixel({x: pos.x+1, y:pos.y+1}, color)
                this.drawPixel({x: pos.x-1, y:pos.y+1}, color)
                this.drawPixel({x: pos.x, y:pos.y-1}, color)
                this.drawPixel({x: pos.x+1, y:pos.y-1}, color)
                this.drawPixel({x: pos.x-1, y:pos.y-1}, color)


                break;
            case "lg":
                //5x5

                //y = 0
                this.drawPixel({x: pos.x, y:pos.y}, color)
                this.drawPixel({x: pos.x+1, y:pos.y}, color)
                this.drawPixel({x: pos.x+2, y:pos.y}, color)
                this.drawPixel({x: pos.x-1, y:pos.y}, color)
                this.drawPixel({x: pos.x-2, y:pos.y}, color)
                
                //y = 1
                this.drawPixel({x: pos.x, y:pos.y+1}, color)
                this.drawPixel({x: pos.x+1, y:pos.y+1}, color)
                this.drawPixel({x: pos.x+2, y:pos.y+1}, color)
                this.drawPixel({x: pos.x-1, y:pos.y+1}, color)
                this.drawPixel({x: pos.x-2, y:pos.y+1}, color)
                
                //y = 2
                this.drawPixel({x: pos.x, y:pos.y+2}, color)
                this.drawPixel({x: pos.x+1, y:pos.y+2}, color)
                this.drawPixel({x: pos.x+2, y:pos.y+2}, color)
                this.drawPixel({x: pos.x-1, y:pos.y+2}, color)
                this.drawPixel({x: pos.x-2, y:pos.y+2}, color)
                
                
                //y = -1
                this.drawPixel({x: pos.x, y:pos.y-1}, color)
                this.drawPixel({x: pos.x+1, y:pos.y-1}, color)
                this.drawPixel({x: pos.x+2, y:pos.y-1}, color)
                this.drawPixel({x: pos.x-1, y:pos.y-1}, color)
                this.drawPixel({x: pos.x-2, y:pos.y-1}, color)
                
                //y = -2
                this.drawPixel({x: pos.x, y:pos.y-2}, color)
                this.drawPixel({x: pos.x+1, y:pos.y-2}, color)
                this.drawPixel({x: pos.x+2, y:pos.y-2}, color)
                this.drawPixel({x: pos.x-1, y:pos.y-2}, color)
                this.drawPixel({x: pos.x-2, y:pos.y-2}, color)
                break;
        }
    }









}