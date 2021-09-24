import React, { Component } from 'react'
import intl from 'react-intl-universal'
import { Table, message, Button, notification } from 'antd'
import PublicButton from '../../../../../components/public/TopTags/PublicButton'
import AddTopBtn from "../../../../../components/public/TopTags/AddTopBtn"
import DeleteTopBtn from "../../../../../components/public/TopTags/DeleteTopBtn"
import EditTypeModal from "./EditTypeModal"
import style from "./style.less"

import { connect } from 'react-redux'
import axios from '../../../../../api/axios'
import { deleteDigitDirBo,geteListByBoCod } from '../../../../../api/api'

import PageTable from '../../../../../components/PublicTable'
/**
 * 数据字典 模块
 *
 */
class TableComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            visible: false,
            title: '',
            activeIndex: '',
            data: this.props.data,
            columns: [],
            rightTag: [{
                id: 0,
                list: [
                    { icon: 'right-square', title: '基本信息', fielUrl: 'Basicd/Globald/DigitDir/DigitInfo' },
                    { icon: 'right-square', title: '字典码值', fielUrl: 'Basicd/Globald/DigitDir/DigitType' }
                ]
            }],
            selectedRowKeys: [],
            record: null,
        }

    }
  componentDidMount() {
    this.props.onRef(this);
  }
    onClickHandle = (name) => {

        if (name == "AddTopBtn") {
            this.setState(
                { title: '新增字典类型', visible: true })
        }
        if (name == 'DeleteTopBtn') {
            this.onHandleDelete(this.state.selectedRowKeys)
        }
    }

  //获取数据字典数据
  getListData = ( callBack) => {
    callBack(this.props.data)
  };

  refresh=()=>{
    this.table.getData()
  }
    //删除数据字典
    onHandleDelete = (data) => {
        if (data.length) {
            axios.deleted(deleteDigitDirBo, { data }).then(res => {
                this.props.getListrightdata();
                let index = this.state.record ? data.findIndex(item => item == this.state.record.id) : -1;
                if (index == -1) {
                    this.setState({
                        selectedRowKeys: [],
                    })
                } else {
                    this.props.getTableInfo(null);
                    this.setState({
                        selectedRowKeys: [],
                        record: null
                    })
                }
            })
        } else {
            notification.warning(
                {
                    placement: 'bottomRight',
                    bottom: 50,
                    duration: 2,
                    message: '警告',
                    description: '请勾选数据进行操作'
                }
            )
        }
    }


    handleCancel = (e) => {
        this.setState({ visible: false })
    }


  /**
   * 父组件即可调用子组件方法
   */
  onRef = (ref) => {
    this.table = ref
  }

  /**
   * 获取选中集合、复选框
   * @method getListData
   * @param {string} record  行数据
   */
  getRowData = (record) => {
        let id = record.id, records = record,builtIn = record.builtIn;
        let editAuth = builtIn == 0 ? false : true;
        this.props.editUpdate(editAuth);

        this.setState({
            activeIndex: id,
            record
        })
        this.props.getTableInfo(record);
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


    onSelect = (value) => {
        this.setState({
            value,
            selectedValue: value,
        });
    }
    onChange = date => this.setState({ date })
    //处理新增
    handleAddClick = (data) => {
        this.props.getadddata(data)
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
        let { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                    selectedRowKeys,
                })
            },
          getCheckboxProps: record => ({
            disabled: record.builtIn == 1
          })
        };

        const columns = [
            {
                title: intl.get('wsd.i18n.base.digitdir.digitname'),
                dataIndex: 'typeName',
                key: 'typeName',
                width:'50%'
            },
            {
                title: intl.get('wsd.i18n.base.digitdir.digitcode'),
                dataIndex: 'typeCode',
                key: 'typeCode',
            }
        ];

        return (
            <div className={style.main} style={{height:this.props.height}}>
                <div className={style.topButton}>
                    {/* <AddTopBtn onClickHandle={this.onClickHandle} /> */}
                    <PublicButton
                        title={'新增'} icon={'icon-add'}
                        afterCallBack={this.onClickHandle.bind(this, 'AddTopBtn')}
                        res={'MENU_EDIT'}
                    />
                    {/* <DeleteTopBtn onClickHandle={this.onClickHandle} /> */}
                    <PublicButton
                        title={'删除'} icon={'icon-shanchu'}
                        useModel={true} edit={true}
                        verifyCallBack={this.hasRecord}
                        afterCallBack={this.onClickHandle.bind(this, 'DeleteTopBtn')}
                        content={'你确定要删除吗？'}
                        res={'MENU_EDIT'}
                    />
                </div>
                <div className={style.center}>

                  <PageTable onRef={this.onRef}
                             pagination={false}
                             getData={this.getListData}
                             columns={columns}
                             rowSelection={true}
                             onChangeCheckBox={this.getSelectedRowKeys}
                             useCheckBox={true}
                             total={this.state.total}
                             scroll={{x:'100%',y:this.props.height-100}}
                             getRowData={this.getRowData}/>

                </div>
                <EditTypeModal
                    title={this.state.title}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    boCode={this.props.boCode}
                    handleClick={this.handleAddClick}
                />
            </div>
        )
    }
}

/*export default TableComponent*/

/* *********** connect链接state及方法 start ************* */
export default connect(state => ({
    currentLocale: state.localeProviderData
}))(TableComponent);
/* *********** connect链接state及方法 end ************* */
