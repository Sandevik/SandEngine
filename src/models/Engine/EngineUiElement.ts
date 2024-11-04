export default class EngineUiElement implements IEngineUiElement {
    public size: {dx: number, dy: number};
    public position: {x: number, y: number};
    public backgroundColor: ColorRGBA = [0xff,0xff,0xff,0xff];
    public onClick?: () => void;
    public overDrawable: boolean = false;

    constructor(config: IEngineUiElement) {
        if (config.size.dx <= 0 || config.size.dy <= 0) throw new Error("ERROR: Element needs a size to be rendered");
        this.size = config.size;
        this.position = config.position;
        if (config.backgroundColor) this.backgroundColor = config.backgroundColor; 
        if (config.onClick) this.onClick = config.onClick;
    }





}