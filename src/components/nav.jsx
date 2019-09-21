import React from '@/react';
export default class Nav extends React.Component {
    constructor() {
        super();
        this.shouldUpdate = true;
        this.state = {
            text: '12345',
            show: false,
        };
    }
    shouldComponentUpdate(props) {
        return this.shouldUpdate;
    }
    inputChange(e) {
        this.shouldUpdate = false;
        this.setState({
            text: e.target.value
        });
    }
    btnClick() {
        this.shouldUpdate = true;
        this.setState({
            show: true
        });
    }
    componentDidMount() {
    }
    render() {
        return (<nav className="test">
            {this.props.logo}
            <span>
                {
                    this.state.show ? this.state.text : "hello world"
                }
            </span>
            <input type="text" onInput={this.inputChange} value={this.state.text} ref="input"/>
            <button onClick={this.btnClick}>修改</button>
        </nav>)
    }
}

