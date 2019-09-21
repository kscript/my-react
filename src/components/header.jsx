import React from '@/react';
export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillUpdate (props){
    console.log('componentWillUpdate', props);
  }
  componentDidUpdate (props){
    console.log('componentDidUpdate', props);
  }
  render() {
    return (
      <header>React测试</header>
    )
  }
}
