import React from 'react'
import style from './style.less'
import { Icon, Modal } from 'antd'
import MyIcon from './MyIcon'

class CancelCollection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    }
  }

  showDeleteConfirm = () => {
    this.setState({
      visible: !this.state.visible
    })
  }
  handleOk = () => {
    this.setState({
      visible: !this.state.visible
    })
    this.props.onClickHandle('CancelCollection');
  }

  render() {
    return (
      <span>
        <span className={`topBtnActivity ${style.main}`} onClick={this.showDeleteConfirm}>
          <MyIcon type="icon-quxiaoshoucang" />
          <a className="ant-dropdown-link" href="#"> 取消收藏</a>
        </span>
        <Modal
          width={450}
          title="确认要移除该收藏吗？"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.showDeleteConfirm}
        >
          <p style={{ textAlign: 'center', fontSize: 18, paddingTop: 10, paddingBottom: 10 }}>
            <Icon type="warning"
              style={{
                fontSize: 18,
                color: '#faad14'
              }} /> &nbsp;{this.props.deleteDesc ? this.props.deleteDesc : '取消收藏后，您的收藏夹将不再看到该文档信息'}
          </p>
        </Modal>
      </span>
    )
  }
}

export default CancelCollection
