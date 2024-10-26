


export default class Engine {
    private dimensions: {width: number, height: number;}
    private state: IEngineState = {mouseOneDown: false};

    private canvas: HTMLCanvasElement;
    private gl: WebGLRenderingContext;
    private buffer: WebGLBuffer;
    private program: WebGLProgram;
    private texture: WebGLTexture;
    private activeImageBuffer: Uint8ClampedArray

    constructor(){
        this.canvas = document.createElement("canvas");
        document.querySelector("body")?.appendChild(this.canvas);

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.dimensions = {height: window.innerHeight, width: window.innerWidth}

        const gl = this.canvas.getContext("webgl");
        if (gl == null) throw new Error("ERROR: Could not get WebGL context from canvas")
        this.gl = gl;

        window.addEventListener("resize", (e: UIEvent) => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.dimensions = {height: window.innerHeight, width: window.innerWidth}

            this.gl.viewport(0,0,this.canvas.width, this.canvas.height);
        })

        this.canvas.addEventListener("mousedown", () => {
            this.state.mouseOneDown = true;

        });
        this.canvas.addEventListener("mouseup", () => {
            this.state.mouseOneDown = false
        })


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

        const [vertexShader, fragmentShader] =  this.createShaders();
        this.program = this.createProgram(vertexShader, fragmentShader);
    
        const positionLocation = this.gl.getAttribLocation(this.program, "a_position");
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.useProgram(this.program);
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        const buffer = new Uint8ClampedArray(this.dimensions.width * this.dimensions.height * 4);
        for (let i = 0; i < buffer.length; i += 4) {
            buffer[i] = 255;     
            buffer[i + 1] = 0;   
            buffer[i + 2] = 0;   
            buffer[i + 3] = 255;
        }

        this.activeImageBuffer = buffer;
        this.updateScreen(buffer)

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
    
    public updateScreen(buffer: Uint8ClampedArray): void {
        this.activeImageBuffer = buffer;
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.canvas.width, this.canvas.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, buffer);
        this.render();
    }

    private render(): void {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }

    public setPixelBuffer(buffer: Uint8ClampedArray): void {
        this.buffer = buffer;
    }


    public getDimensions(): {height: number, width: number} {
        return this.dimensions;
    }
    

    public drawPixel(pos: {x: number, y: number}, color: number[]): void {
        const pixelPos = pos.x*4 + pos.y*this.canvas.width*4;
        this.activeImageBuffer[pixelPos] = color[0];
        this.activeImageBuffer[pixelPos + 1] = color[1];
        this.activeImageBuffer[pixelPos + 2] = color[2];
        this.activeImageBuffer[pixelPos + 3] = color[3];
        this.updateScreen(this.activeImageBuffer);
    }

    public drawSquare(positions: {x1: number, x2: number, y1: number, y2: number}, color: number[]): void {
        for (let y = positions.y1; y < positions.y2; y++) {
            for (let x = positions.x1; x < positions.x2; x++) {
              this.drawPixel({x, y}, color)
            }
        }
    }




    public addEventListener(event: keyof HTMLElementEventMap, callback: (e: Event | UIEvent | MouseEvent) => void) {
        this.canvas.addEventListener(event, callback)
    }

    public removeEventListener(event: keyof HTMLElementEventMap) {
        this.canvas.removeEventListener(event, () => {})
    }

}