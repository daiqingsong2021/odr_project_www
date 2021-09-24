import React, { Component } from 'react'
import style from './style.less'
import { Modal, Table, Button,notification } from 'antd';
import Search from "../../../../../components/public/Search"
import { connect } from 'react-redux'
import axios from '../../../../../api/axios'
import { prepaProjectteamProjectList, prepaProjectteamProjectAdd } from '../../../../../api/api'
import * as dataUtil from "../../../../../utils/dataUtil"
import MyIcon from '../../../../../components/public/TopTags/MyIcon';
import SubmitButton from "../../../../../components/public/TopTags/SubmitButton"
class ImportOneModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            visible: true,
            record: null,
            activeIndex: null,
            data: [],
            initData: []
        }
    }

    getDataList = (val) => {
        let data = {
            name: val ? val : '',
            onlyEnableProjectTeam:"Y"
        }
        axios.post(prepaProjectteamProjectList, data).then(res => {
            this.setState({
                data: res.data.data,
                initData : res.data.data
            })
        })

    }

    componentDidMount() {
        this.getDataList();

    }

    handleOk = () => {
        let bizType = this.props.bizType;
        if(!this.state.activeIndex){
          notification.warning(
            {
              placement: 'bottomRight',
              bottom: 50,
              duration: 2,
              message: '未选中数据',
              description: '请选择数据进行操作'
            }
          )
          return;
        }

        let extInfo = this.props.extInfo || {};
        let url = dataUtil.spliceUrlParams(prepaProjectteamProjectAdd('project', this.state.record.id, bizType, this.props.bizId ),{"startContent":extInfo.startContent});
        axios.post(url, {}, true,null,TextTrackCueList).then(res=>{
            this.props.getDataList();
            this.props.handleCancel();
        })
        
    }
    handleCancel = (e) => {

        this.props.handleCancel()
    }
    getInfo = (record, index) => {

        let id = record.id;
        if(record.type == 'project'){
            this.setState({
                activeIndex: id,
                record
            })
        } else{
            this.setState({
                activeIndex: null,
                record: null
            })
        }


    }
    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? "tableActivty" : "";
    }
    search = (val) => {
        const {initData} = this.state;
        let newData = dataUtil.search(initData,[{"key":"code|name","value":val},{"key":"type","value":"project"}]);
        this.setState({
          data: newData
        })
    }

    render() {
        const { intl } = this.props.currentLocale;
        const columns = [
            {
                title: intl.get('wsd.i18n.pre.proreview.name'),
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => {
                  if (record.type == "eps") {
                    return <span><MyIcon type="icon-xiangmuqun" style={{ fontSize: '18px' }}/>{text}</span>
                  } else {
                    return <span><MyIcon type="icon-xiangmu" style={{ fontSize: '18px' }}/> {text}</span>
                  }
                }

            },
            {
                title: intl.get('wsd.i18n.pre.proreview.code'),
                dataIndex: 'code',
                key: 'code',
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.starttime'),
                dataIndex: 'planStartTime',
                key: 'planStartTime',
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.endtime'),
                dataIndex: 'planEndTime',
                key: 'planEndTime',
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.iptname'),
                dataIndex: 'org',
                key: 'org',
                render: text => <span>{text ? (text.name ? text.name : '') : ''}</span>
            },
            {
                title: intl.get('wsd.i18n.pre.proreview.username'),
                dataIndex: 'user',
                key: 'user',
                render: text => <span>{text ? (text.name ? text.name : '') : ''}</span>
            },
        ]
        return (
            <div >
                <Modal className={style.main}
                    title={this.props.title} visible={this.props.visible}
                    onCancel={this.props.handleCancel}
                    width="950px"
                    mask={false}
                    maskClosable={false}
                    footer={
                        <div className="modalbtn">
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
                                size='small'
                                rowClassName={this.setClassName}
                                onRow={(record, index) => {
                                    return {
                                        onClick: () => {
                                            this.getInfo(record, index)
                                        }
                                    }
                                }
                                } />
                        </div>
                    </div>
                </Modal>

            </div>
        )
    }
}

export default connect(state => ({
    currentLocale: state.localeProviderData
}))(ImportOneModal)
