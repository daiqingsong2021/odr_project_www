import React, { Component } from 'react';
import intl from 'react-intl-universal';
import { Table, notification, Modal } from 'antd';
import style from './style.less';
import dynamic from 'next/dynamic';
import AddTopBtn from '../../../../components/public/TopTags/AddTopBtn';
import DeleteTopBtn from '../../../../components/public/TopTags/DeleteTopBtn';
import I18nModal from '../I18nModal';
import axios from '../../../../api/axios'
import { i18ns, i18nDel } from '../../../../api/api'
import PublicButton from '../../../../components/public/TopTags/PublicButton';
import PageTable  from "../../../../components/PublicTable"
const confirm = Modal.confirm;
const locales = {
  'en-US': require('../../../../api/language/en-US.json'),
  'zh-CN': require('../../../../api/language/zh-CN.json'),
};

class I18n extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initDone: false,
      isShowModal: false,
      activeIndex: '',
      record: '',
      selectData: null,
      modalTitle: null,
      data: [],
      selectedRowKeys: [],
      columns: [],
      roleBtnData: [
        {
          id: 1,
          name: 'AddI18nTopBtn',
          aliasName: '新增国际化',
        },
        {
          id: 2,
          name: 'DeleteTopBtn',
          aliasName: '删除',
        },

      ],

    };
  }
  //请求接口函数
  reqFun = () => {
    axios.get(i18ns(this.props.data.id)).then(res => {
      let i18nVos = res.data.data;
      let i18nRelationVos = i18nVos[0] ? i18nVos[0].i18nRelationVos : [];
      let columns = [
        {
          title: intl.get('wsd.i18n.sys.menu.menucode'),
          dataIndex: 'code',
          key: 'code',
        },
        {
          title: intl.get('wsd.i18n.sys.menu.shortcode'),
          dataIndex: 'shortCode',
          key: 'shortCode',
        }
      ];
      if (i18nVos) {
        for (let j = 0, i18len = i18nVos.length; j < i18len; j++) {
          let i18nitem = i18nVos[j];
          let i18nRelationVos = i18nitem.i18nRelationVos;
          if (i18nRelationVos) {
            for (let i = 0, len = i18nRelationVos.length; i < len; i++) {
              let item = i18nRelationVos[i];
              let col = item.i18nCodeVo.id;
              i18nitem[col] = item.i18nValue;
            }
          }
        }

        for (let i = 0, len = i18nRelationVos.length; i < len; i++) {
          let item = i18nRelationVos[i];
          columns.push({
            title: item.i18nCodeVo.name,
            dataIndex: item.i18nCodeVo.id,
            key: item.i18nCodeVo.id
          });
        }
      }
      this.setState({
        data: i18nVos,
        columns: columns,
      })
    })
  }
 /**
   * 获取表单字段列表
   */
  getFormData = (callBack) => {
    if (this.state.rightRecord) {
      axios.get(getCustomFormList(this.state.rightRecord.value)).then(res => {
        callBack(res.data.data)
      })
    } else {
      callBack([])
    }
  }
  componentDidMount() {
    this.reqFun();
    this.loadLocales();
  }

  loadLocales() {
    intl.init({
      currentLocale: 'zh-CN',
      locales,
    })
      .then(() => {
        // After loading CLDR locale data, start to render
        this.setState({ initDone: true });
      });
  }

  onClickHandle = (name, value) => {
    if (name == 'AddI18nTopBtn') {
      this.setState({
        isShowModal: true,
        modalTitle: '新增国际化',
        modalType:"add"
      });
      return
    }
    if(name=="ModifyTopBtn"){
      this.setState({
        isShowModal: true,
        modalTitle: '修改国际化',
        modalType:"modify"
      });
      return
    }
    if (name == 'DeleteTopBtn') {

      let { selectedRowKeys, data } = this.state;
      if (selectedRowKeys.length) {

        // var id = this.state.record.id
        axios.deleted(i18nDel, { data: selectedRowKeys }, true).then(res => {
          //删除
          selectedRowKeys.map(item => {
            let index = data.findIndex(v => v.id == item)

            data.splice(index, 1)
          })

          this.setState({
            data,
            selectedRowKeys: []
          })

        })
      } else {
        notification.warning(
          {
            placement: 'bottomRight',
            bottom: 50,
            duration: 2,
            message: '未选中数据',
            description: '请选择数据进行操作'
          }
        )
      }

    }
  };
  getInfo = (record, index) => {
    let id = record.id;
    if (this.state.activeIndex == id) {
      this.setState({
        activeIndex: null,
        selectData: null,
      });
    } else {
      this.setState({
        activeIndex: id,
        selectData: record,
        record: record
      });
    }

  };

  addData = (v) => {
    this.reqFun();
  }

  closeI18nModal = () => {

    this.setState({
      isShowModal: false
    });



  };
  setClassName = (record, index) => {
    //判断索引相等时添加行的高亮样式
    return record.id === this.state.activeIndex ? `${style['clickRowStyl']}` : '';
  };

  render() {
    let { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,
        })
      }
    };
    return (
      <div className={style.main}>
        {this.state.initDone &&
          <div className={style.mainHeight}>
            <h3 className={style.listTitle}>国际化</h3>
            <div className={style.rightTopTogs}>
              {/*新增*/}
              <PublicButton name={'新增'} title={'新增'} icon={'icon-add'}
                afterCallBack={this.onClickHandle.bind(this, 'AddI18nTopBtn')}
                res={'MENU_EDIT'}
              />
              {/*修改*/}
              <PublicButton name={'修改'} title={'修改'} icon={'icon-xiugaibianji'} afterCallBack={this.onClickHandle.bind(this, 'ModifyTopBtn')} />
              {/*删除*/}
              <PublicButton name={'删除'} title={'删除'} icon={'icon-delete'}
                afterCallBack={this.onClickHandle.bind(this, 'DeleteTopBtn')}
                res={'MENU_EDIT'}
              />
              {this.state.isShowModal &&
                <I18nModal
                  visible={this.state.isShowModal}
                  handleCancel={this.closeI18nModal.bind(this)}
                  title={this.state.modalTitle}
                  data={this.props.data}
                  modalType={this.state.modalType}
                  parentData={this.props.data}
                  addData={this.addData}
                />}
            </div>
            <div className={style.mainScorll}>
              <Table className={style.table} rowKey={record => record.id} columns={this.state.columns} dataSource={this.state.data} pagination={false}
                name={this.props.name}
                size='small'
                rowSelection={rowSelection}
                rowClassName={this.setClassName}
                onRow={(record, index) => {
                  return {
                    onClick: (event) => {
                      this.getInfo(record, index);
                    },
                    onDoubleClick: (event) => {
                      event.currentTarget.getElementsByClassName("ant-checkbox-wrapper")[0].click();
                    }
                  };
                }
                } />
                <PageTable onRef={ref => this.table = ref}
                               pagination={false}
                               getData={this.getFormData}
                               columns={columns}
                               bordered={false}
                               dataSource={this.state.data}
                               loading={this.state.loading1}
                               scroll={{x: '100%', y: this.props.height - 100}}
                               getRowData={this.getRowData}
                    />
            </div>
          </div>}
      </div>
    );
  }
}

export default I18n;
