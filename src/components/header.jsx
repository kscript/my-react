import React from '@/react';
export default class Header extends React.Component {
  constructor(props) {
    super(props);
    console.log(this, arguments);
  }
  render() {
    return (
      <header>React测试</header>
    )
  }
}
