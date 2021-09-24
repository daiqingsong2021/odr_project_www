import React, { Component } from 'react'
import style from './style.less'
import { Timeline, Icon, Modal, Table } from 'antd';
import intl from 'react-intl-universal'


const locales = {
    "en-US": require('../../../../../api/language/en-US.json'),
    "zh-CN": require('../../../../../api/language/zh-CN.json')
}
function RightNode(props) {
    return <div className={style.node}>
        <p><Icon type="exception" style={{ marginRight: "5px" }} /><span className={style.head}>节点名称：</span>{props.data.name}</p>
        <div className={style.maas}>
            <div className={style.a}>
                <p><span className={style.head}>操作类型：</span>{props.data.type}</p>
                <p><span className={style.head}>处理人：</span>{props.data.operater}</p>
            </div>
            <p><span className={style.head}>处理意见：</span>{props.data.advice}</p>
        </div>
    </div>
}
class MenuInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            visible: true,
            data: [
                {
                    id: 1,
                    key: 1,
                    name: "提交人",
                    type: "提交",
                    operater: "韩文浩",
                    advice: "",
                    date: "2018-12-13 13:53:12",
                    time: "2天"
                },
                {
                    id: 2,
                    key: 2,
                    name: "发起人",
                    type: "发起",
                    operater: "韩文琳",
                    advice: "",
                    date: "2018-12-13 13:53:12",
                    time: "18小时"
                },
                {
                    id: 3,
                    key: 3,
                    name: "发起人",
                    type: "发起",
                    operater: "韩文琳",
                    advice: "",
                    date: "2018-12-13 13:53:12",
                    time: "18小时"
                }
            ]
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
            <div >
                {this.state.initDone &&
                    <Modal title="流程日志" visible={this.state.visible}
                        onOk={this.handleOk} onCancel={this.handleCancel}
                        width="700px"
                        footer={null}
                        centered={true}
                        className={style.main}
                    >
                        <div className={style.ProcessLogModal} >
                            <p className={style.titleh}>[ACM产品开发项目] 计划发布审批流程 (发起人:韩春琳)</p>
                            <div className={style.nodecontent}>
                                <Timeline>

                                    {this.state.data.map((item,i) =>
                                        <div key={item.id}>
                                            <Timeline.Item>
                                                <div className={i==1? `${style.node} ${style.currentcolr}`:style.node}>
                                                    <p><Icon type="exception" style={{ marginRight: "5px" }} /><span className={style.head}>节点名称：</span>{item.name}</p>
                                                    <div className={style.maas}>
                                                        <div className={style.a}>
                                                            <p><span className={style.head}>操作类型：</span>{item.type}</p>
                                                            <p><span className={style.head}>处理人：</span>{item.operater}</p>
                                                        </div>
                                                        <p><span className={style.head}>处理意见：</span>{item.advice}</p>
                                                    </div>
                                                </div>
                                                <div className={style.time}>
                                                    <p>{item.date}</p>
                                                    <p className={style.s}>{"停留时间：" + item.time}</p>
                                                </div>
                                            </Timeline.Item>

                                        </div>
                                    )}
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
