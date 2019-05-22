import React from '@/utils/react';
export default class Demo extends React.Component {
  constructor(){
    super();
    this.state = {
      data: {
        text: 124
      }
    }
  }
  render(){
    return (<span>
    <span>{this.state.data.text}</span>
    {this.state.data.text}
    <bar text={this.state.data.text} test="text">
      <span><span>1</span></span>
      <div><span>111</span></div>
    </bar>
  </span>)
  }
}

console.log(new Demo(), React);
