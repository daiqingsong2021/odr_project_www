import React, { Component } from 'react'
import { Popover} from 'antd';
import style from './style.less';
import CheckFile from '../CheckModal';


class FilePopover extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible:false
        }
    }

    componentDidMount() {
        
    }
    handleVisibleChange = (visible)=>{
        this.setState({ visible });
    }
    hide = () => {
        this.setState({
          visible: false,
        });
      };
    render() {
        return (
            <Popover
                placement="right" 
                content={this.state.visible?<CheckFile record={this.props.record} />:''}
                title="附件明细"
                trigger="click"
                visible={this.state.visible}
                onVisibleChange={this.handleVisibleChange}>
                <span style={{color:"#1890ff",cursor:'pointer'}}>查看文件（{this.props.fileCount}）</span>
            </Popover>
        )
    }
}
export default FilePopover;
