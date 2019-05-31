import React from '@/utils/react';
export default class Test extends React.Component {
    constructor() {
        super();
        this.state = {
            data: {
                text: 12
            }
        }
    }
    render() {
        return (<div className="test">
            <span>{this.state.data.text}</span>
            {this.state.data.text}
            <bar text={this.state.data.text} test="text">
                <span><span>1</span></span>
                <div><span>111</span></div>
            </bar>
        </div>)
    }
}

