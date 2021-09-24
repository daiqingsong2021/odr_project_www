import React, { Component } from 'react';
import style from './style.less';

import { Icon, Menu, Layout, DatePicker, Button, Input, Table, Select } from 'antd';
import { connect } from 'react-redux'
import AccessTable from './Components/AccessTable';
import SysAgreement from './Components/SysAgreement';
import Log from "./Components/Log"
import PasswardInfos from './Components/PasswardInfo';


//接口引入
import axios from '../../../api/axios';
import { tmmAuditlist, tmmDelete, tmmList } from '../../../api/api';
/* *********** 引入redux及redux方法 start ************* */

/* *********** 引入redux及redux方法 end ************* */

const { Content, Sider } = Layout;
const { MonthPicker, RangePicker } = DatePicker;
const Search = Input.Search;
const Option = Select.Option;
export class Threeme extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initDone: false,
      //是否同意
      isagree: true,
      visible: false,
      visible1: false,
      currentPageNum: 1,
      pageSize: 10,
      confirmLoading: false,
      //菜单选位置
      currentIndex: 3,
      operatetime: '',
      //被删除的id
      params: [],
    };
   
  }

  

  componentDidMount() {
    
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if(userInfo.isOpen==1){
      this.setState({
        isagree:true
      })
    }
    
   
  }

  

  
 
  //数据搜索事件
  datSearch = e => {
    const body = {
      srartTime: '',
      endTime: '',
      searcher: '',
      thisTime: '',
    };
    axios
      .post(tmmAuditlist, {}, true)
      .then(res => {
      })
      // .then(res=> this.data)
      .catch(err => {
      });
  };
  ishasagree() {
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if(!this.state.isagree){
      userInfo.isOpen=1
    }else{
      userInfo.isOpen=0
    }
    sessionStorage.setItem('userInfo',JSON.stringify(userInfo))
      this.setState((prevState, props) => ({
        isagree: !prevState.isagree,
      }));
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  showModal1 = () => {
    this.setState({
      visible1: true,
    });
  };
  
  handleOk1 = () => {
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible1: false,
        confirmLoading: false,
      });
    }, 2000);
  };
  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  handleCancel1 = e => {
    this.setState({
      visible1: false,
    });
  };
  //删除ip
  deleteSuccess = row => {
    let params = [];
    row.forEach(item => {
      params.push(item.id);
    });
    this.setState({
      params: params,
    });
  };
  delete = () => {
    if (!this.state.params.length) {
      return;
    }
    
    axios
      .deleted(tmmDelete, this.state.params, true)
      .then(res => {
      })
      .catch(res => {
      });
  };

  onchangeCurrentIndex(index) {
    this.setState({
      currentIndex: index,
    });
  }

  render() {
    const { intl } = this.props.currentLocale
  

    const formItemLayout3 = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 },
    };
    const buttonItemLayout = {
      wrapperCol: { span: 14, offset: 2 },
    };
    let height = this.props.height + 40;
    return (
      <div className={style.main} style={{ height }}>
        {!this.state.isagree && (
          //协议模块
          <SysAgreement isagree={this.state.isagree} ishasagree={this.ishasagree.bind(this)} />
        )}

        {this.state.isagree && (
          <Layout className={style.setroleMain} style={{ height: '100%' }}>
            <Sider width={200} style={{ background: '#fff', height: '100%' }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={['3']}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%' }}
              >
                {/* <Menu.Item key="1" onClick={this.onchangeCurrentIndex.bind(this, 1)}>
                  {intl.get("wsd.i18n.sys.three.staustusmanange")}
                </Menu.Item>
                <Menu.Item key="2" onClick={this.onchangeCurrentIndex.bind(this, 2)}>
                 {intl.get("wsd.i18n.sys.three.oprate")}
                </Menu.Item> */}
                <Menu.Item key="3" onClick={this.onchangeCurrentIndex.bind(this, 3)}>
                  {intl.get("wsd.i18n.sys.three.accessSet")}
                </Menu.Item>
                <Menu.Item key="4" onClick={this.onchangeCurrentIndex.bind(this, 4)}>
                 {intl.get("wsd.i18n.sys.three.password")}
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout>
              <Content
                style={{
                  background: '#fff',
                  padding: '0 24px',
                  margin: 0,
                  minHeight: 280,
                }}
              >
                {/* 状态管理 */}
                {this.state.currentIndex == 1 && (
                  <div className={style.setroleState}>
                    {this.state.isagree && (
                      //协议模块
                      <SysAgreement
                        isagree={this.state.isagree}
                        ishasagree={this.ishasagree.bind(this)}
                      />
                    )}
                  </div>
                )}
                {/* 操作审计 */}
                {this.state.currentIndex == 2 && (
                  <div className={style.setroleAudit}>
                   
                  <Log></Log>
                  </div>
                )}
                {/* 访问设置 */}
                {this.state.currentIndex == 3 && (
                  <div className={style.setroleAccess}>
                   
                    {/* {访问表单} */}
                    <AccessTable deleteFn={this.deleteSuccess.bind(this)} />
                  
                  </div>
                )}
                {/* 密码设置 */
                this.state.currentIndex == 4 && (
                  <div className={style.setrolePassword}>
                    {/* {passward表单} */}
                    <PasswardInfos />
                  </div>
                )}
              </Content>
            </Layout>
          </Layout>
        )}
      </div>
    );
  }
}


/* *********** connect链接state及方法 end ************* */
const mapStateToProps = state => {
  return {
      currentLocale: state.localeProviderData,
  }
};


export default connect(mapStateToProps, null)(Threeme);