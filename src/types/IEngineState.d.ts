interface IEngineState {
    mouseOneDown: IState<boolean>
    mouseOneUp: IState<boolean>
    mouseOneClick: IState<boolean>
    buttonsPressed: IState<string[]>;
    mousePosition: IState<{x: number, y: number}>
}

interface IState<T> {
    value: T,
    hasChanged: boolean,
}

