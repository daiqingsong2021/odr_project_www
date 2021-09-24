import React, { Component } from 'react'
import style from './style.less'
import {Button,notification, Modal, Table } from 'antd';
import SubmitButton from "../../../../../components/public/TopTags/SubmitButton"
import axios from "../../../../../api/axios"
import {getClassifyByBoCode, distributeClassify, deleteclassifyassign} from "../../../../../api/api"
import { connect } from 'react-redux';
import MyIcon from "../../../../../components/public/TopTags/MyIcon"
import * as dataUtil from "../../../../../utils/dataUtil";
class UploadModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: true,
        }
    }

    componentDidMount() {
        axios.get(getClassifyByBoCode(this.props.bizType,this.props.data.id)).then(res => {
            this.setState({
                data: res.data.data
            })
        })
    }

    getInfo = (record, index) => {
        if(record.classifyType==2){
            if (record.id == this.state.activeIndex) {
                this.setState({
                    activeIndex: null,
                    rightData: null
                })
            } else {
                this.setState({
                    activeIndex: record.id,
                    rightData: record
                })
            }
        }
       

    }

    setClassName = (record, index) => {
        //判断索引相等时添加行的高亮样式
        return record.id === this.state.activeIndex ? 'tableActivty' : "";
    }
  
    handleOk = () => {
        if(this.state.rightData){
            let data={
                classifyTypeId:this.state.rightData.parentId,
                classifyId:this.state.rightData.id,
                bizId:this.props.data.id,
                boCode:this.props.bizType
            }

            let extInfo = this.props.extInfo || {};
            let url = dataUtil.spliceUrlParams(distributeClassify,{"startContent":extInfo.startContent});
            axios.post(url,data,true).then(res=>{
                this.props.distributeClassify(res.data.data)
            })
          
            this.props.handleCancel()
        }else{
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '未选中数据',
                    description: '请选择数据进行操作'
                }
            )
            return
        }
        
    }
    handleCancel = (e) => {
    
       
        this.props.handleCancel()
    }


    render() {
        const { intl } = this.props.currentLocale
        const columns = [
            {
                title:"代码",
                dataIndex: 'classifyCode',
                key: 'classifyCode',
                render: (text, record) => {
                    if (record.classifyType==1) {
                        return <span><MyIcon type="icon-bumen" style={{ fontSize: '18px',verticalAlign:"middle"}} />&nbsp;{text}</span>
                    } else {
                        return <span><MyIcon type="icon-fenlei2" style={{ fontSize: '18px' ,verticalAlign:"middle",color:"#aed7ff"}} />&nbsp;{text}</span>
                    }
                }
            },
            {
                title: '名称',
                dataIndex: 'classifyName',
                key: 'classifyName',
            }
        ]
        return (
            <div className={style.main}>
            
                    <Modal title="分配分类码" visible={this.state.visible}
                        onOk={this.handleOk} onCancel={this.handleCancel}
                        okText="确定"
                        cancelText="取消"
                        width="700px"
                        footer={[
                            <SubmitButton key="back" onClick={this.handleCancel} content="取消" />,
                            <SubmitButton key="submit" type="primary" onClick={this.handleOk}  content="分配"  />,
                        ]}
                    >
                        <div className={style.DistributeModal}>
                            {/* <div className={style.search}>
                                <Search></Search>
                            </div> */}

                            <Table columns={columns} dataSource={this.state.data}
                                rowClassName={this.setClassName}
                                pagination={false}
                                size="small"
                                rowKey={record => record.id}
                                onRow={(record, index) => {
                                    return {
                                        onClick: (event) => {
                                            this.getInfo(record, index)
                                        }
                                    }
                                }
                                } />
                        </div>
                    </Modal>
                
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};

export default connect(mapStateToProps, null)(UploadModal);
