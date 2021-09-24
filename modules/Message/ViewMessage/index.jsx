import React, { Component } from 'react'
import { Row, Col, Form, Input, Select, DatePicker, Button, Popover, Pagination, Table, Icon } from 'antd'
import style from './style.less'
import { connect } from 'react-redux'
import MyIcon from '../../../components/public/TopTags/MyIcon'
import * as util from '../../../utils/util'

import axios from '../../../api/axios'
import { messageView, messageRead, messageFileList, messageRecvDel, messageSendDel, completionListPie } from '../../../api/api'


const Search = Input.Search;

export class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            fileList: [],

        };
    }

    getData = () => {
        if (this.props.type == 'inbox') {
            axios.get(messageView(this.props.data.messageId)).then(res => {

                this.setState({
                    data: res.data.data
                },()=>{
                    this.initContent();
                })
                if (res.data.data.fileIds) {
                    this.getFileList(res.data.data.fileIds)
                }

            })
        } else {
            axios.get(messageView(this.props.data.id)).then(res => {
       
                this.setState({
                    data: res.data.data
                },()=>{
                    this.initContent();
                })
                if (res.data.data.fileIds) {
                    this.getFileList(res.data.data.fileIds)
                }
            })
        }
    }
    initContent=()=>{
        let { data } = this.state;
        let styleParam = {};
        if( data.content && data.content.lastIndexOf("@") != -1){
            const content = data.content.split("@")[0];
            let obj = JSON.parse(data.content.split("@")[1]);
            // styleParam['url'] = obj.url;
            // styleParam['id'] = obj.id;
            this.setState({
                content,styleParam:obj
            })
        }else{
            const content = data.content;
            this.setState({
                content
            })
        }
    }
    //附件获取
    getFileList = (val) => {
        axios.post(messageFileList, val).then(res => {
      
            this.setState({
                fileList: res.data.data
            })
        })
    }


    componentDidMount() {

        this.getData();
    //更改未读状态
        if (this.props.type == 'inbox' && this.props.data.realStatus.id == '0') {
            axios.put(messageRead, [this.props.data.id]).then(res => {
                //更改未读状态数量
                this.props.changeUnreadNum()
            })
        }

    }

    //回复\转发
    replyClick = (val) => {
        this.props.alterShow(val, null, this.props.data)
    }

    //删除消息
    deleteClick = () => {
        if (this.props.type == 'inbox') {
            axios.put(messageRecvDel, [this.props.data.id], true, '已删除').then(res => {
                this.props.alterShow('inbox', null, null)
                this.props.addDeletedNum()
            })
        } else {
            axios.put(messageSendDel, [this.props.data.id], true, '已删除').then(res => {
                this.props.alterShow('outbox', null, null)
                this.props.addDeletedNum()
            })
        }

    }

    //文件下载
    downloadClick = (data) => {
        if (data.fileUrl) {
            util.download(data.fileUrl, data.fileName,data.id)
        }
    }
    //点击链接到业务模块
    onClickHandleCheck =()=>{
        const {styleParam} = this.state;
        localStorage.setItem(styleParam.name, JSON.stringify(styleParam))
        this.props.openMenuByMenuCode(styleParam.menuCode,true);
    }
    render() {
        const { intl } = this.props.currentLocale;
        let { data } = this.state;
        
        var claimDealType = '';
        if (data.claimDealType && data.claimDealType.name && data.claimDealTime) {
            let name = data.claimDealType.name;
            name = name.split('...');
            claimDealType = name.join(data.claimDealTime)
        } else if (data.claimDealType && data.claimDealType.name) {
            claimDealType = data.claimDealType.name
        }

        var recvUser = []
        if (data.recvUser && data.recvUser.length) {
            let aaa = data.recvUser
            for (let i = 0; i < aaa.length; i++) {
                if (aaa[i] && aaa[i].name) {
                    recvUser.push(aaa[i].name)
                }

            }
        }
        return (
            <div className={style.main}>
                <div className={style.head}>
                    {/* 查看消息 */}
                    <h2>{intl.get('wsd.i18n.doc.message.viewmessage')}</h2>
                    <p> <span className={style.label}> 主题： </span> <span> {data.title} </span> </p>
                    {this.props.type == 'inbox' &&
                        <p> <span className={style.label}> 发件人： </span> <span> {data.sendUser ? data.sendUser.name : ''} </span>  </p>
                    }
                    {this.props.type == 'inbox' &&
                        <p> <span className={style.label}> 需要回复： </span> <span> {claimDealType} </span>  </p>
                    }
                    {this.props.type == 'outbox' &&
                        <p> <span className={style.label}> 收件人： </span> <span> {recvUser.length ? recvUser.join('，') : ''} </span>  </p>
                    }
                    <div className={style.time}>
                        <span>
                            {data.sendTime}
                        </span>
                    </div>
                </div>
                <div className={style.center}>
                    {!this.state.styleParam?(
                        <div dangerouslySetInnerHTML={{ __html:this.state.content}}></div>

                    ):(
                        <div dangerouslySetInnerHTML={{ __html: this.state.content}} style={{'cursor':'pointer','color':'#1890ff','text-decoration':'underline'}} onClick={this.onClickHandleCheck.bind(this)} ></div>
                    )}
                </div>
                <div className={style.download}>
                    <div className={style.downloadSubitem}> <MyIcon type='icon-fujian2' /> {data.fileIds ? data.fileIds.length : 0}个附件</div>

                    <div className={style.show}>

                        {
                            this.state.fileList.length != 0 && this.state.fileList.map(item => {

                                let type = item.fileName.split('.')[1];
                                let creatTime = ''
                                if (item.creatTime) {
                                    creatTime = item.creatTime.split(' ')[0]
                                }

                                if (type == 'doc' || type == 'docx') {
                                    return (
                                        <div className={style.showSubitem} key={item.id} onClick={this.downloadClick.bind(this, item)} >

                                            <div className={style.showIcon}>
                                                <Icon type="file-word" className={style.icon} />
                                            </div>
                                            <div className={style.showHint}>
                                                <p>{item.fileName}</p>
                                                <p>添加时间：<span> {creatTime} </span></p>
                                            </div>

                                        </div>

                                    )
                                } else if (type == 'xls') {
                                    return (
                                        <div className={style.showSubitem} key={item.id} onClick={this.downloadClick.bind(this, item)} >

                                            <div className={style.showIcon}>
                                                <Icon type="file-excel" className={style.icon} />
                                            </div>
                                            <div className={style.showHint}>
                                                <p>{item.fileName}</p>
                                                <p>添加时间：<span> {creatTime} </span></p>
                                            </div>

                                        </div>

                                    )
                                } else if (type == 'pdf') {
                                    return (
                                        <div className={style.showSubitem} key={item.id} onClick={this.downloadClick.bind(this, item)} >

                                            <div className={style.showIcon}>
                                                <Icon type="file-pdf" className={style.icon} />
                                            </div>
                                            <div className={style.showHint}>
                                                <p>{item.fileName}</p>
                                                <p>添加时间：<span> {creatTime} </span></p>
                                            </div>

                                        </div>
                                    )
                                } else if (type == 'jpg' || type == 'png') {
                                    return (
                                        <div className={style.showSubitem} key={item.id} onClick={this.downloadClick.bind(this, item)} >

                                            <div className={style.showIcon}>
                                                <Icon type="file-jpg" className={style.icon} />
                                            </div>
                                            <div className={style.showHint}>
                                                <p>{item.fileName}</p>
                                                <p>添加时间：<span> {creatTime} </span></p>
                                            </div>

                                        </div>
                                    )
                                } else {
                                    return (
                                        <div className={style.showSubitem} key={item.id} onClick={this.downloadClick.bind(this, item)} >

                                            <div className={style.showIcon}>
                                                <Icon type="file-text" className={style.icon} />
                                            </div>
                                            <div className={style.showHint}>
                                                <p>{item.fileName}</p>
                                                <p>添加时间：<span> {creatTime} </span></p>
                                            </div>

                                        </div>
                                    )
                                }




                            })
                        }

                    </div>



                </div>
                <div className={style.button}>
                    <div>
                        {this.props.type == 'inbox' &&
                            <span>
                                <Button onClick={this.replyClick.bind(this, 'reply')} > <MyIcon type='icon-huifu' /> 回复 </Button>
                                <Button onClick={this.replyClick.bind(this, 'transmit')} > <MyIcon type='icon-zhuanfa' /> 转发 </Button>
                            </span>
                        }
                        <Button onClick={this.deleteClick} > <MyIcon type='icon-delete' /> 删除 </Button>

                    </div>
                </div>


            </div>
        )
    }

}


export default connect(state => ({
    currentLocale: state.localeProviderData
}))(Index)
