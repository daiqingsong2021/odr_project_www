import React, { Component } from 'react'
// import intl from 'react-intl-universal'
import { Table, Spin } from 'antd'
import style from './style.less'
import _ from 'lodash'
import TopTags from './TopTags/index'
import RightTags from '../../../components/public/RightTags/index'
/* *********** 引入redux及redux方法 start ************* */
import {connect} from 'react-redux'
import store from '../../../store'
import {saveCurrentData, resetRightCurrentData} from '../../../store/rightData/action'
import {curdCurrentData, resetCurrentData} from '../../../store/curdData/action'
import {changeLocaleProvider} from '../../../store/localeProvider/action'
/* *********** 引入redux及redux方法 end ************* */
const locales = {
  "en-US": require('../../../api/language/en-US.json'),
  "zh-CN": require('../../../api/language/zh-CN.json')
}

class TableComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initDone: false,
      activeIndex: "",
      rightData: [],
      rightTags: [
        {icon: 'iconjibenxinxi', title: '基本信息', fielUrl: 'Sys/Wfvariable/BasicInfo'},
      ],
      data: [{
        key: "[0]",
        id: "1221",
        title: "合同管理",

        xpath: "",
        tableName: "",
        tableTitle: "",
        fieldName: "",
        fieldTitle: "",
        fieldType: "",
        children: [
          {
            key: "[0].chilren[0]",
            id: "12132",
            title: "是否超出支付限制",
            xpath: "/overvalue",
            tableName: "",
            tableTitle: "",
            fieldName: "",
            fieldTitle: "",
            fieldType: "数字",
          }
        ]
      }]
    }
    /* *********** 添加监听redux中store变化 start ************* */
    store.subscribe(() => {
      let storeState = store.getState();
      if (localStorage.getItem('name') == storeState.curdData.title) {
        if (storeState.curdData.status != '') {
          this.curdData(storeState.curdData.status, storeState.curdData.data)
        }
      }
    })
    /* *********** 添加监听redux中store变化 end ************* */
  }

  /**
   * curd data数据
   * @param {*} status curd
   * @param {*} data curd
   */
  curdData = (status, data) => {
    // 新增
    if (status == 'add') {
      alert(JSON.stringify(data))
    }

    // 修改
    if (status == 'update') {
      alert(JSON.stringify(data))
    }

    // 删除
    if (status == 'delete') {
      alert(JSON.stringify(data))
    }
    this.props.resetCurrentData()
    //let tempData
    // this.setState({
    //     width: this.props.width,
    //     data: tempData
    // })
  }

  componentDidMount() {
    // this.loadLocales();
  }

  getInfo = (record, index) => {
    let id = record.id, records = record
    /* *********** 点击表格row执行更新state start ************* */
    if (this.state.activeIndex == id) {
      id = ''
      records = ''
      this.props.resetRightCurrentData()
    } else {
      // this.props.saveCurrentData({
      //   title: localStorage.getItem('name'),
      //   rightTag: this.state.rightTag,
      //   data: record
      // })
    }
    /* *********** 点击表格row执行更新state end ************* */
    this.setState({
      activeIndex: id,
      rightData: record,
    })
  }

  setClassName = (record, index) => {
    //判断索引相等时添加行的高亮样式
    return record.id === this.state.activeIndex ? `${style['clickRowStyl']}` : "";
  }

  loadLocales() {
    intl.init({
      currentLocale: this.props.currentLocale.currentLocale,
      locales,
    })
      .then(() => {
        // After loading CLDR locale data, start to render
        this.setState({initDone: true});
      });
  }

  render() {
    const {intl}=this.props.currentLocale
    const columns = [
      {
        title: intl.get('wsd.i18n.sys.wfbizvar.title'),
        dataIndex: 'title',
        key: 'title',
      },
      {
        title: intl.get('wsd.i18n.sys.wfbizvar.xpath'),
        dataIndex: 'xpath',
        key: 'xpath',
      },
      {
        title: intl.get('wsd.i18n.sys.wfbizvar.tablename'),
        dataIndex: 'tableName',
        key: 'tableName',
      },
      {
        title: intl.get('wsd.i18n.sys.wfbizvar.tabletitle'),
        dataIndex: 'tableTitle',
        key: 'tableTitle',
      },
      {
        title: intl.get('wsd.i18n.sys.wfbizvar.fieldname'),
        dataIndex: 'fieldName',
        key: 'fieldName',
      },
      {
        title: intl.get('wsd.i18n.sys.wfbizvar.fieldtitle'),
        dataIndex: 'fieldTitle',
        key: 'fieldTitle',
      },
      {
        title: intl.get('wsd.i18n.sys.wfbizvar.fieldtype'),
        dataIndex: 'fieldType',
        key: 'fieldType',
      },
    ];
    return (
      <div>
      <TopTags/>
      <div className={style.main}>
        <div className={style.leftMain}>
          {
          <Table columns={columns} dataSource={this.state.data} pagination={false}

          rowClassName={this.setClassName}
          rowKey={record => record.id}
          onRow={(record, index) => {
            return {
              onClick: (event) => {
                this.getInfo(record, index)
              }
            }
          }
          }/>
          }
        </div>
        <div className={style.rightBox} style={{height: this.props.height}}>
          <RightTags rightTagList={this.state.rightTags} rightData={this.state.rightData} menuCode = {this.props.menuInfo.menuCode} />
        </div>
      </div>
    </div>
    )
  }
}

/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
  currentLocale: state.localeProviderData
}), {
  saveCurrentData,
  curdCurrentData,
  resetRightCurrentData,
  resetCurrentData,
  changeLocaleProvider
})(TableComponent);
/* *********** connect链接state及方法 end ************* */
