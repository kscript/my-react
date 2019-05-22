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
var createElement = function (type, config, children) {
    console.log(type, config, children);
};
var Component = /** @class */ (function () {
    function Component() {
        this.state = {};
        this.rid = 1;
        this.rid = rid++;
    }
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
    createElement: createElement
};

class Demo extends React.Component {
  constructor(){
    super();
    this.state = {
      data: {
        text: 124
      }
    };
  }
  render(){
    return (React.createElement('span', null, [
    React.createElement('span', null, [this.state.data.text]),
    this.state.data.text,
    React.createElement('bar', {text: this.state.data.text, test: "text"}, [
      React.createElement('span', null, [React.createElement('span', null, ["1"])]),
      React.createElement('div', null, [React.createElement('span', null, ["111"])])
    ])
  ]))
  }
}
let demo = new Demo();
console.log(demo, demo.render(), React);

module.exports = Demo;
