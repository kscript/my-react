import { removeChild } from './dom'
let events: AnyObject = {};
export const diff = (old: AnyObject, now: AnyObject) => {
    return now
}
export const componentUpdate = (instance: AnyObject, canUpdate?: any) => {
    canUpdate = canUpdate === undefined ? instance.shouldComponentUpdate(instance.props) : canUpdate;
    if (!canUpdate && canUpdate !== undefined){
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

export const removeEl = (list: any[], elm: any) => {
    if (Array.isArray(list)) {
        let index = list.indexOf(elm);
        ~index && list.splice(index, 1);
    }
}
export const destroy = (instance: AnyObject) => {
    let parentVdom = instance.vdom.parent;
    if (parentVdom) {
        removeEl(parentVdom.children, instance.vdom);
        removeEl(parentVdom.list, instance.vdom.node);
        removeEl(instance.parent.components, instance);
    }
    removeChild(instance.vdom.node);
    for (let key in instance) {
        if (instance.hasOwnProperty(key)) {
            delete instance[key];
        }
    }
}
export const connectEvent = (instance: AnyObject, _events: AnyObject) => {
    events = _events;
}
export const bindRef = (instance: AnyObject, handler: any, node: HTMLElement) => {
    if (typeof handler === 'string') {
        instance.refs[handler] = node;
    } else if (typeof handler === 'function') {
        let res = handler.call(instance, node);
        // 如果返回的是字符串, 那么作为ref的key绑定, 不是, 则不再做其它处理
        if (typeof res === 'string') {
            instance.refs[res] = node;
        }
    }
}
export const bindAttribute = (instance: AnyObject, node: HTMLElement | HTMLInputElement, props: AnyObject | null, child?: AnyObject) => {
    let bindData: any[] = [];
    if (props instanceof Object) {
        for(let key in props) {
            bindData.push({
                key, 
                value: props[key]
            });
            if (key ==='defaultValue' && /input|textarea/i.test(node.tagName)) {
                // @ts-ignore
                node.value = props[key];
            } else if (/^on[A-Z].*$/.test(key)) {
                events.bindEvent(instance, node,  key.toLowerCase(), props[key], child);
            } else if (key === 'className'){
                node.setAttribute('class', props[key]);
            } else if(key === 'ref'){
                bindRef(instance, props[key], node);
            } else {
                node.setAttribute(key, props[key]);
            }
        }
    }
    return bindData;
}
export default {
    diff,
    destroy,
    connectEvent,
    bindRef,
    bindAttribute,
    componentUpdate,
}
