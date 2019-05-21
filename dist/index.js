'use strict';

var Babel = require('@babel/parser');
var Acorn = require('acorn');
require('@babel/generator');
var Jsx = require('acorn-jsx');

var acorn = Acorn;
var babel = Babel;
var jsx = Jsx;

var Parser = acorn.Parser, Node = acorn.Node;
var parse = babel.parse;
var node = Parser.extend(jsx({
    preserveParens: true,
    allowNamespacedObjects: true,
})).parse("<span>\n  <span>{this.state.data.text}</span>\n  {this.state.data.text}\n  <bar text={this.state.data.text} test=\"text\">\n    <span><span>1</span></span>\n    <div><span>111</span></div>\n  </bar>\n</span>");
console.log(node);
