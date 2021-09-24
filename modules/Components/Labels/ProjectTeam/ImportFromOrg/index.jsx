import React, { Component } from 'react'
import style from './style.less'
import { Modal, Table, Checkbox, Button,notification } from 'antd';
import Search from "../../../../../components/public/Search"
import { connect } from 'react-redux'
import axios from '../../../../../api/axios'
import {
  prepaProjectteamIpt,
  prepaProjectteamOrg,
  prepaProjectteamImportAdd
} from '../../../../../api/api'
import * as dataUtil from "../../../../../utils/dataUtil";
import MyIcon from "../../../../../components/public/TopTags/MyIcon";
import SubmitButton from "../../../../../components/public/TopTags/SubmitButton"
class ImportOneModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            initData: [],
            checkedData: [],
            userFlag: false,
            dataSource: '',
            parentId: 0,
        }
    }

    IptGetData = (val) => {
        val = val ? val : ''
        axios.get(prepaProjectteamIpt + `?searcher=${val}`).then(res => {
            this.setState({
                data: res.data.data,
                initData : res.data.data,
                dataSource: 'ipt'
            })
        })
    }
    OrgGetData = (val) => {
        val = val ? val : ''
        axios.get(prepaProjectteamOrg + `?searcher=${val}`).then(res => {
            this.setState({
                data: res.data.data,
                initData : res.data.data,
                dataSource: 'org'
            })
        })
    }

    componentDidMount() {

        this.setState({
            parentId: this.props.record ? this.props.record.id : 0
        });
        if (this.props.title == 'IPT导入') {
            this.IptGetData();
        } else if (this.props.title == '组织机构导入') {
            this.OrgGetData();
        }
    }

    handleOk = () => {

        let { parentData, parentId, userFlag, checkedData, dataSource } = this.state;

        if(!checkedData || checkedData.length == 0){
            notification.warning({
                placement: 'bottomRight',
                bottom: 50,
                duration: 2,
                message: '未选中数据',
                description: '请选择数据进行操作'
            });
            return;
        }
        let data = {
            ids: checkedData,
            userFlag: userFlag
        }
        let {bizId,bizType} = this.props;
        let extInfo = this.props.extInfo || {};
        let url = dataUtil.spliceUrlParams(prepaProjectteamImportAdd(dataSource, bizType, bizId, parentId),{"startContent":extInfo.startContent});
        axios.post(url, data, true,null,true).then(res => {
            this.props.getDataList();
        })
        this.props.handleCancel()
    }
    handleCancel = (e) => {
        this.props.handleCancel()
    }
    getInfo = (record, index) => {
        let id = record.id;
        if (this.state.activeIndex == id) {
            id = null
        }
        this.setState({
            activeIndex: id
        })

    }
    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? "tableActivty" : "";
    }

    checkboxChange = (record, e) => {
        let checked = e.target.checked;
        if (checked) {
            this.setState({
                checkedData: [...this.state.checkedData, record.id]
            })
        } else {
            let index = this.state.checkedData.findIndex(val => val == record.id)
            this.setState({
                checkedData: [...this.state.checkedData.slice(0, index), ...this.state.checkedData.slice(index + 1)]
            })
        }
    }
    lead = (e) => {
        this.setState({
            userFlag: e.target.checked
        })
    }
    search = (val) => {
        if (this.props.title == 'IPT导入') {

            const {initData} = this.state;
            let newData = dataUtil.search(initData,[{"key":"iptName|iptCode","value":val}],true);
            this.setState({
              data: newData
            });

        } else if (this.props.title == '组织机构导入') {
          const {initData} = this.state;
          let newData = dataUtil.search(initData,[{"key":"orgName|orgCode","value":val}],true);
          this.setState({
            data: newData
          });
        }
    }


    render() {
        const { intl } = this.props.currentLocale;
        let columns = []

        if (this.props.title == 'IPT导入') {
            columns = [{
                title: intl.get('wsd.i18n.pre.proreview.name'),
                dataIndex: 'iptName',
                key: 'iptName',
                render: (text, record) => {
                    return (
                      <span> <MyIcon type='icon-bumen1' /> {text} </span>
                    )
                }
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.code'),
                dataIndex: 'iptCode',
                key: 'iptCode',
            },
            {
                title: "选择",
                dataIndex: 'select',
                key: 'select',
                render: (text, record) => (
                    <Checkbox onChange={this.checkboxChange.bind(this, record)}></Checkbox>
                )
            },]
        } else if (this.props.title == '组织机构导入') {
            columns = [{
                title: intl.get('wsd.i18n.pre.proreview.name'),
                dataIndex: 'orgName',
                key: 'orgName',
                render: (text, record) => {
                  if (record.orgType == 'tree') {
                    return (
                      <span> <MyIcon type='icon-zuzhijigou' /> {text} </span>
                    )
                  } else if (record.orgType == 0) {
                    return (
                      <span> <MyIcon type='icon-gongsi' /> {text} </span>
                    )
                  } else if (record.orgType == 1) {
                    return (
                      <span> <MyIcon type='icon-bumen1' /> {text} </span>
                    )
                  }
                }
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.code'),
                dataIndex: 'orgCode',
                key: 'orgCode',
            },
            {
                title: "选择",
                dataIndex: 'select',
                key: 'select',
                render: (text, record) => (
                    <Checkbox onChange={this.checkboxChange.bind(this, record)}></Checkbox>
                )
            },]
        }

        return (
            <div >
                <Modal className={style.main}
                    title={this.props.title} visible={this.props.visible}
                    onCancel={this.handleCancel}
                    width="850px"
                    mask={false}
                    maskClosable={false}
                    footer={
                        <div className="modalbtn">
                           <Checkbox key={3} onChange={this.lead}>导入用户</Checkbox>
                           <SubmitButton key={2} type="primary" onClick={this.handleOk} content="保存" />
                        </div>
                    }
                >
                    <div className={style.context}>
                        <section className={style.search}>
                            <Search search={this.search}></Search>
                        </section>

                        <div>
                            <Table columns={columns} dataSource={this.state.data} pagination={false}
                                rowKey={record => record.id}
                                bordered={true}
                                // rowSelection={rowSelection}
                                rowClassName={this.setClassName}
                                onRow={(record, index) => {
                                    return {
                                        onClick: (event) => {
                                            this.getInfo(record, index)
                                        }
                                    }
                                }
                                } />
                        </div>
                    </div>
                </Modal>
            </div >
        )
    }
}

export default connect(state => ({
    currentLocale: state.localeProviderData
}))(ImportOneModal)
