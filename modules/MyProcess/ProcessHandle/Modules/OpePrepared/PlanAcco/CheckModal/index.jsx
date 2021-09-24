import React, { Component } from 'react'
import style from './style.less'
import { Button, Icon, Modal, Table } from 'antd';
import { connect } from 'react-redux'



class MenuInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            visible: true,
            data: [
                {
                    key: 1,
                    name: "ACM产品项目说明文档.docx",
                    size: "2.10M"
                },
                {
                    key: 2,
                    name: "ACM产品项目说明文档.docx",
                    size: "2.10M"
                }
            ]
        }
    }

    
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
        this.props.handleCancel()
    }
    render() {

        const { intl } = this.props.currentLocale
        return (
            <div className={style.main} >
                {this.state.initDone &&
                    <Modal title="附件明细(2)" visible={this.props.visible}
                        onOk={this.props.handleOk} onCancel={this.props.handleCancel}
                        okText="确定"
                        cancelText="取消"
                        width="600px"
                        footer={null}
                    >
                        <div className={style.CheckModal} >
                            <div className={style.content}>
                                {
                                    this.state.data.map((item,index) => {
                                        return <li key={item.key}>
                                            <span className={style.index}>{index+1+"."}</span>
                                            <span className={style.name}>{item.name}</span>
                                            <span >{"（" + item.size + "）"}</span>
                                            <div className={style.icon}><Icon type="eye" /><Icon type="download" /><Icon type="close" /></div>
                                        </li>
                                    })
                                }
                            </div>
                            <div className={style.button}><a href="#"><Icon type="download" />全部下载</a></div>
                        </div>
                    </Modal>


                }
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
        processUrl: state.process
    }
};


export default connect(mapStateToProps, null)(MenuInfo);