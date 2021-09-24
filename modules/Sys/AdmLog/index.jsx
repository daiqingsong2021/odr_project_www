import React, { Component } from 'react';
import Log from "../Threeme/Components/Log"
class AdmLog extends Component {
    constructor(props) {
        super(props)
        this.state={

        }
    }
    render() {
        return (
            <div style={{padding:20}}>
                <Log typeFlag={0} height={this.props.height}/>
            </div>

        )
    }
}
export default AdmLog