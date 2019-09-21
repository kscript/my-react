import React from '@/react';
import Header from '@/components/header';
import Nav from '@/components/nav';
import Button from '@/components/button';
export default class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      title: '按钮'
    }
    window.app = this;
  }
  buttonClick (text) {
    console.log(this, text);
  }
  inputChange (event) {
    this.setState({
      title: event.target.value
    })
  }
  render() {
    return (
      <div id="react-test" class="page">
        <Header logo="" name="测试"></Header>
        {/* <Nav></Nav> */}
        <input type="text" onChange={this.inputChange} defaultValue={this.state.title}/>
        <div className="main">
          {Array(5).fill('').map((item, index) => {
            return (
              index % 2 
              ? <Button text={this.state.title + -~index} onClick={ this.buttonClick.bind(this, '传递参数') }></Button>
              : <Button text={this.state.title + -~index} onClick={ this.buttonClick }></Button>
            )
          })}
        </div>
      </div>
    )
  }
}
