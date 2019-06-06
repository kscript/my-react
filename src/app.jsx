// 项目入口文件
import React from '@/utils/react';
import Nav from '@/components/nav';

export default class App extends React.Component {
  constructor() {
    super();
    console.log(this)
    this.state = {
      loading: true,
      title: '测试',
      mode: 'normal',
      logo: "/logo.png"
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
  render() {
    return (<span>
      <header>
        <Nav logo={this.state.logo} className="nav"></Nav>
      </header>
      <main className={this.state.mode}>
        <div>{this.state.title}</div>
      </main>
    </span>)
  }
}
