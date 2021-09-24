import React, { Component } from 'react';

import { Table } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sysMenuAction from '../../../store/sysMenu/action';
import style from './style.less';
import TreeTable from '../../../components/PublicTable'
import axios from '../../../api/axios';
import { menuTree, menuAdd, menuSearch } from '../../../api/api';
import TopTags from './TopTags/index';
import RightTags from '../../../components/public/RightTags/index';

import ExtLayout from "../../../components/public/Layout/ExtLayout";
import MainContent from "../../../components/public/Layout/MainContent";
import Toolbar from "../../../components/public/Layout/Toolbar";
import MyIcon from '../../../components/public/TopTags/MyIcon'

class TableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      record: null,
      authedit: true,
      searcher: ""
    };
  }

  //注册 父组件即可调用子组件方法
  onRef = (ref) => {
    this.table = ref
  }
  //table组件回调的点击 行数据
  getRowData = (record) => {
    this.setState({
      record: record,
      authedit: record.menuType && record.menuType.id == 3 ? false : true
    });
  };

  //获取菜单list
  getList = (callBack) => {
    axios.get(menuSearch + `?searcher=${this.state.searcher}`, {}).then(res => {
      if (res.data.data) {
        callBack(res.data.data)
        this.setState({ searcher: "" })
      }
    });
  };

  //新增回调
  addSuccess = (value, type) => {
    this.table.add(this.state.record, value)
  };

  //删除回调
  delSuccess = () => {
    this.table.deleted(this.state.record)
  };

  //更新回调
  updateSuccess = (newData) => {
    this.table.update(this.state.record, newData)
  };
  //移动回调
  callBackMoveList = (moveInfo, positionID, callback) => {
    axios.get(menuTree).then(res => {
      callback(true)
    });
  }

  //搜索
  search = (val) => {
    if (val) {
      val = val.trim();
    } else {
      val = "";
    }
    this.setState({
      searcher: val
    }, () => {
      this.table.getData()
    })
  }
  render() {
    const { intl } = this.props.currentLocale;
    const columns = [
      {
        title: intl.get('wsd.i18n.sys.menu.menuname'),
        dataIndex: 'menuName',
        key: 'menuName',
        width: 300,
        render: (text, record) => {
          if (record.menuType.id == 1) {
            return <span title={text} ><MyIcon type="icon-zujian" style={{ fontSize: '18px', marginRight: '8px' }} />{text}</span>
          } else if (record.menuType.id == 2) {
            return <span title={text} ><MyIcon type="icon-caidan" style={{ fontSize: '18px', marginRight: '8px' }} />{text}</span>
          } else if (record.menuType.id == 3) {
            return <span title={text} ><MyIcon type="icon-yeqian" style={{ fontSize: '18px', marginRight: '8px' }} />{text}</span>
          } else {
            return <span title={text} ><MyIcon type="icon-yeqianzu" style={{ fontSize: '18px', marginRight: '8px' }} />{text}</span>
          }
        }
      },
      {
        title: intl.get('wsd.i18n.sys.menu.menucode'),
        dataIndex: 'menuCode',
        key: 'menuCode',
        width: 300,
        render: text => <span title={text} >{text}</span>
      },
      {
        title: intl.get('wsd.i18n.sys.menu.menutype'),
        dataIndex: 'menuType',
        key: 'menuType',
        width: 100,
        render: (text) => (
          <span >{text.name}</span>
        ),
      },

      {
        title: intl.get('wsd.i18n.sys.menu.active'),
        dataIndex: 'active',
        key: 'active',
        width: 100,
        render: text => text ? intl.get('wsd.i18n.sys.menu.active') : intl.get('wsd.i18n.sys.menu.unactive')
      },
      {
        title: intl.get('wsd.i18n.sys.menu.share'),
        dataIndex: 'share',
        key: 'share',
        width: 100,
        render: text => text ? intl.get('wsd.i18n.sys.menu.share') : intl.get('wsd.i18n.sys.menu.unshare')
      },
      {
        title: intl.get('wsd.i18n.sys.menu.ismenu'),
        dataIndex: 'isMenu',
        key: 'isMenu',
        width: 100,
        render: text => text ? intl.get('wsd.i18n.sys.menu.yes') : intl.get('wsd.i18n.sys.menu.no')
      },
      {
        title: '是否内置',
        dataIndex: 'built_in',
        key: 'built_in',
        width: 100,
        render: text => text ? intl.get('wsd.i18n.sys.menu.no') : intl.get('wsd.i18n.sys.menu.yes')
      },
      {
        title: intl.get('wsd.i18n.sys.menu.url'),
        dataIndex: 'url',
        key: 'url',
        width: 300,
        render: text => <span title={text} >{text}</span>
      },

    ];

    const { data, record } = this.state;
    const { height } = this.props;
    return (
      <ExtLayout renderWidth={({ contentWidth }) => { this.setState({ contentWidth }) }}>
        <Toolbar>
          <TopTags
            record={record}
            success={this.addSuccess}
            delSuccess={this.delSuccess}
            search={this.search}
            authedit={this.state.authedit}
          />
        </Toolbar>
        <MainContent contentWidth={this.state.contentWidth} contentMinWidth={1500}>
          <TreeTable onRef={this.onRef} getData={this.getList} move={this.callBackMoveList} dnd={true}
            pagination={false} columns={columns}
            scroll={{ x: 1400, y: this.props.height - 50 }}
            getRowData={this.getRowData}
            expanderLevel={1}
          />
        </MainContent>
        <RightTags
          rightData={record}
          updateSuccess={this.updateSuccess}
          menuCode={this.props.menuInfo.menuCode}
          groupCode={1}
        />

      </ExtLayout>

    );
  }
}


const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
    menuData: state.menuData,
    record: state.sysMenu.record,
  }
};
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, sysMenuAction), dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(TableComponent);

