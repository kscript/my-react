(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var isEmpty = function (obj) {
    if (obj instanceof Object) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                return false;
            }
        }
    }
    return true;
};
var getType = function (data) {
    var type = typeof data;
    if (type === 'object') {
        return Object.prototype.toString.call(data).slice(8, -1);
    }
    return type;
};
var execFunc = function (instance, key) {
    if (instance[key] && getType(instance[key]) === 'function') {
        return instance[key].bind(instance);
    }
    return function () { };
};

var removeChild = function (node) {
    node && node.parentNode && node.parentNode.removeChild(node);
};

var events = {};
var diff = function (old, now) {
    return now;
};
var componentUpdate = function (instance, canUpdate) {
    canUpdate = canUpdate === undefined ? instance.shouldComponentUpdate(instance.props) : canUpdate;
    if (!canUpdate && canUpdate !== undefined) {
        return instance;
    }
    var parentNode;
    if (instance.parent instanceof HTMLElement) {
        parentNode = instance.parent;
    }
    else if (instance.vdom.node) {
        parentNode = instance.vdom.node.parentNode;
    }
    else {
        parentNode = instance.parent.vdom.node;
    }
    return instance.mount(parentNode, instance.vdom.node);
};
var removeEl = function (list, elm) {
    if (Array.isArray(list)) {
        var index = list.indexOf(elm);
        ~index && list.splice(index, 1);
    }
};
var destroy = function (instance) {
    var parentVdom = instance.vdom.parent;
    if (parentVdom) {
        removeEl(parentVdom.children, instance.vdom);
        removeEl(parentVdom.list, instance.vdom.node);
        removeEl(instance.parent.components, instance);
    }
    removeChild(instance.vdom.node);
    for (var key in instance) {
        if (instance.hasOwnProperty(key)) {
            delete instance[key];
        }
    }
};
var connectEvent = function (instance, _events) {
    events = _events;
};
var bindRef = function (instance, handler, node) {
    if (typeof handler === 'string') {
        instance.refs[handler] = node;
    }
    else if (typeof handler === 'function') {
        var res = handler.call(instance, node);
        // 如果返回的是字符串, 那么作为ref的key绑定, 不是, 则不再做其它处理
        if (typeof res === 'string') {
            instance.refs[res] = node;
        }
    }
};
var bindAttribute = function (instance, node, props, child) {
    var bindData = [];
    if (props instanceof Object) {
        for (var key in props) {
            bindData.push({
                key: key,
                value: props[key]
            });
            if (key === 'defaultValue' && /input|textarea/i.test(node.tagName)) {
                // @ts-ignore
                node.value = props[key];
            }
            else if (/^on[A-Z].*$/.test(key)) {
                events.bindEvent(instance, node, key.toLowerCase(), props[key], child);
            }
            else if (key === 'className') {
                node.setAttribute('class', props[key]);
            }
            else if (key === 'ref') {
                bindRef(instance, props[key], node);
            }
            else {
                node.setAttribute(key, props[key]);
            }
        }
    }
    return bindData;
};

var Events = /** @class */ (function () {
    function Events(rootNode) {
        this.quque = {};
        this.rootNode = rootNode;
    }
    Events.prototype.addEvent = function (type, listener) {
        this.rootNode.addEventListener(type.slice(2), listener);
    };
    Events.prototype.bindEvent = function (instance, node, type, listener, child) {
        // let queue = this.quque[type] = this.quque[type] || [];
        // queue.push({
        //     node,
        //     instance,
        //     listener
        // });
        // if (queue.length > 1) {
        //     return ;
        // }
        this.addEvent(type, function (e) {
            var rest = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                rest[_i - 1] = arguments[_i];
            }
            // queue.forEach((item: AnyObject) => {
            if (e.target === node) {
                // listener.bind(instance, e, ...rest)();
                listener.call.apply(listener, [instance, e].concat(rest));
            }
            // });
        });
    };
    return Events;
}());

