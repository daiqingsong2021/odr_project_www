import React, { Component } from 'react'
import style from './style.less'
import { Table } from 'antd'

import PropTypes from 'prop-types'

export class TreeTable extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    render() {
        return (
            <div className={style.main}>
                <Table name={this.props.name} columns={this.props.columns} rowSelection={this.props.rowSelection} dataSource={this.props.data} />
            </div>
        )
    }
}
// 默认数据
TreeTable.defaultProps = {
    columns: [
        {
            title: '表头1',
            dataIndex: 'column1',
            key: 'key1',
        },
        {
            title: '表头2',
            dataIndex: 'column2',
            key: 'key2',
        },
        {
            title: '表头3',
            dataIndex: 'column3',
            key: 'key3',
        }
    ],
    data: [
        {
            key: 1,
            column1: '数据1',
            column2: '数据2',
            column3: '数据3',
        },
        {
            key: 2,
            column1: '数据1',
            column2: '数据2',
            column3: '数据3',
        },
        {
            key: 3,
            column1: '数据1',
            column2: '数据2',
            column3: '数据3',
        }
    ]
}

// 数据类型校验
TreeTable.propTypes = {
    columns: PropTypes.array,
    data: PropTypes.array,
    name: PropTypes.string
}

export default TreeTable
