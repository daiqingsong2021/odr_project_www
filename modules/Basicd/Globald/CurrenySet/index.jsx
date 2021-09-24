import React, { Component } from 'react'
import style from './style.less'
import TopTags from './TopTags/index'
import RightTags from '../../../../components/public/RightTags/index'
import { connect } from 'react-redux'
import { currencyList, currencySetCurrencyBase } from '../../../../api/api';
import axios from '../../../../api/axios'
import PageTable from '../../../../components/PublicTable'
import ExtLayout from "../../../../components/public/Layout/ExtLayout";
import MainContent from "../../../../components/public/Layout/MainContent";
import Toolbar from "../../../../components/public/Layout/Toolbar";
class BasicdCurreny extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: [],
      initDone: false,
      datalist: [],
      idlsit: [],
      data: [],
      rightTags: [
        { icon: 'iconjibenxinxi', title: '基本信息', fielUrl: 'Basicd/Globald/CurrenySet/registerInfo' }
      ],
      rightData: null,
      status: "",
      selectedRowKeys: [],
    }

  }

  getcurenyList = (callBack) => {
    axios.get(currencyList).then(res => {
      callBack(res.data.data)
    })
  }

  /**
   * 获取复选框 选中项、选中行数据
   * @method updateSuccess
   * @param {string} selectedRowKeys 复选框选中项
   * @param {string} selectedRows  行数据
   */
  getSelectedRowKeys = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRows,
      selectedRowKeys
    })
  }

  /**
   * 父组件即可调用子组件方法
   */
  onRef = (ref) => {
    this.table = ref
  }
  // 当表格数据选中时执行
  getRowData = (record) => {
    this.setState({
      rightData: record
    })
  }

  //删除数据
  delData = () => {
    this.table.getData();
    //是否删除选中行
    let i = this.state.selectedRowKeys.findIndex(item => item == this.state.rightData.id)
    if (i > -1) {
      this.setState({
        selectedRowKeys: [],
        activeIndex: null,
        rightData: null
      })
    } else {
      this.setState({
        selectedRowKeys: [],
      })
    }

  }

  //新增
  addData = (newData) => {
    this.table.add(null, newData);
  }
  //更改
  updateData = (newData) => {
    this.table.update(this.state.rightData, newData);
  }

  //基准货币
  radio = (record) => {
    axios.put(currencySetCurrencyBase(record.id), {}, true).then(res => {
      if (res.data.status == 200) {
        this.table.getData()
      }
    })
  }


  render() {

    const { intl } = this.props.currentLocale;

    const columns = [
      {
        title: intl.get('wsd.i18n.base.currency.currname'),
        dataIndex: 'currencyName',
        key: 'currencyName',
        width: '25%'
      },
      {
        title: intl.get('wsd.i18n.base.currency.currcode'),
        dataIndex: 'currencyCode',
        key: 'currencyCode',
        width: '25%'
      },
      {
        title: intl.get('wsd.i18n.base.currency.currsymbol'),
        dataIndex: 'currencySymbol',
        key: 'currencySymbol',
        width: '25%'
      },

      {
        title: intl.get('wsd.i18n.base.currency.currbase'),
        dataIndex: 'currencyBase',
        key: 'currencyBase',
        render: (text, record) => (
          <span className={text == 1 ? style.radioT : style.radioF} onClick={this.radio.bind(this, record)}></span>
        )
      },
    ];

    let { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
        })
      },


    };

    return (
      <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
        <Toolbar>
          <TopTags arr={this.state.selectedRowKeys} rightData={this.state.rightData} delData={this.delData}
            addData={this.addData} />
        </Toolbar>
        <MainContent contentWidth={this.state.contentWidth} contentMinWidth={1500}>
          <PageTable onRef={this.onRef}
            pagination={false}
            getData={this.getcurenyList}
            columns={columns}
            rowSelection={true}
            useCheckBox={true}
            closeContentMenu={true}
            onChangeCheckBox={this.getSelectedRowKeys}
            total={this.state.total}
            getRowData={this.getRowData} />
        </MainContent>
        <RightTags
          rightTagList={this.state.rightTags}
          rightData={this.state.rightData}
          updateData={this.updateData}
          menuCode={this.props.menuInfo.menuCode}
        />

      </ExtLayout>
    )
  }
}

/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
  currentLocale: state.localeProviderData
}))(BasicdCurreny);
/* *********** connect链接state及方法 end ************* */
