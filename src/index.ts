import {
    acorn,
    jsx,
    babel,
    generate,
} from "@/utils/babel";
const { Parser, Node } = acorn;
const { parse } = babel;
let node = Parser.extend(jsx({
    preserveParens: true,
    allowNamespacedObjects: true,
  })).parse(`<span>
  <span>{this.state.data.text}</span>
  {this.state.data.text}
  <bar text={this.state.data.text} test="text">
    <span><span>1</span></span>
    <div><span>111</span></div>
  </bar>
</span>`);
console.log(node);
