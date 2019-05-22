interface AnyObject {
    [prop: string]: any;
}

interface Option {
    el: HTMLElement | null;
    text: string;
    node: acorn.Node;
}
interface Node2 {
    body: [acorn.Node & Node2];
    children: [acorn.Node & Node2];
    key?: string;
    paths: AnyObject[];
    attributes: [acorn.Node & Node2];
    name: acorn.Node & Node2;
    value: acorn.Node & Node2;
    object: acorn.Node & Node2;
    property: acorn.Node & Node2;
    expression: acorn.Node & Node2;
    openingElement: acorn.Node & Node2;
    closingElement: acorn.Node & Node2;
    tree?: acorn.Node;
}

interface Component {
    state: any;
    setState: (set: any) => void;
    render: (text: string, el: HTMLElement | null) => void;
    generate?: (node: acorn.Node) => void;
    createElement?: (option: Option) => void;
    tree?: acorn.Node;
    option?: Option;
}

interface React {
    Component: Function;
}
