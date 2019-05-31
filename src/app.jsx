// 项目入口文件
import React from '@/utils/react';
import Test from '@/components/test';

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {
        text: 124
      }
    }
  }
  render() {
    return (<span>
      <Test text={this.state.data.text}>123</Test>
      <span>{this.state.data.text}</span>
      {this.state.data.text}
      <bar text={this.state.data.text} test="text">
        <span><span>1</span></span>
        <div><span>111</span></div>
      </bar>
    </span>)
  }
}
