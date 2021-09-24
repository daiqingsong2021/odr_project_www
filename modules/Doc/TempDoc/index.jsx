import React, { Component } from 'react'
import style from './style.less'
import { Table, Icon, notification } from 'antd';
import TopTags from './TopTags/index'
import RightTags from '../../../components/public/RightTags/index'
import { connect } from 'react-redux'
import axios from '../../../api/axios'
import { docTempList, docFileInfo } from '../../../api/api'
import * as util from '../../../utils/util'
import PublicTable from '../../../components/PublicTable'
class TempDoc extends Component {

    state = {
        initDone: false,
        activeIndex: "",
        rightData: null,
        rightTags: [],
        currentPage: 1,
        pageSize: 10,
        selectedRowKeys: [],
        data: [],
        total: 0,

    }

    getDataList = (currentPageNum, pageSize,callBack)=>{

        axios.get(docTempList(pageSize,currentPageNum) + `?name=${this.state.keyWords ? this.state.keyWords : ''}`).then(res => {
            callBack(res.data.data)
            this.setState({
                data: res.data.data,
                total: res.data.total,
              selectedRowKeys:[],
              record:null
            })
        })
    }


    //table点击行
    getInfo = (record, index) => {
        this.setState({
           rightData: record
        })
    }

    //搜索
    search = (val) => {
        this.setState({
          keyWords:val
        },()=>{
          this.table.getData()
        })

    }

    //删除
    delData = () => {
      this.table.getData()
    }
  refresh=()=>{
      this.table.getData()
  }

  /**
   * 父组件即可调用子组件方法
   * @method
   * @description 获取用户列表、或者根据搜索值获取用户列表
   * @param {string} record  行数据
   * @return {array} 返回选中用户列表
   */
  onRef = (ref) => {
    this.table = ref
  }

  /**
   * 获取复选框 选中项、选中行数据
   * @method
   * @param {string} selectedRowKeys 复选框选中项
   * @param {string} selectedRows  行数据
   */
  getSelectedRowKeys = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRows,
      selectedRowKeys
    })
  }


    //下载
    downloadDoc = () => {
        let { intl } = this.props.currentLocale;
        let { rightData } = this.state;
        if (rightData) {
            axios.get(docFileInfo(rightData.id)).then(res => {
                if (res.data.data) {
                    util.download(res.data.data.fileUrl, res.data.data.fileName,res.data.data.id)
                }
            })

        } else {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: intl.get('wsd.global.tip.title2'),
                    description: intl.get('wsd.global.tip.content2')
                }
            )
        }

    }

    //完善信息成功后回调
    update = () => {
      this.table.getData()
    }

    //查看
    eyeClick = (record) => {
        const { intl } = this.props.currentLocale;
    
        let arr = ['html', 'txt', 'jpg', 'jpeg', 'gif', 'png', 'art', 'au', 'aiff', 'xbm', 'pdf','doc','docx','rtf','xls','xlsx','csv'];
        if (record.fileId) {
          const { startContent } = this.state
          let url = dataUtil.spliceUrlParams(docFileInfo(record.fileId), { startContent });
          axios.get(url).then(res => {
            if (res.data.data && res.data.data.fileUrl) {
              let type = res.data.data.fileName ? res.data.data.fileName.substring(res.data.data.fileName.lastIndexOf(".")+1) : '';
              if(type){
                type = type.toLowerCase();
              }
              let index = arr.findIndex(item => item == type);
              if (index != -1) {
                if (res.data.data.fileViewUrl && (type == 'doc' ||  type == 'docx' ||  type == 'rtf' ||  type == 'xls' ||  type == 'xlsx' ||  type == 'csv')){
                  window.open(res.data.data.fileViewUrl)
                } else{
                  window.open(res.data.data.fileUrl)
                }
              } else {
                dataUtil.message(intl.get('wsd.global.hint.docwarning'));
              }
            }
          })
        } else {
          dataUtil.message(intl.get('wsd.i18n.doc.compdoc.hinttext'));
        }
      }


    render() {
        const { intl } = this.props.currentLocale
        const columns = [{
            title: intl.get("wsd.i18n.plan.fileinfo.filename"),//文件名称
            dataIndex: 'fileName',
            key: 'fileName',
          width:'33%',
            render: (text, record) => <span> <Icon type="eye" className={style.icon} onClick={this.eyeCLick.bind(this, record)} />{text} </span>
        }, {
            title: intl.get("wsd.i18n.base.planTemAddWBS.creattime"),//创建日期
            dataIndex: 'creatTime',
            key: 'creatTime',
          width:'33%',
        }, {
            title: intl.get("wsd.i18n.base.tmpldelv1.creator"),//创建人
            dataIndex: 'creator',
            key: 'creator',
            render: text => text ? text.name : ''
        }];

        return (
            <div >
                <TopTags search={this.search} dataArr={this.state.selectedRowKeys} delData={this.delData} getDataList={this.refresh}
                    download={this.downloadDoc} update={this.update} />
                <div className={style.main}>
                    <div className={style.leftMain} style={{ height: this.props.height }}>

                      <PublicTable onRef={this.onRef}
                                   rowSelection={true}
                                   pagination={true}
                                   useCheckBox={true}
                                   onChangeCheckBox={this.getSelectedRowKeys}
                                   getData={this.getDataList}
                                   columns={columns}
                                   scroll={{x: '100%', y: this.props.height - 100}}
                                   getRowData={this.getInfo}
                                   total={this.state.total}
                      />
                    </div>

                </div>
            </div>
        )
    }
}




/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(TempDoc);
  /* *********** connect链接state及方法 end ************* */
