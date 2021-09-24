import React from 'react'
import style from './style.less'
import Header from '../../components/public/HeaderEps/index'   //头部组件，包含菜单
import LeftMenu from '../../components/public/LeftMenu/index'   //头部组件，包含菜单
import HomeBox from '../../modules/Index/index'
import {Tabs, notification, Breadcrumb, Layout} from 'antd';
import router from 'next/router'
import dynamic from 'next/dynamic'
import MyIcon from "../../components/public/TopTags/MyIcon"

import {connect} from 'react-redux';
import RightClickTpl from '../../components/RightClickMenu'
import {bindActionCreators} from 'redux';

import * as localAction from '../../store/localeProvider/action';
import * as changeMenuTheme from '@/store/menuTheme/action';
import axios from "../../api/axios";
import {getProcessInstByProcInstId, menuGetByMenuCode, deleteFavorites, addFavorites,} from "../../api/api";

var CryptoJS = require("crypto-js");
var CRYPTOJSKEY = CryptoJS.enc.Utf8.parse("wisdom!QAZ!@#123");
import * as widowSizeAction from '../../store/windowSize/action';
const TabPane = Tabs.TabPane;
const { Content } = Layout;
class Home extends React.Component {
  constructor(props) {
    super(props);
    const panes = [                                   //tab集合，默认加载首页，不可关闭页签
      {
        title: '首页',
        content: <HomeBox fileUrl='Index' openMenuByMenuCode={this.openMenuByMenuCode} openWorkFlowMenu={this.openWorkFlowMenu} callBackBanner={this.callBackBanner}
                          rightClickMenu={this.rightClickMenu}/>,
        key: '1',
        closable: false,
        parentId: 0,
        titleName: <span style={{width: '92%', height: '100%', display: 'inline-block'}} onContextMenu={this.clickMenu.bind(this, {id: 1})}>{'首页'}</span>,
        x: '0',
        y: '0',
        rightClickShow: false,
        times: '1',
        menuCode:'HOME',
      },
    ];
    this.state = {
      menuInfo:{},
      showHeader : false,
      panes: panes,                                               //tab集合
      activeKey: panes[0].key,                                    //tab当前显示位置`
      activityId: '',
      rightClickData: [],
      menutype: 2,
      isFav:false,
      favList:[],
      selectMenu: null,
      menumode:'vertical',
      collapsed:false
    }
  }

