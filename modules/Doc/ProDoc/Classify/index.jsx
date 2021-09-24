import React, { Component } from 'react'
import style from './style.less'
import { Form, Table, Icon } from 'antd'
import intl from 'react-intl-universal'
import moment from 'moment'
import Allot from './Allot/index'

import { connect } from 'react-redux'
import { curdCurrentData } from '../../../../store/curdData/action'

const locales = {
    "en-US": require('../../../../api/language/en-US.json'),
    "zh-CN": require('../../../../api/language/zh-CN.json')
}

class Classify extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,                 //国际化初始化状态
            info: {},                        //基本信息
            Visible: false,
            columns: [{
                title: '分类码',
                dataIndex: 'classify',
                key: 'classify',
            }, {
                title: '码值',
                dataIndex: 'num',
                key: 'num',
            }, {
                title: '说明',
                dataIndex: 'explain',
                key: 'explain',
            }],
            data: [
                {
                    key: 1,
                    classify: '',
                    num: '',
                    explain: ''
                }
            ]
        }
    }
    componentDidMount() {
        this.loadLocales();
        this.setState({
            info: this.props.data
        })
    }

    loadLocales() {
        intl.init({
            currentLocale: 'zh-CN',
            locales,
        }).then(() => {
            this.setState({ initDone: true });
        });
    }

    handleCancel() {
        this.setState({ Visible: false })
    }

    click() {
        this.setState({ Visible: true })
    }

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
        },

    }



    render() {


        return (
            <div className={style.main}>
                {this.state.initDone && (
                    <div className={style.mainHeight}>
                        <h3 className={style.listTitle}>分类码</h3>
                        <div className={style.mainScorll}>
                            <div className={style.btn}>
                                <span onClick={this.click.bind(this)} ><Icon type="user" /> 分类 </span>
                                <span><Icon type="delete" /> 删除 </span>
                            </div>
                            <Table rowKey={record => record.key} rowSelection={this.rowSelection} columns={this.state.columns} dataSource={this.state.data}
                                pagination={false}
                            />
                        </div>
                    </div>
                )}
                <Allot modalVisible={this.state.Visible} handleOk={this.handleOk} handleCancel={this.handleCancel.bind(this)} />
            </div>
        )
    }
}

export default connect(null, {
    curdCurrentData
})(Classify);
