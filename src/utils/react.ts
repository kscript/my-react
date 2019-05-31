import { acorn, jsx, babel, generate } from "@/utils/babel";
const { Parser, Node } = acorn;
const { parse } = babel;

let rid = 1;
export const createComponent = (Component: any, config: AnyObject | null, ...children: any[]) => {
    let instance = new Component()
    return (...args: any[]) => {
        return instance.render ? instance.render(args) : ''
    }
}
export const createAttribute = (tag: any, config: AnyObject | null, ...children: any[]) => {
    console.log(tag, config, children);
}
export const createUnknownTag = (tag: any, config: AnyObject | null, ...children: any[]) => {
    console.log(tag, config, children);
}
export const createElement =  (tag: any, config: AnyObject | null, children: any[]) => {
    let tree: AnyObject = {};
    let list: any[] = [];
    let node = null;
    let fragment = document.createDocumentFragment()
    
    children.forEach(item => {
        if (item instanceof Object) {
            if (typeof item.tag === 'string') {
                list.push(item.node);
                fragment.appendChild(item.node);
            }
        } else if (typeof item === 'string' || typeof item === 'number') {
            let Text = document.createTextNode(String(item));
            list.push(Text);
            fragment.appendChild(Text);
        }
    });
    if (typeof tag === 'string') {
        node = document.createElement(tag);
        node.appendChild(fragment);
    }
    return {
        tag,
        config,
        list,
        node,
        children
    };
}

export class Component {
    private state: AnyObject = {};
    private rid: number = 1;
    private tree: AnyObject = {};
    private nodeList: AnyObject[] = [];
    constructor() {
        this.rid = rid++;
    }
    public render(): AnyObject {
        return {
            node: document.createElement("div")
        };
    }
    public mount (node: HTMLElement){
        let result = this.render();
        node.appendChild(result.node);
        return this;
    }
    public setState(set: any): void {
        if (typeof set !== 'function') {
            for (const key of Object.keys(set)) {
                this.state[key] = set[key];
            }
        }
    }
}
export const React: AnyObject = {
    Component,
    createElement,
    createAttribute,
    createUnknownTag,
    createComponent,
};
export default React;
