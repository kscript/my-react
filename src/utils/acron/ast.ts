import "ast";
import * as acorn from 'acorn';
import { babel, generate } from '@/utils/acron/babel';
import Subscribe from '@/utils/subscribe';
import Dom from './dom';

let ast: any = {};
const elementSub = new Subscribe();
const propertySub = new Subscribe();
const scope: any = {
    attr: {},
};
let keyid = 1;
const nodeList: Array<acorn.Node & Node2> = [];
const nodeMap: AnyObject = {};
const generateKey = (node: acorn.Node & Node2) => {
    if (!node.key) {
        nodeList.push(node);
        node.key = node.type + '-' + (keyid++);
        nodeMap[node.key] = node;
    }
};
const tree = new Dom();
let currentNode: any = null;
console.log(scope, tree, elementSub, propertySub, nodeList, nodeMap);
export const build = (node: acorn.Node & Node2, context: React, parent: any) => {
    reconcile(node, context, parent);
    tree.create();
    return tree;
};
export const reconcile = (node: acorn.Node & Node2, context: React, parent: any) => {
    let result;
    try {
        if (ast[node.type]) {
            generateKey(node);
            result = ast[node.type](node, context, parent);
        }
    } catch (e) {
        console.log(e);
    }
    return {
        node,
        context,
        result,
    };
};
export const Literal = (node: acorn.Node & Node2, context: React, parent: any) => {
    node.type = 'StringLiteral';
    return node;
};
export const StringLiteral = (node: acorn.Node & Node2, context: React, parent: any) => {
    return node;
};
export const JSXExpressionContainer = (node: acorn.Node & Node2, context: React, parent: any) => {
    generateKey(node);
    let paths = [];
    paths = JSXExpression(node.expression, context, parent);
    node.paths = paths;
    if (node.key) {
        elementSub.on(node.key, (data) => {
            console.log(parent, node, data);
        });
        propertySub.on(paths.map((item) => item.key || 'this').join('.'), (data) => {
            console.log(parent, !!parent.tree, node, data, node.name);
            const Tree = node.tree || parent.tree;
            if (Tree) {
                if (Tree.nodeType === 3) {
                    Tree.replaceData(0, Tree.length, data);
                } else {
                    node.name ? Tree.setAttribute(node.name, data) : Tree.innerText = data;
                }
            }
        });
    }
    return reconcile(node.expression, context, node);
};
export const MemberExpression = (node: acorn.Node & Node2, context: React, parent: any) => {
    const obj = reconcile(node.object, context, node);
    const key = reconcile(node.property, context, node);
    let val = ' ';
    if (obj.result && key.result) {
        val  = '';
        // val = context.state[key.result.name];
    }
    // console.log(node, obj, key, val, 123);
    return val;
};
export const JSXText = (node: acorn.Node & Node2, context: React, parent: any) => {
    // console.log(currentNode);
    // tree.bind(currentNode, [tree.format(node)]);
    return node;
};
export const ThisExpression = (node: acorn.Node & Node2, context: React, parent: any) => {
    return node;
};
export const Identifier = (node: acorn.Node & Node2, context: React, parent: any) => {
    return node;
};
export const JSXAttribute = (node: acorn.Node & Node2, context: React, parent: any) => {
    const name = reconcile(node.name, context, node);
    const value = reconcile(node.value, context, node);
    if (node.value.type === 'JSXExpressionContainer') {
        node.value.name = node.name.name;
        JSXExpressionContainer(node.value, context, parent);
    }
    if (name.result) {
        scope.attr[name.result.name] = value.result.raw || value.result.result;
        return scope.attr[name.result.name];
    }
};
export const ExpressionStatement = (node: acorn.Node & Node2, context: React, parent: any) => {
    return reconcile(node.expression, context, node);
};
export const JSXElement = (node: acorn.Node & Node2, context: React, parent: any) => {
    if (node.key === 'JSXElement-16' || node.key === 'JSXElement-19') {
        // debugger;
    }
    const list: any[]  = [];
    if (!currentNode) {
        tree.init(node);
        // 当前节点是根节点
        currentNode = tree.getCurrent();
    }
    const source = currentNode;
    reconcile(node.openingElement, context, node);
    node.children.forEach((item) => {
        currentNode = tree.format(item, currentNode);
        reconcile(item, context, node);
        list.push(currentNode);
    });
    reconcile(node.closingElement, context, node);
    currentNode = source;
    tree.bind(currentNode, list);
};
export const JSXOpeningElement = (node: acorn.Node & Node2, context: React, parent: any) => {
    reconcile(node.name, context, node);
    node.attributes.forEach((item) => {
        reconcile(item, context, parent);
    });
};
export const JSXIdentifier = (node: any, context: React, parent: any) => {
    return {
        parent,
        node,
        value: node,
    };
};
export const JSXClosingElement = (node: acorn.Node & Node2, context: React, parent: any) => {
    // console.log('JSXClosingElement');
};

export const Program = (node: acorn.Node & Node2, context: React, parent: any) => {
    node.body.forEach((item) => {
        reconcile(item, context, node);
    });
};
export const JSXExpression = (node: acorn.Node & Node2, context: React, parent: any): AnyObject[] => {
    const result = [];
    let current = node;
    while (current) {
        if (current.property) {
            result.unshift({
                cxt: current.object,
                key: current.property.name,
            });
        } else {
            result.unshift({
                cxt: current,
                // 变量/this
                key: current.type === 'Identifier' ? current.name : null,
            });
        }
        current = current.object;
    }
    return result;
};
ast = {
    reconcile,
    build,
    Program,
    Literal,
    JSXText,
    StringLiteral,
    JSXExpressionContainer,
    MemberExpression,
    ThisExpression,
    Identifier,
    JSXAttribute,
    ExpressionStatement,
    JSXElement,
    JSXOpeningElement,
    JSXIdentifier,
    JSXClosingElement,
};

export default ast;
