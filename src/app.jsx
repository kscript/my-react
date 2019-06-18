// 项目入口文件
import React from '@/react';
import Nav from '@/components/nav';
import Button from '@/components/button';

export default class App extends React.Component {
  constructor() {
    super();
    console.log(this)
    this.state = {
      loading: true,
      title: '测试',
      mode: 'normal',
      logo: "/logo.png",
      btnText: '确定'
    }
  }
  componentDidMount (props) {
    setTimeout(() => {
      this.setState({
        title: 'hello world!',
        loading: false
      })
    }, 5000)
  }
  buttonClick (...rest) {
    console.log(this, rest);
    return (...args) => {
      console.log(this, args);
    }
  }
  render() {
    return (<span>
      <header>
        <Nav logo={this.state.logo} className="nav"></Nav>
      </header>
      <main className={this.state.mode}>
        <div>{this.state.title}</div>
        {
          Array(50).fill('').map((item, index) => {
            return (
              <div>
                <Button text={Math.random().toString(36).slice(8)} onClick={(e) => this.buttonClick(e, 123)}></Button>
                <Button text={Math.random().toString(36).slice(8)} onClick={this.buttonClick.bind(this, 123)}></Button>
              </div>
            )
          })
        }
      </main>
    </span>)
  }
}
