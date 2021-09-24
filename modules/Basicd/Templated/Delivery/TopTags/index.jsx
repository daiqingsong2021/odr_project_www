import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import { notification } from 'antd'
import Search from '../../../../../components/public/Search'
import style from './style.less'
import DevliveryAdd from '../Add'
import PublicButton from '../../../../../components/public/TopTags/PublicButton'
export class PlanDefineTopTags extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roleBtnData: [
        {
          id: 1,
          name: 'AddTopBtn',
          aliasName: '新增'
        },
        {
          id: 2,
          name: 'DeleteTopBtn',
          aliasName: '删除'
        },
      ]
    }
  }
  handleCancel = () => {
    this.setState({
      modalVisible: false
    })
  }

  showFormModal = (name) => {
    let that = this
    // 新增文档模板按钮
    if (name === 'AddTopBtn') {
      this.setState({
        modalVisible: true
      })
    }
    if (name == "DeleteTopBtn") {
      this.props.deleteData()
    }
  }

  //判断是否有选中数据
  hasRecord = () => {
    if (!this.props.selectedRowKeys.length) {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '未选中数据',
          description: '请选择数据进行操作'
        }
      )
      return false;
    } else {
      return true
    }
  }

  render() {
    let topTags = this.state.roleBtnData.map((v, i) => {
      return dynamic(import('../../../../../components/public/TopTags/' + v.name))
    })



    return (
      <div className={style.main}>
        <div className={style.search}>
          <Search placeholder = {"标题/编号"} search={this.props.search} />
        </div>
        <div className={style.tabMenu}>
          <PublicButton name={'新增'} title={'新增'} icon={'icon-add'}
            afterCallBack={this.showFormModal.bind(this, 'AddTopBtn')}
            res={'MENU_EDIT'}
          />
          <PublicButton name={'删除'} title={'删除'} icon={'icon-shanchu'}
            useModel={true} edit={true}
            verifyCallBack={this.hasRecord}
            afterCallBack={this.showFormModal.bind(this, 'DeleteTopBtn')}
            content={'你确定要删除吗？'}
            res={'MENU_EDIT'}
          />

        </div>
        {this.state.modalVisible && <DevliveryAdd handleCancel={this.handleCancel} addData={this.props.addData} />}

      </div>

    )
  }
}

export default PlanDefineTopTags
