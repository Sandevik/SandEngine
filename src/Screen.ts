export default class Screen {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private currentImageData: ImageData = new ImageData(1,1);

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
        this.setPixelBufferValue(buf)
        this.render()
    }

    public setPixelBufferValue(buffer: Uint8ClampedArray): void {
        this.currentImageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        this.currentImageData.data.set(buffer);
    }

    public render(): void {
        this.ctx.putImageData(this.currentImageData, 0, 0)
    }

    public updateScreen(buffer: Uint8ClampedArray): void {
        this.currentImageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        this.currentImageData.data.set(buffer);
        this.ctx.putImageData(this.currentImageData, 0, 0)
    }




}