var _id = 1;
var events$1;
var Vdom = /** @class */ (function () {
    function Vdom(option) {
        if (option === void 0) { option = {}; }
        this.tag = '';
        this.children = [];
        this.props = {};
        this.bindData = {};
        Object.assign(this, option);
    }
    return Vdom;
}());
var Component = /** @class */ (function () {
    function Component(props) {
        this.state = {};
        this._id = 1;
        this.indicator = 0;
        this.vdom = {};
        this.refs = {};
        this.props = {};
        this.parent = {};
        this.components = [];
        this.props = props instanceof Object ? props : {};
        this._id = _id++;
    }
    Component.prototype.destroy = function () {
        // 只有明确返回false时才会阻止销毁动作
        if (execFunc(this, 'componentWillUnMount') !== false) {
            destroy(this);
            execFunc(this, 'componentDidUnMount');
        }
    };
    Component.prototype.componentWillMount = function (props) {
    };
    Component.prototype.componentDidMount = function (props) {
    };
    Component.prototype.shouldComponentUpdate = function (props) {
        return true;
    };
    Component.prototype.componentWillUpdate = function (props) {
    };
    Component.prototype.componentDidUpdate = function (props) {
    };
    Component.prototype.componentWillUnMount = function (props) {
    };
    Component.prototype.componentDidUnMount = function (props) {
    };
    Component.prototype.render = function () {
        return {
            node: document.createElement("div")
        };
    };
    Component.prototype.mount = function (node, oldNode) {
        // 根节点
        if (node && isEmpty(this.parent)) {
            this.parent = node;
            // 用根节点来初始化一个事件管理类
            if (!events$1 && node instanceof HTMLElement) {
                events$1 = new Events(node);
                connectEvent(this, events$1);
            }
        }
        this.indicator = 0;
        if (!oldNode) {
            execFunc(this, 'componentWillMount')(this.props);
        }
        this.vdom = diff(this.vdom, this.render());
        if (oldNode) {
            node && node.replaceChild(this.vdom.node, oldNode);
        }
        else {
            node && node.appendChild(this.vdom.node);
            execFunc(this, 'componentDidMount')(this.props);
        }
        this.indicator = 0;
        return this;
    };
    Component.prototype.setState = function (set, callBack) {
        if (typeof set !== 'function') {
            for (var _i = 0, _a = Object.keys(set); _i < _a.length; _i++) {
                var key = _a[_i];
                this.state[key] = set[key];
            }
        }
        componentUpdate(this);
        typeof callBack === 'function' && callBack.call(this);
    };
    return Component;
}());
var React = {
    Component: Component,
    // this指向父组件
    createComponent: function (Component) {
        var _this = this;
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        // this.constructor = Component;
        return function (props, config, children) {
            var vdom;
            var newInstance;
            var instance = _this.components[_this.indicator++];
            if (!instance) {
                instance = new Component(props);
                instance.parent = _this;
                _this.components.push(instance);
                newInstance = componentUpdate(instance);
            }
            else {
                execFunc(instance, 'componentWillUpdate')(props);
                instance.props = props;
                newInstance = componentUpdate(instance);
                execFunc(instance, 'componentDidUpdate')(props);
            }
            vdom = newInstance.vdom;
            vdom.bindData = bindAttribute(_this, vdom.node, props, instance);
            vdom.parent = _this.vdom;
            return vdom;
        };
    },
    createElement: function (tag, props, children) {
        var node = null;
        var fragment = document.createDocumentFragment();
        var bindData;
        props = props instanceof Object ? props : {};
        if (children) {
            children = React.createChild(children, fragment);
        }
        if (typeof tag === 'string') {
            node = document.createElement(tag);
            node.appendChild(fragment);
            bindData = bindAttribute(this, node, props);
        }
        var result = new Vdom({
            tag: tag,
            props: props,
            node: node,
            bindData: bindData,
            children: children
        });
        result.children = (children || []).map(function (item) {
            if (item instanceof Object) {
                item.parent = result;
            }
            return item;
        });
        return result;
    },
    createChild: function (children, fragment) {
        var result = [];
        children.forEach(function (item) {
            if (Array.isArray(item)) {
                item.forEach(function (child) {
                    result.push(child);
                    fragment.appendChild(child.node);
                });
            }
            else {
                result.push(item);
                if (item instanceof Object) {
                    if (typeof item.tag === 'string') {
                        fragment.appendChild(item.node);
                    }
                }
                else if (typeof item === 'string' || typeof item === 'number') {
                    var Text = document.createTextNode(String(item));
                    fragment.appendChild(Text);
                }
            }
        });
        return result;
    },
    createAttribute: function (tag, props) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        console.log(tag, props, children);
    }
};

// import React from 'ks-react';

class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillUpdate (props){
    console.log('componentWillUpdate', props);
  }
  componentDidUpdate (props){
    console.log('componentDidUpdate', props);
  }
  render() {
    return (
      React.createElement.bind(this)('header', null, ["React测试"])
    )
  }
}

class Button extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      React.createElement.bind(this)('button', null, [this.props.text || '确定'])
    )
  }
}

class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      title: '按钮'
    };
    window.app = this;
  }
  buttonClick (text) {
    console.log(this, text);
  }
  inputChange (event) {
    this.setState({
      title: event.target.value
    });
  }
  render() {
    return (
      React.createElement.bind(this)('div', {id: "react-test", class: "page"}, [
        React.createComponent.call(this, Header)({logo: "", name: "测试"}),
        /* <Nav></Nav> */
        React.createElement.bind(this)('input', {type: "text", onChange: this.inputChange, defaultValue: this.state.title}),
        React.createElement.bind(this)('div', {className: "main"}, [
          Array(5).fill('').map((item, index) => {
            return (
              index % 2
              ? React.createComponent.call(this, Button)({text: this.state.title + -~index, onClick:  this.buttonClick.bind(this, '传递参数') })
              : React.createComponent.call(this, Button)({text: this.state.title + -~index, onClick:  this.buttonClick})
            )
          })
        ])
      ])
    )
  }
}

class App extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      React.createComponent.call(this, Index)()
    )
  }
}

// 编译 入口文件
// 实例化一个入口, 并将入口实例挂载到dom元素上
new App().mount(document.getElementById("app"));

},{}]},{},[1]);
