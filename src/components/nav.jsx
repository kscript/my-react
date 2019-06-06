import React from '@/utils/react';
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
        }, () => {
            this.shouldUpdate = true;
        })
    }
    btnClick() {
        this.setState({
            show: true
        });
    }
    componentDidMount() {
    }
    render() {
        return (<nav className="test">
            <span>
                {
                    this.state.show ? this.state.text : "hello world"
                }
            </span>
            <input type="text" onChange={this.inputChange.bind(this)} />
            <button onClick={this.btnClick}>修改</button>
        </nav>)
    }
}

