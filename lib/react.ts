import { isEmpty, getType, execFunc } from './common';
import { diff, componentUpdate, bindEvent, bindAttribute, destroy } from './instance';
import Events from './events'

interface vdom {
    node?: HTMLElement;
    [prop: string]: any;
}
interface refs {
    [prop: string]: HTMLElement;
}

let _id: number = 1;
let events: Events;

export class Component {
    private state: AnyObject = {};
    private _id: number = 1;
    private indicator: number = 0;
    private vdom: vdom = {};
    private refs: refs = {};
    private props: AnyObject = {}
    private parent: HTMLElement | vdom = {}
    private components: Component[] = []
    constructor(props: any) {
        this.props = props instanceof Object ? props : {};
        this._id = _id++;
    }
    public destroy() {
        // 只有明确返回false时才会阻止销毁动作
        if (execFunc(this, 'componentWillUnMount') !== false) {
            destroy(this)
            execFunc(this, 'componentDidUnMount')
        }
    }
    public componentWillMount (props: AnyObject){

    }
    public componentDidMount (props: AnyObject){

    }
    public shouldComponentUpdate(props: AnyObject){
        return true
    }
    public componentWillUpdate (props: AnyObject) {
    }
    public componentDidUpdate (props: AnyObject) {
    }
    public componentWillUnMount (props: AnyObject) {
    }
    public componentDidUnMount (props: AnyObject) {

    }
    public render(): AnyObject {
        return {
            node: document.createElement("div")
        };
    }
    public mount (node?: AnyObject | HTMLElement, oldNode?: HTMLElement){
        if(node && isEmpty(this.parent)) {
            this.parent = node;
            if (!events && node instanceof HTMLElement) {
                events = new Events(node);
                bindEvent(this, events);
            }
        }
        this.indicator = 0;
        if (!oldNode) {
            execFunc(this, 'componentWillMount')(this.props);
        }
        execFunc(this, 'componentWillUpdate')(this.props);
        this.vdom = diff(this.vdom, this.render());
        execFunc(this, 'componentDidUpdate')(this.props);
        if (oldNode) {
            node && node.replaceChild(this.vdom.node, oldNode);
        } else {
            node && node.appendChild(this.vdom.node);
            execFunc(this, 'componentDidMount')(this.props);
        }
        this.indicator = 0;
        return this;
    }
    public setState(set: any, callBack: Function): void {
        if (typeof set !== 'function') {
            for (const key of Object.keys(set)) {
                this.state[key] = set[key];
            }
        }
        componentUpdate(this);
        typeof callBack === 'function' && callBack.call(this);
    }
}
export const React: AnyObject = {
    Component,
    // this指向父组件
    createComponent (Component: any) {
        let instance = this.components[this.indicator++];
        if (!instance) {
            instance = new Component();
            instance.parent = this;
            this.components.push(instance);
        }
        return (props: AnyObject, config: AnyObject | null, children: any[]) => {
            instance.props = props;
            let vdom = componentUpdate(instance).vdom;
            vdom.parent = this.vdom;
            return vdom;
        }
    },
    createElement (tag: any, props: AnyObject | null, children: any[]) {
        let node = null;
        let list: any[] = [];
        let fragment = document.createDocumentFragment()
        props = props instanceof Object ? props : {};
        children && children.forEach(item => {
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
            bindAttribute(this, node, props)
        }
        let result = {
            tag,
            props,
            list,
            node,
            children
        }
        result.children = (children || []).map(item => {
            if (item instanceof Object) {
                item.parent = result;
            }
            return item;
        });
        return result;
    },
    createAttribute (tag: any, props: AnyObject | null, ...children: any[]) {
        console.log(tag, props, children);
    }
};
export default React;