  encrypt = (word) => {
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, CRYPTOJSKEY, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  decrypt = (word) => {
    var decrypt = CryptoJS.AES.decrypt(word, CRYPTOJSKEY, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  }
  componentDidMount() {
    if(localStorage.getItem('workflow')){
        const workflow = JSON.parse(localStorage.getItem('workflow'));
        // localStorage.removeItem('workflow');
        this.openWorkFlowMenu(workflow);
    }
    if(localStorage.getItem('menutype')){
      this.setState({
        menutype:Number(localStorage.getItem('menutype'))
      })
    }
    if(localStorage.getItem('menumode')){
      this.setState({
        menumode:localStorage.getItem('menumode')
      })
    }
    localStorage.setItem('openedProject', "");
    localStorage.setItem('name', '首页');
    //中英文设置
    let language = localStorage.getItem("acmlanguage")
    if (language) {
      this.props.actions.initLocaleProvider(language)
    }
    document.addEventListener('click', this.closeRight)
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if (!userInfo) {
      router.push('/login')
      return
    }
    let menuInfo = this.getMenuInfo();
    this.setState({
      menuInfo,
      showHeader : true
    })
    window.addEventListener('resize',this.windowResize);


    // var script = document.createElement('script');
    //     script.type = 'text/javascript';
    //     script.async = true;
    //     // script.src = 'http://www.jsumt.com:4998/jira/s/d5bfdce757f29e2647204cdcca666d6c-T/-6w0ke8/710001/6411e0087192541a09d88223fb51a6a0/2.0.27/_/download/batch/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs/com.atlassian.jira.collector.plugin.jira-issue-collector-plugin:issuecollector-embededjs.js?locale=zh-CN&collectorId=6afb5215';
    //     script.src ='static/feedback/feedback.js';
    //     document.body.appendChild(script); 

    var script1 = document.createElement('script');
        script1.type = 'text/javascript';
        script1.async = true;
        script1.src ='/static/pdfjs/pdf.js';
        document.body.appendChild(script1); 

    // var script2 = document.createElement('script');
    //     script2.type = 'text/javascript';
    //     script2.async = true;
    //     script2.src ='/static/plusgantt/scripts/miniui/miniui.js';
    //     document.body.appendChild(script2); 
  }

  windowResize = () =>{
    let h = document.documentElement.clientHeight || document.body.clientHeight - 55;   //浏览器高度，用于设置组件高度
    let w = document.documentElement.offsetWidth || document.body.offsetWidth;
    this.props.actions.setSize({width : w , height : h});
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closeRight, false);
  }

  closeRight = () => {

    this.setState({
      rightClickShow: false
    })
  }

  /**
   * 根据模块获取模块信息
   *
   * @param menuCode
   * @returns {*}
   */
  getMenuInfoByMenuCode = (menuCode) => {
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    let retItem = null;
    userInfo.loginMenu.left.forEach(item => {
      if (item.children) {
        item.children.forEach(v => {
          if(v.children){
              v.children.forEach(c =>{
                if (c.menuCode == menuCode) {
                  retItem = c;
                }
              })
          }
        })
      }
    })
    return retItem;
  }

  /**
   * 打开工作项
   *
   */
  openWorkFlowMenu = (proc = {}) => {
    // 流程处理界面
    // localStorage.removeItem('workflow');
    let menuInfo = {menuCode:'FLOW',menuName: '流程处理', url: "Components/Workflow/Form", id: -1000, parentId: 0, proc_: proc};
    let {procInstId} = proc;
    this.getBizTypeByProcInstId(procInstId, (data) => {
      this.callBackBanner(menuInfo, true, {proc: {...proc, ...data}});
    });
  }

  /**
   *
   */
  getBizTypeByProcInstId = (procInstId, callback) => {
    axios.get(getProcessInstByProcInstId(procInstId)).then(res => {
      this.getMenuInfoByMenuInfo(res.data.data, callback);
    })
  }

  getMenuInfoByMenuInfo = (info, callback) => {
    const {moduleCode} = info;
    axios.get(menuGetByMenuCode(moduleCode)).then(res => {
      let newdata = {...info, menuInfo: res.data.data};
      callback && callback(newdata);
    })
  }

  /**
   * 根据模块代码打开模块
   * @param menuCode
   * @param isRefresh
   * @param beforeCallback
   */
  openMenuByMenuCode = (menuCode, isRefresh, beforeCallback) => {
    // 获取信息
    let menuInfo = this.getMenuInfoByMenuCode(menuCode);
    if (!menuInfo) {
      notification.warning({
        placement: 'bottomRight',
        bottom: 50,
        duration: 2,
        message: '提示',
        description: '无访问权限'
      });
      return;
    }
    if (beforeCallback && typeof beforeCallback == "function") {
      beforeCallback(menuInfo);
    }
    // 打开菜单
    this.callBackBanner(menuInfo, isRefresh);
  }

  //监听导航栏操作，添加页签 name=当前菜单名称，ComponentName=模块文件位置
  /**
   *menuInfo:菜单信息
   isRefresh：是否刷新
   */
  callBackBanner = (menuInfo, isRefresh, datas = {}) => {
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if(menuInfo){
      this.setState({
        name1: menuInfo.groupName ? menuInfo.groupName : null,
        name2: menuInfo.menuName ? menuInfo.menuName : null,
  
        isFav:(userInfo && userInfo.favortCodes && userInfo.favortCodes.indexOf(menuInfo.menuCode) > -1) ? true : false
      });
      const {panes} = this.state
      //判断是否已存在，如存在，切换tab当前点击元素位置
      localStorage.setItem('name', menuInfo.menuCode)
      const ComponentNames = dynamic(() => import('../../components/public/Main/index'))
      for (var i = 0; i < panes.length; i++) {
        if (menuInfo.menuCode == panes[i].menuCode) {
          this.setState({
            activeKey: panes[i].key.toString(),
          }, () => {
            if (isRefresh) {
  
              panes[i]['content'] = <ComponentNames time={(new Date()).valueOf()} menuInfo={menuInfo} activeKey={this.state.activeKey}
                                                    callBackBanner={this.callBackBanner} openWorkFlowMenu={this.openWorkFlowMenu} rightClickMenu={this.rightClickMenu}
                                                    openMenuByMenuCode={this.openMenuByMenuCode} {...datas} />
              this.setState({
                panes
              })
            }
          })
          return;
        }
      }
      const activeKey = menuInfo.id;
      panes.push({
        title: menuInfo.menuName,
        titleName: <span style={{width: '92%', height: '100%', display: 'inline-block'}} onContextMenu={this.clickMenu.bind(this, menuInfo)}>{menuInfo.menuName}</span>,
        content: <ComponentNames menuInfo={menuInfo} activeKey={this.state.activeKey}
                                 callBackBanner={this.callBackBanner}
                                 openWorkFlowMenu={this.openWorkFlowMenu}
                                 openMenuByMenuCode={this.openMenuByMenuCode}
                                 rightClickMenu={this.rightClickMenu}
                                 {...datas}/>,
        key: activeKey.toString(),
        parentId: menuInfo.parentId,
        times: menuInfo.id,
        menuCode:menuInfo.menuCode,
      });
      this.setState({
        panes: panes,
        activeKey: activeKey.toString(),
        activityId: menuInfo.parentId
      });
    }
  }

  //打开收藏模块
  openFevModal = (data) => {
    //判断是否已存在，如存在，切换tab当前点击元素位置
    const panes = this.state.panes;
    let activeKey
    data.forEach(item => {
      for (var i = 0; i < this.state.panes.length; i++) {
        if (item.menuCode == this.state.panes[i].menuCode) {
          return;
        }
      }
      const ComponentNames = dynamic(() => import('../../components/public/Main/index'))
      activeKey = item.id;
      panes.push({
        title: item.menuName,
        titleName: <span style={{width: '92%', height: '100%', display: 'inline-block'}} onContextMenu={this.clickMenu.bind(this, item)}>{item.menuName}</span>,
        content: <ComponentNames time={item.times} callBackBanner={this.callBackBanner} rightClickMenu={this.rightClickMenu}
                                 openMenuByMenuCode={this.openMenuByMenuCode} openWorkFlowMenu={this.openWorkFlowMenu} menuInfo={item}/>,
        key: activeKey.toString(),
        menuCode:item.menuCode
      });
    })
    for (var i = 0; i < this.state.panes.length; i++) {
      if (data[data.length - 1].menuCode == this.state.panes[i].menuCode) {
        this.setState({
          panes,
          activeKey: this.state.panes[i].key.toString(),
        })
        return
      }
    }
  }
    //取消收藏菜单
    cancleFav = () => {
      // 获取信息
      let menuCode = localStorage.getItem('name');
      axios.deleted(deleteFavorites("menu", [menuCode]), {}, true).then(res => {
        var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        userInfo.favortCodes.splice(userInfo.favortCodes.indexOf(menuCode), 1);
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
        this.setState({
          isFav: false
        })
      })
    }
      //收藏菜单
  handleFav = () => {
    let menuCode = localStorage.getItem('name')
    let obj = {
      bizType: "menu",
      bizs: [menuCode]
    }
    axios.post(addFavorites, obj, true).then(res => {
      var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      if (userInfo.favortCodes) {
        userInfo.favortCodes.push(menuCode)
      } else {
        userInfo.favortCodes = []
        userInfo.favortCodes.push(menuCode)
      }
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
      this.setState({
        isFav: true
      })
    })
  }
  //操作当前tab
  onChangeTab = (activeKey) => {
    this.setState({activeKey});
    for (var i = 0; i < this.state.panes.length; i++) {
      if (activeKey == this.state.panes[i].key) {
        this.setState({
          activityId: this.state.panes[i].parentId
        })
        localStorage.setItem('name', this.state.panes[i].menuCode);
        const menuInfo = this.getMenuInfoByMenuCode(this.state.panes[i].menuCode);
        this.callBackBanner(menuInfo)
        return
      }
    }
  }

  //关闭当前tab
  onEdit = (targetKey, action) => {
    if(targetKey=='1189214'){   //关闭问题菜单清除首页视图跳转缓存
      localStorage.removeItem('leaderQues')
    }else if(targetKey=='110057'){   //关闭质量报验菜单清除首页视图跳转缓存
      localStorage.removeItem('getQuaInspectStatistics')
    }else if(targetKey=='296221'){   //关闭日派工单菜单清除首页视图跳转缓存
      localStorage.removeItem('pgdQus')
    }else if(targetKey=='386144'){   //关闭施工考评菜单清除首页视图跳转缓存
      localStorage.removeItem('constructQus')
    }
    let activeKey = this.state.activeKey;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
        this.setState({
          activityId: this.state.panes[lastIndex].parentId
        })
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key;
      this.setState({
        activityId: this.state.panes[lastIndex].parentId
      })
      localStorage.setItem('name', panes[lastIndex].menuCode)
    }
    this.setState({panes, activeKey});
    const menuInfo = this.getMenuInfoByMenuCode(localStorage.getItem('name'));
    this.callBackBanner(menuInfo)
  }

