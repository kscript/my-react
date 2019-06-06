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
var bindEvent = function (instance, _events) {
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
var bindAttribute = function (instance, node, props) {
    if (props instanceof Object) {
        for (var key in props) {
            if (/^on[A-Z].*$/.test(key)) {
                events.bindEvent(instance, node, key.toLowerCase(), props[key]);
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
};

var Events = /** @class */ (function () {
    function Events(rootNode) {
        this.rootNode = rootNode;
    }
    Events.prototype.addEvent = function (type, listener) {
        this.rootNode.addEventListener(type.slice(2), listener);
    };
    Events.prototype.bindEvent = function (instance, node, type, listener) {
        this.addEvent(type, function (e) {
            if (e.target === node) {
                listener.call(instance, e);
            }
        });
    };
    return Events;
}());

var _id = 1;
var events$1;
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
        if (node && isEmpty(this.parent)) {
            this.parent = node;
            if (!events$1 && node instanceof HTMLElement) {
                events$1 = new Events(node);
                bindEvent(this, events$1);
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
        var instance = this.components[this.indicator++];
        if (!instance) {
            instance = new Component();
            instance.parent = this;
            this.components.push(instance);
        }
        return function (props, config, children) {
            instance.props = props;
            var vdom = componentUpdate(instance).vdom;
            vdom.parent = _this.vdom;
            return vdom;
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
        var result = {
            tag: tag,
            props: props,
            list: list,
            node: node,
            children: children
        };
        result.children = (children || []).map(function (item) {
            if (item instanceof Object) {
                item.parent = result;
            }
            return item;
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
        });
    }
    btnClick() {
        this.shouldUpdate = true;
        this.setState({
            show: true
        });
    }
    componentDidMount() {
    }
    render() {
        return (React.createElement.bind(this)('nav', {className: "test"}, [
            this.props.logo,
            React.createElement.bind(this)('span', null, [

                    this.state.show ? this.state.text : "hello world"

            ]),
            React.createElement.bind(this)('input', {type: "text", onInput: this.inputChange.bind(this), value: this.state.text, ref: "input"}),
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
    setTimeout(() => {
      this.setState({
        title: 'hello world!',
        loading: false
      });
    }, 5000);
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
