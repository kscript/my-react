interface vdom {
    node?: HTMLElement;
    [prop: string]: any;
}
let _id = 1;
let rootNode:HTMLElement
const addEvent = (type: string, listener: EventListenerOrEventListenerObject)  => {
    rootNode.addEventListener(type.slice(2), listener)
}
const isEmpty = (obj: AnyObject) => {
    if (obj instanceof Object) {
        for(let i in obj) {
            if (obj.hasOwnProperty(i)){
                return false
            }
        }
    }
    return true
}
const diff = (old: AnyObject, now: AnyObject) => {
    return now
}
const bindEvent = (instance: AnyObject, node: HTMLElement, type: string, listener: Function) => {
    addEvent(type, (e) => {
        if (e.target === node) {
            listener.call(instance, e)
        }
    }) 
}
const bindRef = (instance: AnyObject) => {

}
const bindAttribute = (instance: AnyObject, node: HTMLElement, props: AnyObject | null) => {
    if (props instanceof Object) {
        for(let key in props) {
            if (/^on[A-Z].*$/.test(key)) {
                bindEvent(instance, node,  key.toLowerCase(), props[key])
            } else if (key === 'className'){
                node.setAttribute('class', props[key])
            } else if(key === 'ref'){
                bindRef(instance)
            } else {
                node.setAttribute(key, props[key])
            }
        }
    }
}
const componentUpdate = (instance: AnyObject) => {
    if (!instance.shouldComponentUpdate(instance.props)){
        return instance
    }
    let parentNode
    if (instance.parent instanceof HTMLElement) {
        parentNode = instance.parent
    } else if (instance.vdom.node){
        parentNode = instance.vdom.node.parentNode
    } else {
        parentNode = instance.parent.vdom.node
    }
    return instance.mount(parentNode, instance.vdom.node)
}
export class Component {
    private state: AnyObject = {};
    private _id: number = 1;
    private indicator: number = 0;
    private vdom: vdom = {};
    private props: AnyObject = {}
    private parent: HTMLElement | vdom = {}
    private components: Component[] = []
    constructor(props: any) {
        this.props = props instanceof Object ? props : {};
        this._id = _id++;
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
    public componentDidUpdate  (props: AnyObject) {
    }
    public render(): AnyObject {
        return {
            node: document.createElement("div")
        };
    }
    public mount (node?: AnyObject | HTMLElement, oldNode?: HTMLElement){
        if(node && isEmpty(this.parent)) {
            this.parent = node;
            rootNode = rootNode || node
        }
        this.indicator = 0;
        if (!oldNode) {
            this.componentWillMount(this.props);
        }
        this.componentWillUpdate(this.props);
        this.vdom = diff(this.vdom, this.render());
        this.componentDidUpdate(this.props);
        if (oldNode) {
            node && node.replaceChild(this.vdom.node, oldNode);
        } else {
            node && node.appendChild(this.vdom.node);
            this.componentDidMount(this.props);
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
            return componentUpdate(instance).vdom;
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
        return {
            tag,
            props,
            list,
            node,
            children
        };
    },
    createAttribute (tag: any, props: AnyObject | null, ...children: any[]) {
        console.log(tag, props, children);
    }
};
export default React;