  clickMenu = (menuInfo, e) => {
    e.preventDefault();
    this.setState({
      x: event.clientX,
      y: event.clientY - 105,
      rightClickShow: true,
      rightClickData: menuInfo
    })
  }

  getMenuInfo = () =>{

    //底部标签切换，联动菜单。根据传入的菜单ID标记菜单位置
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    let menuData = userInfo.loginMenu.left;
    /*
    let count = 0;
    for(let i = 0, len = menuData.length; i < len; i++){
      let name = menuData[i].menuName;
      if(name.length){
        count += name.length * 14 + 40;
      }
    }
    */
    let {isThreeMenu} = userInfo;
    const widowsWidth = document.documentElement.clientWidth || document.body.clientWidth;

    return {isThreeMenu,menuData, menuWidth :(widowsWidth - 750)+ "px"};
  }
  //右击菜单选项
  rightClickMenu = (menu) => {
    var panes = this.state.panes;
    var num = 0;
    //关闭其他
    if (menu == "deleteOther") {
      var data = []
      for (var i = 0; i < panes.length; i++) {
        if (panes[i].key == 1 || panes[i].key == this.state.rightClickData.id) {
          num++
          data.push(panes[i])
        }
      }
      this.setState({
        panes: data,
        activeKey: data[num - 1].key
      });
    }
    //关闭当前  //首页无法关闭
    if (menu == "deleteCurrent") {
      var key = this.state.activeKey;
      for (var i = 0; i < panes.length; i++) {
        if (panes[i].key != 1 && panes[i].key == this.state.rightClickData.id) {
          //判断是否是当前打开的tab 关闭，是需要处理 tab activeKey属性
          if (panes[i].key == key) {
            key = panes[i - 1].key
          }
          panes.splice(i, 1);
        }
      }
      this.setState({
        panes: panes,
        activeKey: key
      });
    }
    if (menu == "refresh") {
      //刷新当前模块，判断是否是首页，非首页按模块映射地址重新加载模块，首页直接重新加载首页模块
      let times = (new Date()).valueOf();
      const ComponentNames = dynamic(() => import('../../components/public/Main/index'))
      const activeKey = this.state.rightClickData.id;

      if (activeKey == -1000) {
        let {proc_} = this.state.rightClickData;
        this.openWorkFlowMenu(proc_);
        return;
      }
      let flog = false //刷新状态
      for (var i = 0; i < panes.length; i++) {
        // 非首页模块刷新
        if (panes[i].key == activeKey && activeKey != 1) {
          flog = true
          panes[i]['content'] = <ComponentNames time={times} menuInfo={this.state.rightClickData} activeKey={activeKey}
                                                callBackBanner={this.callBackBanner} rightClickMenu={this.rightClickMenu}
                                                openWorkFlowMenu={this.openWorkFlowMenu} openMenuByMenuCode={this.openMenuByMenuCode}/>
        }
      }
      if (!flog) { //首页模块刷新
        const ComponenTpl = dynamic(() => import('../../modules/Index/index'))
        panes[0]['content'] = <ComponenTpl fileUrl='Index' time={times} openMenuByMenuCode={this.openMenuByMenuCode}
                                           rightClickMenu={this.rightClickMenu} callBackBanner={this.callBackBanner}
                                           openWorkFlowMenu={this.openWorkFlowMenu}
        />
      }
      this.setState({
        panes: panes,
      });
    }
    //关闭右击菜单
    this.setState({
      rightClickShow: false
    })
  }
  changeMenuStyle = (menutype) => {
    this.setState({
      menutype,
    })
    this.onChangeTab(this.state.activeKey)
  }
  changeMenuShowStyle = (menumode) => {
    this.setState({
      menumode
    })
  }

