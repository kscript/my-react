import React from '@/react';
import Header from '@/components/header';
import Nav from '@/components/nav';
import Button from '@/components/button';
export default class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      title: '按钮',
      input: null
    }
    window.app = this;
  }
  buttonClick (text) {
    console.log(this, text);
  }
  inputChange (event) {
    // this.setState({
    //   title: event.target.value
    // })
  }
  submitChange(){
    this.setState({
      title: this.input.value
    })
  }

  render() {
    return (
      <div id="react-test" class="page">
        <Header logo="" title="功能测试"></Header>
        按钮名前缀: <input type="text" ref={(input) => this.input = input} onChange={this.inputChange} defaultValue={this.state.title}/>
        <Button text="确定" onClick={this.submitChange}></Button>
        <div className="main">
          {Array(5).fill('').map((item, index) => {
            return (
              index % 2 
              ? <Button text={this.state.title + ': ' + -~index} onClick={ this.buttonClick.bind(this, '传递参数') }></Button>
              : <Button text={this.state.title + ': ' + -~index} onClick={ this.buttonClick }></Button>
            )
          })}
        </div>
      </div>
    )
  }
}
