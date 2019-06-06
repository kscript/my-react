(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _id = 1;
var rootNode;
var addEvent = function (type, listener) {
    rootNode.addEventListener(type.slice(2), listener);
};
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
var diff = function (old, now) {
    return now;
};
var bindEvent = function (instance, node, type, listener) {
    addEvent(type, function (e) {
        if (e.target === node) {
            listener.call(instance, e);
        }
    });
};
var bindAttribute = function (instance, node, props) {
    if (props instanceof Object) {
        for (var key in props) {
            if (/^on[A-Z].*$/.test(key)) {
                bindEvent(instance, node, key.toLowerCase(), props[key]);
            }
            else if (key === 'className') {
                node.setAttribute('class', props[key]);
            }
            else if (key === 'ref') ;
            else {
                node.setAttribute(key, props[key]);
            }
        }
    }
};
var componentUpdate = function (instance) {
    if (!instance.shouldComponentUpdate(instance.props)) {
        return instance;
    }
    instance.components = [];
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
var Component = /** @class */ (function () {
    function Component(props) {
        this.state = {};
        this._id = 1;
        this.vdom = {};
        this.props = {};
        this.parent = {};
        this.components = [];
        this.props = props instanceof Object ? props : {};
        this._id = _id++;
    }
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
    // public update(){
    //     if (!this.shouldComponentUpdate(this.props)){
    //         return this
    //     }
    //     let parentNode
    //     if (this.parent instanceof HTMLElement) {
    //         parentNode = this.parent
    //     } else {
    //         parentNode = this.parent.vdom.node
    //     }
    //     return this.mount(parentNode, this.vdom.node)
    // }
    Component.prototype.render = function () {
        return {
            node: document.createElement("div")
        };
    };
    Component.prototype.mount = function (node, oldNode) {
        //
        if (node && isEmpty(this.parent)) {
            this.parent = node;
            rootNode = rootNode || node;
        }
        if (!oldNode) {
            this.componentWillMount(this.props);
        }
        this.componentWillUpdate(this.props);
        this.vdom = diff(this.vdom, this.render());
        this.componentDidUpdate(this.props);
        if (oldNode) {
            node && node.replaceChild(this.vdom.node, oldNode);
        }
        else {
            node && node.appendChild(this.vdom.node);
            this.componentDidMount(this.props);
        }
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
        var instance = new Component();
        instance.parent = this;
        this.components.push(instance);
        return function (props, config, children) {
            instance.props = props;
            return componentUpdate(instance).vdom;
        };
    },
    createElement: function (tag, props, children) {
        var node = null;
        var list = [];
        var fragment = document.createDocumentFragment();
        props = props instanceof Object ? props : {};
        children && children.forEach(function (item) {
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
            bindAttribute(this, node, props);
        }
        return {
            tag: tag,
            props: props,
            list: list,
            node: node,
            children: children
        };
    },
    createAttribute: function (tag, props) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        console.log(tag, props, children);
    }
};

class Nav extends React.Component {
    constructor() {
        super();
        this.shouldUpdate = true;
        this.state = {
            text: '12345',
            show: false,
        };
    }
    shouldComponentUpdate(props) {
        return this.shouldUpdate;
    }
    inputChange(e) {
        this.shouldUpdate = false;
        this.setState({
            text: e.target.value
        }, () => {
            this.shouldUpdate = true;
        });
    }
    btnClick() {
        this.setState({
            show: true
        });
    }
    componentDidMount() {
    }
    render() {
        return (React.createElement.bind(this)('nav', {className: "test"}, [
            React.createElement.bind(this)('span', null, [

                    this.state.show ? this.state.text : "hello world"

            ]),
            React.createElement.bind(this)('input', {type: "text", onChange: this.inputChange.bind(this)}),
            React.createElement.bind(this)('button', {onClick: this.btnClick}, ["修改"])
        ]))
    }
}

// 项目入口文件

class App extends React.Component {
  constructor() {
    super();
    console.log(this);
    this.state = {
      loading: true,
      title: '测试',
      mode: 'normal',
      logo: "/logo.png"
    };
  }
  componentDidMount (props) {
    // setTimeout(() => {
    //   this.setState({
    //     text: 'hello world!',
    //     loading: false
    //   })
    // }, 5000)
  }
  render() {
    return (React.createElement.bind(this)('span', null, [
      React.createElement.bind(this)('header', null, [
        React.createComponent.call(this, Nav)({logo: this.state.logo, className: "nav"})
      ]),
      React.createElement.bind(this)('main', {className: this.state.mode}, [
        React.createElement.bind(this)('div', null, [this.state.title])
      ])
    ]))
  }
}

// 编译 入口文件
new App().mount(document.getElementById("app"));

},{}]},{},[1]);