  toggleCollapsed = () =>{
    const menuType = JSON.parse(localStorage.getItem('menutype'))
    this.setState({
      collapsed:!this.state.collapsed
    },()=>{
      let menuTypeRudex= ''
      if(menuType == '1'){
        menuTypeRudex = 'colTheme'
      }else if(menuType == '2'&& this.state.collapsed == false){
        menuTypeRudex = 'rowTheme-vertical'
      }else if(menuType == '2'&& this.state.collapsed == true){
        menuTypeRudex = 'rowTheme-inline'
      }
      this.props.actions.changeMenuTheme(menuTypeRudex)
    })
  }
  render() {
    return (
      <div className={style.main}>
        <Header callBackBanner={this.callBackBanner}  activeKey={this.state.activeKey}
                openWorkFlowMenu={this.openWorkFlowMenu}
                openFevModal={this.openFevModal}
                changeMenuStyle={this.changeMenuStyle}
                changeMenuShowStyle={this.changeMenuShowStyle}
                menuData = {{}}
                {... this.state.menuInfo}
                showHeader = {this.state.showHeader}
                collapsed = {this.state.collapsed}
                toggleCollapsed={this.toggleCollapsed}
        />
        { this.state.menutype == 2 && 
          <LeftMenu  activeKey={this.state.activeKey}
          callBackBanner={this.callBackBanner}
                  menuData = {{}}
                  {... this.state.menuInfo}
                  showHeader = {this.state.showHeader}
                  menumode = {this.state.menumode}
                  collapsed = {this.state.collapsed}
          />
        }
        <Layout style={{ background: '#fff',borderLeft:'1px solid #e8e8e8' }}>
          {/* {this.state.menutype == 2 && ( */}
                {/* <div className={style.menuListleft}> */}
                  {/*面包屑 */}
                  {/* <Breadcrumb>
                    <Breadcrumb.Item><span>首页</span></Breadcrumb.Item>
                    {this.state.name1 && <Breadcrumb.Item><span>{this.state.name1}</span></Breadcrumb.Item>}
                    {this.state.name2 &&
                      <Breadcrumb.Item>
                        <span>{this.state.name2}
                        </span>&nbsp;
                    {this.state.isFav ? <MyIcon type="icon-shoucang1" style={{ fontSize: '18px', color: "#ffc618" }} onClick={this.cancleFav} /> :
                          <MyIcon type="icon-shoucang" style={{ fontSize: '18px', color: "#ffc618" }} onClick={this.handleFav} />
                        }

                      </Breadcrumb.Item>}
                  </Breadcrumb> */}
                 {/* </div> */}
          {/* )} */}
          <Content>
            <Tabs tabPosition="bottom"
                  onChange={this.onChangeTab}
                  hideAdd={true}
                  type="editable-card"
                  onEdit={this.onEdit}
                  activeKey={this.state.activeKey}
                  tabBarGutter={0}
                  animated={true}
                  className={style.tab}
            >
              {this.state.panes.map(pane =>
                <TabPane tab={pane.titleName} key={pane.key} forceRender={true} closable={pane.closable} times={pane.times}>{pane.content}</TabPane>)}
            </Tabs>
          </Content>
        </Layout>
        {this.state.rightClickShow &&
        <RightClickTpl rightClickData={this.state.rightClickData} x={this.state.x} y={this.state.y}
                       handleClick={this.rightClickMenu}/>}                     
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
   
  }
};
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, localAction, widowSizeAction,changeMenuTheme), dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(Home);


