// source: https://stackoverflow.com/a/68238924

declare namespace JSX {
    type Element = HTMLElement;

    interface IntrinsicElements extends IntrinsicElementMap { }

    type IntrinsicElementMap = {
        [K in keyof HTMLElementTagNameMap]: {
            [k: string]: any
        }
    }

    type Tag = keyof JSX.IntrinsicElements;

    interface Component {
        (properties?: { [key: string]: any }, children?: Node[]): Node
    }
}
