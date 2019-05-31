// 项目入口文件
import React from '@/utils/react';
import Test from '@/components/test';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    console.log(this)
    this.state = {
      loading: true,
      text: 'loading'
    }
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
    return (<span>
      <Test text={this.state.text}>123</Test>
      {this.state.text}
      <bar init={!this.state.loading} test="text">
        <span><span>1</span></span>
        <div><span>111</span></div>
      </bar>
    </span>)
  }
}
