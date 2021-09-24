import React, { Component } from 'react'
import style from './style.less'
import { Timeline, Icon, Modal, Table } from 'antd';
import intl from 'react-intl-universal'


const locales = {
    "en-US": require('../../../../../api/language/en-US.json'),
    "zh-CN": require('../../../../../api/language/zh-CN.json')
}

class MenuInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            visible: true,

        }
    }

    componentDidMount() {
        this.loadLocales();
        this.setState({
            width: this.props.width
        })
    }

    loadLocales() {
        intl.init({
            currentLocale: 'zh-CN',
            locales,
        })
            .then(() => {
                // After loading CLDR locale data, start to render
                this.setState({ initDone: true });
            });
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
        this.props.handleCancel()
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
        this.props.handleCancel()
    }
    render() {


        return (
            <div  >
                {this.state.initDone &&
                    <Modal title="流程图" visible={this.state.visible}
                        onOk={this.handleOk} onCancel={this.handleCancel}
                        width="700px"
                        className={style.main}
                        footer={null}
                        centered={true}
                    >
                        <div className={style.ProcessLogModal} >
                           
                            <div className={style.timeLine}>
                                <Timeline>
                                    <Timeline.Item className={this.props.index>=1? style.current:style.asd}><span ><Icon type="play-circle" />开始</span></Timeline.Item>
                                    <Timeline.Item className={this.props.index>=2? style.current: style.asd}><span ><Icon type="schedule" />计划编制人</span></Timeline.Item>
                                    <Timeline.Item className={this.props.index>=3? style.current: style.asd}><span ><Icon type="user" />项目办审批</span></Timeline.Item>
                                    <Timeline.Item className={this.props.index>=4? style.current: style.asd}><span ><Icon type="file-protect" />计划审核人</span></Timeline.Item>
                                    <Timeline.Item className={this.props.index>=5? style.current: style.asd}><span ><Icon type="poweroff" />结束</span></Timeline.Item>
                                </Timeline>
                            </div>
                        </div>
                    </Modal>


                }
            </div>
        )
    }
}

export default MenuInfo
