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
            else {
                node.setAttribute(key, props[key]);
            }
        }
    }
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
    Component.prototype.componentWillUpdate = function (props) {
    };
    Component.prototype.componentDidUpdate = function (props) {
    };
    Component.prototype.update = function () {
        var parentNode;
        if (this.parent instanceof HTMLElement) {
            parentNode = this.parent;
        }
        else {
            parentNode = this.parent.vdom.node;
        }
        return this.mount(parentNode, this.vdom.node);
    };
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
    Component.prototype.setState = function (set) {
        if (typeof set !== 'function') {
            for (var _i = 0, _a = Object.keys(set); _i < _a.length; _i++) {
                var key = _a[_i];
                this.state[key] = set[key];
            }
        }
        this.update();
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
            return instance.update().vdom;
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
    },
    createUnknownTag: function (tag, props) {
        var children = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            children[_i - 2] = arguments[_i];
        }
        console.log(tag, props, children);
    },
};

class Test extends React.Component {
    constructor(props) {
        super(props);
        console.log(this);
        this.state = {
            text: 12
        };
    }
    btnClick () {
        this.setState({
            text: 12345
        });
    }
    componentDidMount() {
    }
    render() {
        return (React.createElement.bind(this)('div', {className: "test"}, [
            this.state.text,
            React.createElement.bind(this)('button', {onClick: this.btnClick}, ["点击事件"])
        ]))
    }
}

// 项目入口文件

class App extends React.Component {
  constructor(props) {
    super(props);
    console.log(this);
    this.state = {
      loading: true,
      text: 'loading'
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
      React.createComponent.call(this, Test)({text: this.state.text}, ["123"]),
      this.state.text,
      React.createElement.bind(this)('bar', {init: !this.state.loading, test: "text"}, [
        React.createElement.bind(this)('span', null, [React.createElement.bind(this)('span', null, ["1"])]),
        React.createElement.bind(this)('div', null, [React.createElement.bind(this)('span', null, ["111"])])
      ])
    ]))
  }
}

// 编译 入口文件
new App().mount(document.getElementById("app"));
