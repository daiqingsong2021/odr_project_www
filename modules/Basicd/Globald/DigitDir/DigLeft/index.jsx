import React, {Component} from 'react'
import intl from 'react-intl-universal'
import {Table,Icon} from 'antd'
const locales = {
    "en-US": require('../../../../../api/language/en-US.json'),
    "zh-CN": require('../../../../../api/language/zh-CN.json')
}
class TableComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // name: 'SysUser',
            initDone: false,
            columns: [
                {
                    title: <h3>业务对象</h3>,
                    dataIndex: 'name',
                    key: 'name',
                },
            ],
            data: [
                {
                    id: 1,
                    name:"风险管理",
                    key: 1,
                },
                {
                    id: 2,
                    name:"管理规范",
                    key:2,
                },
                {
                    id: 3,
                    name: "问题管理",
                    key:3,
                },
                {
                    id: 4,
                    name: "编码管理",
                    key:4,
                },
                {
                    id: 5,
                    name: "项目管理",
                    key:5,
                },
            ],


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
                this.setState({initDone: true});
            });
    }

    render() {

        return (
            <div>
                <Table columns={this.state.columns} dataSource={this.state.data} pagination={false}/>
            </div>
        )
    }
}

export default TableComponent