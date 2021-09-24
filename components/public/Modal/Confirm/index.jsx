import React from 'react'
import {Modal, Icon} from 'antd';
import '../../../../asserts/antd-custom.less';

export class Confirm extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        visible : props.visible
      }
    }

    componentWillMount() {
      this.setState({visible:this.props.visible});
    }

    handleCancel = () => {
        this.setState({visible:false});
        if(this.props.handleCancel){
            this.props.handleCancel();
        }
    }

    handleOk = () => {
        if(this.props.handleOk){
            this.props.handleOk();
        }
    }

    render() {
      let {title,content,icon,width} = this.props;

      title = title || "是否继续";
      content = content || "确认要继续操作此项吗？";
      icon = icon || "warning";
      width = width || 350;

      return (
          <Modal
              width={width }
              title={title }
              visible={true}
              onOk={this.handleOk}
              onCancel={this.handleCancel }
              mask={false}
              maskClosable={false}
          >
            <p style={{textAlign: 'center', fontSize: 18, paddingTop: 10, paddingBottom: 10}}>
              <Icon type={icon}
                    style={{
                      fontSize: 30,
                      color: '#faad14'
                    }}
              /> &nbsp;{content}
            </p>
          </Modal>
      )
    }
}

