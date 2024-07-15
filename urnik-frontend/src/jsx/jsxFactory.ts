// source: https://stackoverflow.com/a/68238924

export default function jsx(tag: JSX.Tag | JSX.Component, attributes: { [key: string]: any } | null, ...children: Node[]) {
    if (typeof tag === 'function') {
        return tag(attributes ?? {}, children);
    }
    type Tag = typeof tag;
    const element: HTMLElementTagNameMap[Tag] = document.createElement(tag);

    let map = (attributes ?? {});
    let prop: keyof typeof map;
    for (prop of (Object.keys(map) as any)) {
        prop = prop.toString();
        const value = map[prop] as any;
        const anyReference = element as any;
        if (typeof anyReference[prop] === 'undefined') {
            element.setAttribute(prop, value);
        } else {
            anyReference[prop] = value;
        }
    }

    for (let child of children) {
        if (typeof child === 'string') {
            element.innerText += child;
            continue;
        }
        if (Array.isArray(child)) {
            element.append(...child);
            continue;
        }
        element.appendChild(child);
    }
    return element;
}
