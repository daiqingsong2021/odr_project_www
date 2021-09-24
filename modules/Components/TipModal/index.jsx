import React, { Component } from 'react'
import style from './style.less'
import { Icon, Row, Col, Input,  Modal } from 'antd';
import { connect } from 'react-redux'
import MyIcon from "../../../components/public/TopTags/MyIcon"
const { TextArea } = Input;
//提示框
class TipModal extends Component {
    render() {
        const { intl } = this.props.currentLocale
        return (
            <div >
                <Modal
                        width={350}
                        title={this.props.title? this.props.title:"删除"}
                        visible={true}
                        onOk={this.props.onOk}
                        onCancel={this.props.onCancel}
                        centered={true}
                        mask={false}
                        maskClosable={false}
                    >
                        <p style={{ textAlign: 'center', fontSize: 18, paddingTop: 10, paddingBottom: 10 }}>
                            <Icon type="warning"
                                style={{
                                    fontSize: 30,
                                    color: '#faad14'
                                }} /> {this.props.content? this.props.content:"你确定要删除吗？"}
                        </p>
                    </Modal>

            </div>
        )
    }
}

export default connect(state => ({
    currentLocale: state.localeProviderData
}))(TipModal);