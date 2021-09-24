import React, { Component } from 'react'
import style from './style.less'
import { Modal, Table, Button, Checkbox } from 'antd';
import intl from 'react-intl-universal'
const locales = {
    "en-US": require('../../../../api/language/en-US.json'),
    "zh-CN": require('../../../../api/language/zh-CN.json')
}



export class FlowWork extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [{
                id: 1,
                title: '是否超过支付限制',
                xpath: '/overvalue',
            }]
        }
    }
    componentDidMount() {
        this.loadLocales();
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
    getInfo = (record, index) => {

        this.setState({
            activeIndex: record.id
        })
    }

    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? `${style['clickRowStyl']}` : "";
    }
    render() {
        const columns = [
            {
                title: "名称",
                dataIndex: 'title',
                key: 'title',
            },
            {
                title: intl.get('wsd.i18n.sys.wfbizvar.xpath'),
                dataIndex: 'xpath',
                key: 'xpath',
            },
            {
                title: <Checkbox/>,
                dataIndex: 'select',
                key: 'select',
                render: (text, record) => (
                    <Checkbox/>
                  )
            }
        ];
      
        return (
            <div >
                <Modal
                    title="业务变量分配"
                    className={style.main}
                    footer={<div className="modalbtn">
                      <Button key={1} onClick={this.props.onCancel}>取消</Button>
                      <Button key={2} onClick={this.handleSubmit} type="primary">保存</Button>
                    </div>}
                    bodyStyle={{ padding: '20px' }}
                    width="850px"
                    centered={true}
                    visible={this.props.addWork}
                    onCancel={this.props.onCancel}

                >
                    <div className={style.table}>
                        <Table
                            columns={columns}
                            dataSource={this.state.data}
                            
                            pagination={false}
                            rowKey={record => record.id}
                            rowClassName={this.setClassName}
                            onRow={(record, index) => {
                                return {
                                    onClick: (event) => {
                                        this.getInfo(record, index)
                                    }
                                }
                            }
                            }
                        />
                    </div>

                </Modal>
            </div>
        )
    }
}

export default FlowWork
