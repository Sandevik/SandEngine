export default class Screen {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private activeImageBuffer: Uint8ClampedArray = new Uint8ClampedArray(1);

    constructor(){
        this.canvas = document.createElement("canvas");
        document.querySelector("body")?.appendChild(this.canvas);

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        const ctx = this.canvas.getContext("2d");
        if (ctx == null) throw new Error("ERROR: Could not get context from canvas")
        this.ctx = ctx;
        window.addEventListener("resize", (e: UIEvent) => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        })

        const buf = new Uint8ClampedArray(4 * this.canvas.width * this.canvas.height);
        for (let i = 0; i < buf.length; i+=4) {
            buf[i] = 255;
            buf[i + 1] = 0;
            buf[i + 2] = 0;
            buf[i + 3] = 255;
        }
        this.updateScreen(buf)
    }

    private setPixelBuffer(buffer: Uint8ClampedArray): void {
        this.activeImageBuffer = buffer;
    }

    private render(): void {
        const currentImageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        currentImageData.data.set(this.activeImageBuffer);
        this.ctx.putImageData(currentImageData, 0, 0)
    }

    public updateScreen(buffer: Uint8ClampedArray): void {
        this.setPixelBuffer(buffer);
        this.render();
    }



    public drawPixel(pos: {x: number, y: number}, color: number[]) {
        const pixelPos = pos.x*4 + pos.y*this.canvas.width*4;
        const newBuffer = this.activeImageBuffer;
        newBuffer[pixelPos] = color[0];
        newBuffer[pixelPos + 1] = color[1];
        newBuffer[pixelPos + 2] = color[2];
        newBuffer[pixelPos + 3] = color[3];

        this.updateScreen(newBuffer);
    }


}