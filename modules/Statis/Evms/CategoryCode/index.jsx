import React, { Component } from 'react'
import { Table, notification } from 'antd'
import style from './style.less'

import { connect } from 'react-redux'
import axios from '../../../../api/axios'
import {getClassifyTags, cprtmDel, cprtmAdd} from '../../../../api/api'
import MyIcon from "../../../../components/public/TopTags/MyIcon";


class TeamInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            selectedRowKeys: [],
        }
    }
 
    componentDidMount() {
        axios.get(getClassifyTags(this.props.bizType, this.props.data.id)).then(res => {
            this.setState({

                data: res.data.data
            })
        })
    }
    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? "tableActivty" : "";
    }
    getInfo = (record, index) => {
        this.setState({
            activeIndex: record.id
        })
    }

  
    render() {
        const { intl } = this.props.currentLocale;
        const columns = [
            {
                title: "分类码",
                dataIndex: 'classifyType',
                render: (text, record) => text ? text.classifyName: null,
            
            },
            {
                title: '码值',
                dataIndex: 'classify',
                render: (text, record) => text ? text.classifyName: null,
               
            },

        ];
       
        return (
            <div className={style.main}>
                <h3 className={style.listTitle}>分类码</h3>
             
                <div className={style.mainScorll}>
                    <Table
                        rowKey={record => record.id}
                        className={style.table}
                        columns={columns}
                        dataSource={this.state.data}
                        pagination={false}
                        size='small'
                        name={this.props.name}
                        rowClassName={this.setClassName}
                      
                        onRow={(record, index) => {
                              return {
                                  onClick: () => {
                                      this.getInfo(record, index)
                                  }
                              }
                          }
                        }
                    />
                </div>
            </div>
        )
    }
}

export default connect(state => ({
    currentLocale: state.localeProviderData
}))(TeamInfo)
