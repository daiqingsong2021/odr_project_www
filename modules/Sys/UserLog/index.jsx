import React, { Component } from 'react';
import Log from "../Threeme/Components/Log"
 class UserLog extends Component {
    constructor(props) {
        super(props)
        this.state={

        }
    }
    render() {
        return (
            <div style={{padding:20}}>
                <Log typeFlag={1} height={this.props.height}/>
            </div>

        )
    }
}
export default UserLog