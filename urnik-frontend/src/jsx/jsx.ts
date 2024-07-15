/// <reference lib="DOM" />

declare namespace JSX {
   // The return type of our JSX Factory
   type Element = HTMLElement;

   // IntrinsicElementMap grabs all the standard HTML tags in the TS DOM lib.
   interface IntrinsicElements extends IntrinsicElementMap { }

   // The following are custom types, not part of TS's known JSX namespace:
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

