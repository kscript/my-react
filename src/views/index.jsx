import React from '@/react';
import Header from '@/components/header';
import Nav from '@/components/nav';
import Button from '@/components/button';
export default class Index extends React.Component {
  constructor() {
    super();
  }
  buttonClick (text) {
    console.log(this, text);
  }
  render() {
    return (
      <div id="react-test" class="page">
        <Header logo="" name="测试"></Header>
        <Nav></Nav>
        <div className="main">
          {Array(5).fill('').map((item, index) => {
            return (
              index % 2 
              ? <Button text={'按钮'  + -~index} onClick={this.buttonClick.bind(this, '传递参数')}></Button>
              : <Button text={'按钮' + -~index} onClick={this.buttonClick}></Button>
            )
          })}
        </div>
      </div>
    )
  }
}
