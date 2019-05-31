import React from '@/utils/react';
export default class Test extends React.Component {
    constructor(props) {
        super(props);
        console.log(this);
        this.state = {
            text: 12
        };
    }
    btnClick () {
        this.setState({
            text: 12345
        });
    }
    componentDidMount() {
    }
    render() {
        return (<div className="test">
            {this.state.text}
            <button onClick={this.btnClick}>点击事件</button>
        </div>)
    }
}

