import React, { Component } from 'react'
import dynamic from 'next/dynamic'
import { notification } from 'antd'
import Search from '../../../../../components/public/Search'
import style from './style.less'
import CurAddForm from '../Add'
import PublicButton from '../../../../../components/public/TopTags/PublicButton'
import { connect } from 'react-redux'
import { currencyDelete } from '../../../../../api/api'
import axios from '../../../../../api/axios';
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

  handleOk = () => {
    this.setState({
      modalVisible: false
    })
    this.props.refresh()
  }
  componentDidMount() {


  }

  showFormModal = (name) => {
    const { intl } = this.props.currentLocale;
    let arr = this.props.arr
    let that = this

    if (name === 'AddTopBtn') {
      this.setState({
        modalVisible: true
      })

    } else if (name === 'DeleteTopBtn') {
      if (this.props.arr.length) {
        axios.deleted(currencyDelete, { data: arr }, true).then(res => {
          this.props.delData();

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
  }

  //判断是否有选中数据
  hasRecord = () => {
    if (!this.props.arr.length) {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '未选中数据',
          description: '请勾选数据进行操作'
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

        <div className={style.tabMenu}>
          {/* {
            topTags.map((Component, key) => {
              return <Component key={key} onClickHandle={showFormModal} />
            })
          } */}

          <PublicButton
            name={'新增'} title={'新增'} icon={'icon-add'}
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
        {this.state.modalVisible && <CurAddForm modalVisible={this.state.modalVisible} handleOk={this.handleOk}
          handleCancel={this.handleCancel} addData={this.props.addData} />}

      </div>

    )
  }
}

export default connect(state => ({
  currentLocale: state.localeProviderData
}))(PlanDefineTopTags)
