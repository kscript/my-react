import * as acorn from 'acorn';
/// @ts-ignore 
import generate from '@babel/generator';

interface List {
    node?: acorn.Node & Node2;
    parent?: List;
    children?: List[];
    nodeList?: HTMLElement[];
    element?: HTMLElement[];
    tree?: HTMLElement[];
}
/**
 * module Dom
 */
let currentList: List = {
};
const doc = document.createDocumentFragment();
const element = document.createElement('div');
doc.append(element);
class Dom {
    private root: List = {
    };
    public init(node: acorn.Node & Node2) {
        this.root = this.format(node);
        currentList = this.root;
    }
    public getCurrent() {
        return currentList;
    }
    public format(node: acorn.Node & Node2, list?: List): List {
        list = list || currentList || null;
        return {
            node,
            parent: list,
            children: [],
        };
    }
    public bind(list: List, children: List[]) {
        list.children = children;
    }
    public generate(node: acorn.Node & Node2 & any) {
        const code = generate(node, {}, '');
        if (code.code) {
            element.innerHTML = code.code;
            // 取第一个元素并复制即可
            if (element.firstChild) {
                return element.firstChild.cloneNode();
            }
        }
        // 没有元素? 可能是空格/换行符, 用文本节点包裹
        return document.createTextNode(node.value);
    }
    public create(list?: List) {
        let tree: any;
        list = list || this.root;
        // 有的节点没有 node 属性
        const node = Object.assign(list.node || list);
        // 将 children 属性分离出来
        const children = node.children || [];
        node.children = [];
        // 生成 dom 元素
        node.element = this.generate(node);
        tree = node.element.cloneNode();
        // 遍历子节点
        node.nodeList = children.map((item: any) => {
            const result = this.create(item);
            item.element = result.element;
            tree.appendChild(result.tree);
            return item.element;
        }).filter((item: any) => !!item);
        // 将 children 属性还原回去
        node.children = children;
        node.tree = tree;
        return {
            tree,
            element: node.element,
        };
    }
}
export default Dom;
