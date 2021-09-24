import React, { Component } from 'react';
import { Layout, Menu, Icon, Button, Badge } from 'antd';
import style from './style.less';
import MyIcon from '../../components/public/TopTags/MyIcon';
import { connect } from 'react-redux';
import { messageNum } from '../../api/api';
import axios from '../../api/axios';
import { bindActionCreators } from 'redux';
import * as UnReadMessageAction from '../../store/message/unReadMessage/action';
import Write from './Write';
import Inbox from './Inbox';
import ViewMessage from './ViewMessage';
import Outbox from './Outbox';
import Drafts from './Drafts';
import ImportantMessage from './ImportantMessage';
import HaveDeleted from './HaveDeleted';
import Reply from './Reply';
import Transmit from './Transmit';
import DraftsWrite from './DraftsWrite';

const { Header, Footer, Sider, Content } = Layout;

export class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: 'inbox',
      record: null,
      unreadNum: 0,
      deletedNum: 0,
    };
  }

  componentDidMount() {
    let openMessage = JSON.parse(localStorage.getItem("openMessage"))
    if (openMessage) {
      this.setState({
        isShow: "viewMessage",
        record: openMessage,
        type: "inbox"
      })
      localStorage.removeItem('openMessage')
    }
    axios.get(messageNum).then(res => {

      this.setState({
        unreadNum: res.data.data.unreadNum,
        deletedNum: res.data.data.deletedNum,
      });
    });
  }
  componentWillMount(){
    //修改redux的未读数实时刷新数量
    axios.get(messageNum).then(res => {

      this.setState({
        unreadNum: res.data.data.unreadNum,
        deletedNum: res.data.data.deletedNum,
      });
    });
  }
  contentShow = (val) => {
    this.setState({
      isShow: val,
    });
  };

  alterShow = (module, type, data) => {
    this.setState({
      isShow: module,
      type: type,
      record: data,
    });
  };
  //更改未读消息数量
  changeUnreadNum = () => {
    //修改header的未读数据
    this.props.actions.getMyUnReadMessage()
    const { unreadNum } = this.state
    this.setState({
      unreadNum: unreadNum - 1
    })
  }
  //删除时更改删除数量
  addDeletedNum = () => {
    const { deletedNum } = this.state
    this.setState({
      deletedNum: deletedNum + 1
    })
  }
  //删除时更改删除数量
  addDeletedNums = (num) => {
    const { deletedNum } = this.state
    this.setState({
      deletedNum: deletedNum + num
    })
  }

  //还原信息更改删除数量
  minusDeletedNum = (mun) => {
    const { deletedNum } = this.state
    this.setState({
      deletedNum: deletedNum - mun
    })
  }
  render() {
    return (
      <div className={style.main} style={{ height: this.props.height + 52 }}>
        <Layout style={{ height: '100%' }}>
          <Sider className={style.sider}>
            <div className={style.sidBtn}>
              <Button type="primary" className={style.btn}
                onClick={this.contentShow.bind(this, 'write')}> 撰写消息 </Button>
            </div>
            <div className={style.menu}>
              <h3>文件夹</h3>
              <Menu selectedKeys={[this.state.isShow]}>
                <Menu.Item onClick={this.contentShow.bind(this, 'inbox')} key={"inbox"}>
                  <Badge count={this.state.unreadNum} offset={[10, -3]} style={{ backgroundColor: 'gold' }}>
                    <MyIcon type="icon-shoujianxiang" className={style.MyIcon} />
                    收件箱
                  </Badge>
                </Menu.Item>
                <Menu.Item onClick={this.contentShow.bind(this, 'outbox')} key={"outbox"}>
                  <MyIcon type="icon-39" className={style.MyIcon} />
                  发件箱
                </Menu.Item>
                <Menu.Item onClick={this.contentShow.bind(this, 'importantMessage')} key={"importantMessage"}>
                  <MyIcon type="icon-zhongyaomubiao" className={style.MyIcon} />
                  重要消息
                </Menu.Item>
                <Menu.Item onClick={this.contentShow.bind(this, 'drafts')} key={"drafts"}>
                  <MyIcon type="icon-caogaoxiang" className={style.MyIcon} />
                  草稿箱
                </Menu.Item>
                <Menu.Item onClick={this.contentShow.bind(this, 'haveDeleted')} key={"haveDeleted"}>
                  <Badge count={this.state.deletedNum} offset={[10, -3]} style={{ backgroundColor: 'volcano' }}>
                    <MyIcon type="icon-shanchu" className={style.MyIcon} />
                    已删除
                  </Badge>
                </Menu.Item>
              </Menu>


            </div>

          </Sider>
          <Layout style={{ padding: '10px 20px 10px 0' }}>

            <Content className={style.content}>

              {
                this.state.isShow == 'write' &&
                <Write />
              }
              {
                this.state.isShow == 'inbox' &&
                <Inbox alterShow={this.alterShow} addDeletedNums={this.addDeletedNums} />
              }
              {   //查看消息
                this.state.isShow == 'viewMessage' &&
                <ViewMessage data={this.state.record} type={this.state.type} alterShow={this.alterShow}
                  changeUnreadNum={this.changeUnreadNum} addDeletedNum={this.addDeletedNum} openMenuByMenuCode={this.props.openMenuByMenuCode}  />
              }
              {
                //发件箱
                this.state.isShow == 'outbox' &&
                <Outbox alterShow={this.alterShow} addDeletedNums={this.addDeletedNums} />
              }
              {
                //草稿箱
                this.state.isShow == 'drafts' &&
                <Drafts alterShow={this.alterShow} />
              }
              {
                //重要消息
                this.state.isShow == 'importantMessage' &&
                <ImportantMessage />
              }
              {
                //已删除
                this.state.isShow == 'haveDeleted' &&
                <HaveDeleted minusDeletedNum={this.minusDeletedNum} />
              }
              {
                //回复
                this.state.isShow == 'reply' &&
                <Reply data={this.state.record} />
              }
              {
                //转发
                this.state.isShow == 'transmit' &&
                <Transmit data={this.state.record} />
              }
              {
                //草稿箱编辑
                this.state.isShow == 'draftsWrite' &&
                <DraftsWrite data={this.state.record} alterShow={this.alterShow} />
              }

            </Content>

          </Layout>
        </Layout>
      </div>

    );
  }
}


const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
    unReadmessage: state.unReadmessage,
  }
};
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({},UnReadMessageAction), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);

