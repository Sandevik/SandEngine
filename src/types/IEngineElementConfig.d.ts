interface IEngineUiElement {
    private size: {dx: number, dy: number};
    private position: {x: number, y: number};
    private backgroundColor: number[] = [0xff,0xff,0xff,0xff];
    private onClick?: () => void;
    public overDrawable?: boolean = false;
}