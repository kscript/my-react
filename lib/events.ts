export default class Events {
    public quque: AnyObject = {};
    private rootNode: HTMLElement;
    constructor(rootNode: HTMLElement){
        this.rootNode = rootNode;
    }
    addEvent (type: string, listener: EventListenerOrEventListenerObject) {
        this.rootNode.addEventListener(type.slice(2), listener);
    }
    bindEvent (instance: AnyObject, node: HTMLElement, type: string, listener: Function, child: AnyObject) {
        // let queue = this.quque[type] = this.quque[type] || [];
        // queue.push({
        //     node,
        //     instance,
        //     listener
        // });
        // if (queue.length > 1) {
        //     return ;
        // }
        this.addEvent(type, (e, ...rest) => {
            // queue.forEach((item: AnyObject) => {
                if (e.target === node) {
                    // listener.bind(instance, e, ...rest)();
                    listener.call(instance, e, ...rest);
                }
            // });
        });
    }
}
