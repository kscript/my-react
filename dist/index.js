'use strict';

var Babel = require('@babel/parser');
var Acorn = require('acorn');
require('@babel/generator');
require('acorn-jsx');

var acorn = Acorn;
var babel = Babel;

var Parser = acorn.Parser, Node = acorn.Node;
var parse = babel.parse;
var rid = 1;
var createComponent = function (Component, config) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    var instance = new Component();
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return instance.render ? instance.render(args) : '';
    };
};
var createAttribute = function (tag, config) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    console.log(tag, config, children);
};
var createUnknownTag = function (tag, config) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    console.log(tag, config, children);
};
var createElement = function (tag, config, children) {
    var list = [];
    var node = null;
    var fragment = document.createDocumentFragment();
    children.forEach(function (item) {
        if (item instanceof Object) {
            if (typeof item.tag === 'string') {
                list.push(item.node);
                fragment.appendChild(item.node);
            }
        }
        else if (typeof item === 'string' || typeof item === 'number') {
            var Text = document.createTextNode(String(item));
            list.push(Text);
            fragment.appendChild(Text);
        }
    });
    if (typeof tag === 'string') {
        node = document.createElement(tag);
        node.appendChild(fragment);
    }
    return {
        tag: tag,
        config: config,
        list: list,
        node: node,
        children: children
    };
};
var Component = /** @class */ (function () {
    function Component() {
        this.state = {};
        this.rid = 1;
        this.tree = {};
        this.nodeList = [];
        this.rid = rid++;
    }
    Component.prototype.render = function () {
        return {
            node: document.createElement("div")
        };
    };
    Component.prototype.mount = function (node) {
        var result = this.render();
        node.appendChild(result.node);
        return this;
    };
    Component.prototype.setState = function (set) {
        if (typeof set !== 'function') {
            for (var _i = 0, _a = Object.keys(set); _i < _a.length; _i++) {
                var key = _a[_i];
                this.state[key] = set[key];
            }
        }
    };
    return Component;
}());
var React = {
    Component: Component,
    createElement: createElement,
    createAttribute: createAttribute,
    createUnknownTag: createUnknownTag,
    createComponent: createComponent,
};

class Test extends React.Component {
    constructor() {
        super();
        this.state = {
            data: {
                text: 12
            }
        };
    }
    render() {
        return (React.createElement('div', {className: "test"}, [
            React.createElement('span', null, [this.state.data.text]),
            this.state.data.text,
            React.createElement('bar', {text: this.state.data.text, test: "text"}, [
                React.createElement('span', null, [React.createElement('span', null, ["1"])]),
                React.createElement('div', null, [React.createElement('span', null, ["111"])])
            ])
        ]))
    }
}

// 项目入口文件

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {
        text: 124
      }
    };
  }
  render() {
    return (React.createElement('span', null, [
      React.createComponent(Test)({text: this.state.data.text}, ["123"]),
      React.createElement('span', null, [this.state.data.text]),
      this.state.data.text,
      React.createElement('bar', {text: this.state.data.text, test: "text"}, [
        React.createElement('span', null, [React.createElement('span', null, ["1"])]),
        React.createElement('div', null, [React.createElement('span', null, ["111"])])
      ])
    ]))
  }
}

// 编译 入口文件
new App().mount(document.getElementById("app"));
