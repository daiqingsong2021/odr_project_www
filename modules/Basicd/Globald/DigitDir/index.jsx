import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, notification } from 'antd';
import style from './style.less';
import PublicButton from '../../../../components/public/TopTags/PublicButton';
import axios from '../../../../api/axios';
import RightTags from '../../../../components/public/RightTags/index'
import { queryDataList, queryList } from '../../../../store/digitDir/reducer';
import EditTypeModal from "./EditTypeModal"
import PageTable from '../../../../components/PublicTable'
//api
import { getDigitDirBoList, geteListByBoCod, addDigitDirBo, deleteDigitDirBo } from '../../../../api/api'
import ExtLayout from "../../../../components/public/Layout/ExtLayout";
import LeftContent from "../../../../components/public/Layout/LeftContent";
import MainContent from "../../../../components/public/Layout/MainContent";
import Labels from "../../../../components/public/Layout/Labels";
import Toolbar from "../../../../components/public/Layout/Toolbar";
import TopTags from "../../../../components/public/Layout/TopTags";
/**
 * 数据字典 模块
 *
 */
export class BasicdGlobaldCalendarSet extends Component {
  constructor(props) {
    super(props);
    this.state = {

      initDone: false,

      data: [],
      rightData: null,
      editAuth: false,
      selectedRowKeys: [],
      selectedRows: [],
    };
  }

  
/**
   * 父组件即可调用子组件方法
   */
  onRef = (ref) => {
    this.table = ref
  }
  //获取业务对象列表
  getList = (callBack) => {
    axios.get(getDigitDirBoList).then(res => {
      if (res.data.data && res.data.data.length > 0) {
        callBack(res.data.data)
        this.setState({

          boCode: res.data.data[0].boCode,
        }, () => {
          this.rightTable.getData()
          this.table.getLineInfo(res.data.data[0])
        });
      } else {
        callBack([])
      }
    });
  };

  // 获取数据字典列表
  getListrightdata = (callBack) => {
    if (this.state.boCode) {
      axios.get(geteListByBoCod(this.state.boCode)).then(res => {
        callBack(res.data.data || [])
      });
    } else {
      callBack([])
    }
  }

  //点击业务对象获取数据字典
  getInfo = (record) => {
    
    if (this.state.boCode === record.boCode) {
      return
    }
    this.setState({
      rightData: null,
      boCode: record.boCode
    }, () => {
      this.rightTable.getData()
    });
  };

  //点击业务对象右侧数据
  getTableInfo = (data) => {
    this.setState({
      rightData: data
    })
  }

  //新增数据字典
  getrightAddData = (adddata) => {
    this.getListrightdata()
  }



  //修改基本信息
  submitData = (data) => {
    const { rightData } = this.state
    this.rightTable.update(rightData, data)
    this.setState({
      rightData: data
    })

  }



  onClickHandle = (name) => {

    if (name == "AddTopBtn") {
      this.setState(
        { title: '新增字典类型', visible: true })
    }
    if (name == 'DeleteTopBtn') {
      axios.deleted(deleteDigitDirBo, { data: this.state.selectedRowKeys }, true, null, true).then(res => {
        this.setState({
          selectedRows: [],
          selectedRowKeys: [],
          rightData: null
        }, () => {
          this.rightTable.getData()
        })

      })
    }
  }

  /**
   * 获取选中集合、复选框
   * @method getListData
   * @param {string} record  行数据
   */
  getRowData = (record) => {
    let builtIn = record.builtIn || 0;
    let editAuth = builtIn == 0 ? false : true;
    this.setState({
      rightData: record,
      editAuth
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

  //处理新增
  handleAddClick = (data) => {
    this.rightTable.add(null, data)
  }

  //判断是否有选中数据
  hasRecord = () => {
    if (!this.state.selectedRowKeys.length) {
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

    const { intl } = this.props.currentLocale;
    const columns = [
      {
        title: "业务对象",
        dataIndex: 'boName',
        key: 'boName',
      },
    ];



    const rightColumns = [
      {
        title: intl.get('wsd.i18n.base.digitdir.digitname'),
        dataIndex: 'typeName',
        key: 'typeName',
        width: '50%'
      },
      {
        title: intl.get('wsd.i18n.base.digitdir.digitcode'),
        dataIndex: 'typeCode',
        key: 'typeCode',
      }
    ];

    return (
      <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
        <LeftContent width={200}>

          <PageTable onRef={this.onRef}
            pagination={false}
            getData={this.getList}
            closeContentMenu={true}
            columns={columns}
            getRowData={this.getInfo}
          />
        </LeftContent>
        <MainContent contentWidth={this.state.contentWidth} contentMinWidth={600}>
          <PageTable onRef={ref => this.rightTable = ref}
            pagination={false}
            getData={this.getListrightdata}
            columns={rightColumns}
            rowSelection={true}
            closeContentMenu={true}
            onChangeCheckBox={this.getSelectedRowKeys}
            useCheckBox={true}
            total={this.state.total}
            getRowData={this.getRowData}
            checkboxStatus={record => record.builtIn == 1}
          />

        </MainContent>

        <Toolbar>
          <TopTags>
            <PublicButton
              title={'新增'} icon={'icon-add'}
              afterCallBack={this.onClickHandle.bind(this, 'AddTopBtn')}
              res={'MENU_EDIT'}
            />

            <PublicButton
              title={'删除'} icon={'icon-shanchu'}
              useModel={true} edit={true}
              verifyCallBack={this.hasRecord}
              afterCallBack={this.onClickHandle.bind(this, 'DeleteTopBtn')}
              content={'你确定要删除吗？'}
              res={'MENU_EDIT'}
            />
          </TopTags>
        </Toolbar>

        <RightTags rightData={this.state.rightData}
          submitData={this.submitData}
          menuCode={this.props.menuInfo.menuCode}
          editAuth={this.state.editAuth}
        />

        {
          this.state.visible && <EditTypeModal
            title={this.state.title}
            onCancel={() => this.setState({ visible: false })}
            boCode={this.state.boCode}
            handleClick={this.handleAddClick}
          />
        }

      </ExtLayout>

    );
  }
}

export default connect(
  state => ({ currentLocale: state.localeProviderData }),
  { queryDataList, queryList })
  (BasicdGlobaldCalendarSet);
