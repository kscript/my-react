export default class Events {
    private rootNode: HTMLElement;
    constructor(rootNode: HTMLElement){
        this.rootNode = rootNode;
    }
    addEvent (type: string, listener: EventListenerOrEventListenerObject) {
        this.rootNode.addEventListener(type.slice(2), listener)
    }
    bindEvent (instance: AnyObject, node: HTMLElement, type: string, listener: Function) {
        this.addEvent(type, (e) => {
            if (e.target === node) {
                listener.call(instance, e)
            }
        }) 
    }
}
