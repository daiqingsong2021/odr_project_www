import React from 'react'
import style from './style.less'
import { Menu, Popover, Icon, Select, Breadcrumb, Divider, Drawer, Button, Checkbox, Tooltip, notification, Dropdown, Row, Col } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as sysMenuAction from '../../../store/sysMenu/action';
import * as UnReadMessageAction from '../../../store/message/unReadMessage/action';
import * as MytodoAction from "../../../store/myToDo/action"
import * as changeMenuTheme from '@/store/menuTheme/action';
import MyIcon from "../../../components/public/TopTags/MyIcon"
import axios from "../../../api/axios"
import { deleteFavorites, addFavorites, } from "../../../api/api"
import PassWordSet from "../../../modules/Components/PassWordSet"
import AboutMe from "../../../modules/Components/AboutMe"
import LogOut from "../../../modules/Components/LogOut"
import * as dataUtil from '../../../utils/dataUtil'
import Menus from "./Menu";

let lessNodesAppended;
const { SubMenu } = Menu;
class HeaderEps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,//显示帮助
      visible1: false,//显示WSD
      visible2: false, //显示系统菜单
      color: "color6",//皮肤色
      headbackcolor: "white",//菜单背景色
      visibleDrawer: false,//抽屉开关
      actuName: '',
      favList: [],
      favIndex: null,
      menutype: 2,
      selectMenu: null,
      menumode:'vertical'
    }
  };



  componentWillReceiveProps(nextProps, nextState) {
    //底部标签切换，联动菜单。根据传入的菜单ID标记菜单位置
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

    if (nextProps.activeKey != this.props.activeKey) {
      if (userInfo.isThreeMenu && userInfo.isThreeMenu == 1) {
        let array = nextProps.menuData || []

        for (let i = 0; i < array.length; i++) {
          if (array[i].children) {
            let arr = array[i].children
            for (let j = 0; j < arr.length; j++) {

              if (arr[j].children) {
                let arraryMenu = arr[j].children
                for (let v = 0; v < arraryMenu.length; v++) {
                  if (arraryMenu[v].id == nextProps.activeKey) {

                    let fav = false
                    if (userInfo && userInfo.favortCodes) {
                      if (userInfo.favortCodes.indexOf(arraryMenu[v].menuCode) > -1) {
                        fav = true
                      }
                    }
                    this.setState({
                      name2: arraryMenu[v].menuName,
                      name1: array[i].menuName,
                      selectMenu: arraryMenu[v],
                      selectindex: array[i].id,
                      isFav: fav
                    })
                    break
                  }
                }


              }
            }
          }

        }

        return
      }
      let flag = true
      nextProps.menuData.forEach((v, i) => {
        if (v.children) {
          v.children.forEach((item, index) => {
            if (item.id == nextProps.activeKey) {
              let fav = false
              let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

              if (userInfo && userInfo.favortCodes) {
                if (userInfo.favortCodes.indexOf(item.menuCode) > -1) {
                  fav = true
                }
              }
              this.setState({
                sysmenuname: null,
                menuIndex: item.id,
                name2: item.menuName,
                selectindex: i,
                name1: v.menuName,
                isFav: fav
              }, () => {
                let childrenMemnu = nextProps.menuData[this.state.selectindex].children
                this.setState({
                  childrenMemnu
                })
              })
              flag = false
              return
            }
          })
        }
      });
      /*
      if (this.state.sysmenu) {

        if (nextProps.activeKey == "1") {
          //只有右侧菜单时
          if (userInfo && userInfo.loginMenu.left.length == 0) {
            this.setState({
              sysmenuname: userInfo.loginMenu.right[0].menuName,
              childrenMemnu: userInfo.loginMenu.right[0].children,
              menuIndex: null
            })
            flag = false
          }


        } else {
          this.state.sysmenu.forEach((item, index) => {
            if (item.children) {
              item.children.forEach((v, i) => {
                if (v.id == nextProps.activeKey) {
                  let fav = false


                  if (userInfo && userInfo.favortCodes) {
                    if (userInfo.favortCodes.indexOf(v.menuCode) > -1) {
                      fav = true
                    }
                  }
                  this.setState({
                    sysmenuname: item.menuName,
                    menuIndex: v.id,
                    selectindex:null,
                    name2: v.menuName,
                    name1: item.menuName,
                    isFav: fav
                  }, () => {
                    let childrenMemnu = this.state.sysmenu[index].children
                    this.setState({
                      childrenMemnu
                    })
                  })
                  flag = false
                  return
                }
              })
            }
          })
        }
      }
      */
      if (flag) {
        this.setState({
          name2: null,
          name1: null,
          menuIndex: null,
          childrenMemnu: null
        })
      }
    }
  }
  componentDidMount() {

    this.getMessageList()
    this.getTodoList()
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    let { actuName, isThreeMenu, sysmenu, sysmenuname, childrenMemnu, color, headbackcolor, isPc } = this.state;

    if (userInfo) {
      actuName = userInfo.actuName;
      isThreeMenu = userInfo.isThreeMenu;
    }
    /*
    if (userInfo && userInfo.isThreeMenu != 1 && userInfo.loginMenu.right.length != 0) {
      sysmenu = userInfo.loginMenu.right;
    };
    */
    /*
    //只有右侧菜单时
    if (userInfo && userInfo.loginMenu.left.length == 0) {
      sysmenuname = userInfo.loginMenu.right[0].menuName;
      childrenMemnu = userInfo.loginMenu.right[0].children;
    }
    */

    let color1 = localStorage.getItem("color")
    if (color1 != null) {
      color = color1;
    }

    let headbackcolor1 = localStorage.getItem("headbackcolor")
    if (headbackcolor1 != null) {
      headbackcolor = headbackcolor1;
    }
    let menutype =  localStorage.getItem('menutype') ? localStorage.getItem('menutype') : 2;
    let menumode =  localStorage.getItem('menumode') ? localStorage.getItem('menumode') : 'vertical';

    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
      isPc = false;
      /*window.location.href="你的手机版地址";*/
    }
    else {
      /*window.location.href="你的电脑版地址";    */
      isPc = true;
    }
    //获取密级图标
    let securityLogo = JSON.parse(localStorage.getItem("securityLogo"))

    this.setState({
      actuName,
      isThreeMenu,
      sysmenu,
      sysmenuname,
      childrenMemnu,
      color,
      headbackcolor,
      isPc,
      securityLogo,
      menutype,
      menumode
    }, () => {
      this.setColor(this.state.color);
      this.changeTheme(this.state.headbackcolor);
      this.changeMenuType(this.state.menutype);
      this.changeMenuShowStyle(this.state.menumode)
    })
  }

  addTab = (menuInfo) => {
    var fav = false
    var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if (userInfo && userInfo.favortCodes) {
      if (userInfo.favortCodes.indexOf(menuInfo.menuCode) > -1) {
        fav = true
      }
    }
    const { tempName } = this.state;
    menuInfo.fav = fav;
    menuInfo.tempName = this.state.tempName;
    this.setState({
      menuIndex: menuInfo.id,
      name1: tempName ? tempName : null,
      name2: menuInfo.menuName,
      isFav: fav,
      selectMenu: menuInfo
    })
    this.props.callBackBanner(menuInfo)
  }
  setColor = (color) => {
    // insert less.js and color.less
    localStorage.setItem("color", color)
    const lessStyleNode = document.createElement('link');
    const colorId = document.getElementById('clolor')
    const scriptId = document.getElementById('scriptId')
    if (colorId) {
      document.body.removeChild(colorId)
      document.body.removeChild(scriptId)
    }
    const lessConfigNode = document.createElement('script');
    const lessScriptNode = document.createElement('script');
    lessStyleNode.setAttribute('rel', 'stylesheet/less');
    var timestamp2 = (new Date()).valueOf();
    lessStyleNode.href = '/static/' + color + '.less?times=' + timestamp2
    lessStyleNode.id = 'clolor'
    //lessStyleNode.setAttribute('href', 'http://www.wisdomicloud.com/group1/M00/00/43/CkgAA1xtDdWAXwG5AAQnJVZOoqQ48.less');
    lessConfigNode.innerHTML = `
      window.less = {
        async: true,
        env: 'production',
        javascriptEnabled: true
      };
    `;
    lessScriptNode.src = 'https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js';
    lessScriptNode.async = true;
    lessScriptNode.id = 'scriptId';
    lessScriptNode.onload = () => {
      lessScriptNode.onload = null;
    };
    document.body.appendChild(lessStyleNode);
    document.body.appendChild(lessConfigNode);
    document.body.appendChild(lessScriptNode);
    lessNodesAppended = true;
  }
  changeZhorEg = (value) => {
    this.props.initLocaleProvider(value)
  }
  onChangeSetColor = (value) => {
    this.setState({
      color: value,

    })
    this.setColor(value)
  }
  handleClick = (index, name) => {
    this.setState({
      selectindex: index,
      // name1: name,
      sysmenuname: null,

    }, () => {
      let childrenMemnu = this.props.menuData[this.state.selectindex].children
      if (childrenMemnu) {
        let i = childrenMemnu.findIndex(item => item.id == this.props.activeKey)
        if (i > -1) {
          this.setState({
            childrenMemnu,
            menuIndex: childrenMemnu[i].id,
          })
        } else {
          this.setState({
            childrenMemnu,
            menuIndex: null,
          })
        }
      }

    })
  }
  //设置系统菜单
  handleClick1 = (index, name) => {
    this.setState({
      selectindex: null,
      sysmenuname: name,
      visible2: false
    }, () => {
      let childrenMemnu = this.state.sysmenu[index].children
      if (childrenMemnu) {
        let i = childrenMemnu.findIndex(item => item.id == this.props.activeKey)
        if (i > -1) {
          this.setState({
            childrenMemnu,
            menuIndex: childrenMemnu[i].id,
            name1: name,
            name2: childrenMemnu[i].menuName,
          })
        } else {
          this.setState({
            childrenMemnu,
          })
        }
      }
    })
  }
  //控制显示帮助
  handleVisibleChange = (visible) => {
    this.setState({ visible });
  }
  //显示消息
  handleMessageVisibleChange = (messageVisible) => {
    this.setState({ messageVisible });
  }
  //获取消息数据
  getMessageList = () => {
    this.props.actions.getMyUnReadMessage()
  }
  //获取待办信息
  getTodoList = () => {

    this.props.actions.getMytodoList()
  }
  //显示提示
  handleTipVisibleChange = (tipVisible) => {
    this.setState({ tipVisible });
  }
  //控制显示WSD
  handleVisibleChange1 = (visible1) => {
    this.setState({ visible1 });
  }
  //控制显示系统菜单
  handleVisibleChange2 = (visible2) => {
    this.setState({ visible2 });
  }
  //显示系统菜单
  openSysMenu = () => {
    this.setState({
      visible2: true
    })

  }
  //切换主体
  changeTheme = (v) => {
    localStorage.setItem("headbackcolor", v)
    this.setState({
      headbackcolor: v
    })
  }
  /**
   * 获取收藏信息
   *
   * */
  getMenuFavoritesList = () => {
    //
    let getMenuFavorites = (menus_, favortCodes_, menuFavoritesArr_) => {

      if (menus_) {
        for (let i = 0, len = menus_.length; i < len; i++) {
          let { menuCode, children } = menus_[i];
          if (favortCodes_ && favortCodes_.indexOf(menuCode) > -1) {
            menuFavoritesArr_.push(menus_[i]);
          }
          getMenuFavorites(children, favortCodes_, menuFavoritesArr_);
        }
      }
    }

    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    let { loginMenu, favortCodes } = userInfo;
    let menuFavoritesArr = new Array();

    if (userInfo.favortCodes) {
      // getMenuFavorites(loginMenu["right"], favortCodes, menuFavoritesArr);
      getMenuFavorites(loginMenu["left"], favortCodes, menuFavoritesArr);
    }

    return menuFavoritesArr;
  }

  //显示抽屉
  showDrawer = (e) => {
    e.stopPropagation()
    this.setState({
      visibleDrawer: true,
    }, () => {
      let favList = this.getMenuFavoritesList();
      this.setState({
        favList: favList
      })
      //平板
      if (!this.state.isPc) {
        if (this.state.visibleDrawer) {
          window.addEventListener("click", this.closeDrawer)
        }
      }
    });
  };
  //关闭抽屉
  onClose = () => {
    this.setState({
      visibleDrawer: false,
    });
  };
  //鼠标移出关闭抽屉
  closeDrawer = () => {

    this.setState({
      visibleDrawer: false,
    }, () => {
      window.removeEventListener("click", this.closeDrawer)
    });
  }
  //收藏菜单
  handleFav = () => {
    const { selectMenu } = this.state
    let menuCode = selectMenu.menuCode;
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
  //取消收藏菜单
  cancleFav = () => {
    const { selectMenu } = this.state;
    let menuCode = selectMenu.menuCode;
    axios.deleted(deleteFavorites("menu", [menuCode]), {}, true).then(res => {
      var userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      userInfo.favortCodes.splice(userInfo.favortCodes.indexOf(menuCode), 1);
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
      this.setState({
        isFav: false
      })
    })
  }
  //选择收藏夹列表
  selectFav = (i, e) => {
    const { favList } = this.state
    //是否勾选
    if (favList[i].ischecked) {
      favList[i].ischecked = null
      this.setState({
        favList
      })
    } else {
      favList[i].ischecked = 1
      this.setState({
        favList
      })
    }
    //设置当前选择行
    if (i == this.state.favIndex) {
      this.setState({
        favIndex: null,
        favSelectedKeys: []
      })
    } else {
      this.setState({
        favIndex: i,
        favSelectedKeys: [i.toString()]
      })
    }
  }
  //鼠标进入显示移动
  onMouseEnterHandle = (i) => {
    this.setState({
      favMouseIndex: i
    })
  }
  //鼠标离开隐藏移动
  onMouseLeavehanle = () => {
    this.setState({
      favMouseIndex: null
    })
  }
  //收藏夹下移
  moveDown = (i, e) => {
    e.stopPropagation()
    const { favList } = this.state
    let obj = favList[i]
    favList.splice(i, 1)
    favList.splice(i + 1, 0, obj)
    // favList[i].ischecked=null
    this.setState({
      favList,
      favIndex: null,
      favSelectedKeys: []
    })
  }
  //收藏夹上移
  moveUp = (i, e) => {
    e.stopPropagation()
    const { favList } = this.state
    let obj = favList[i]
    favList.splice(i, 1)
    favList.splice(i - 1, 0, obj)
    // favList[i].ischecked=null
    this.setState({
      favList,
      favIndex: null,
      favSelectedKeys: []
    })
  }
  //打开收藏模块
  openFevModal = () => {
    const { favList } = this.state
    let data = []

    favList.forEach(item => {
      if (item.ischecked == 1) {
        data.push(item)
      }
    })
    if (data.length == 0) {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '提示',
          description: '请选择模块进行操作'
        }
      )
      return
    }
    // data.forEach(item => {
    //   item.url = item.menuUrl
    //   item.id = item.id
    //   item.menuCode = item.menuCode
    // })
    this.props.openFevModal(data)
  }
  //删除收藏模块
  deleteFev = () => {
    const { favList } = this.state
    let data = []
    let array = []
    favList.forEach(item => {
      //ischecked == 1的是将要删除的收藏模块
      if (item.ischecked == 1) {
        data.push(item.menuCode)
      } else {
        //未被删除的收藏数据
        array.push(item)
      }
    })
    if (data.length == 0) {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message: '未选文件夹',
          description: '请选择文件夹进行操作'
        }
      )
      return
    }
    //将要删除的收藏数组，格式化接口提交数据
    let arr = dataUtil.Arr().toString(data)
    axios.deleted(deleteFavorites("menu", arr), null, true, "删除收藏成功").then(res => {
      let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      //修改本地收藏数组
      userInfo.favortCodes = array.map(item => item.menuCode)
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo))
      //修改组件收藏数组
      this.setState({
        favList: array,
        favIndex: null,
        favSelectedKeys: []
      })
    })
  }
  //显示搜索框
  openSearch = () => {
    this.setState({
      isShowSearch: true
    })
  }
  //隐藏搜索框
  visiableSearch = () => {
    this.setState({
      isShowSearch: false
    })
  }
  //搜索
  handleVisibleSearchlist = (isShowSearchList) => {
    if (this.state.isShowSearch) {
      this.setState({ isShowSearchList })
    }
  }
  searchfunction = (e) => {
    e.stopPropagation()
    this.setState({
      isShowSearchList: true
    }, () => {
      window.addEventListener("click", this.closeSearchList)
    })
  }
  //隐藏搜素列表
  closeSearchList = () => {
    this.setState({
      isShowSearchList: false
    }, () => {
      window.removeEventListener("click", this.closeSearchList)
    })
  }
  //显示分类搜索
  handleVisibleSearchMenu = (isShowSearchClassfyMenu) => {
    this.setState({ isShowSearchClassfyMenu })
  }
  //跳转高级搜索
  gotoAdvaceSearch = () => {
    this.setState({
      name1: "高级搜素"
    })
    this.props.callBackBanner({ menuName: '高级搜素', url: "Components/AdvanceSearch", id: 234, parentId: 0 });
  }
  //打开个人信息
  openPersonaInfo = () => {
    this.setState({
      name1: "个人信息",
      visible1: false,
      name2: null
    })
    this.props.callBackBanner({ menuName: '个人信息', url: "Components/PersonaInfo", id: 222, parentId: 0 });
  }
  //修改密码
  modifyPW = () => {
    this.setState({
      isShowPasswordSet: true,
      visible1: false
    })
  }

  //隐藏修改密码
  closePassWordSet = () => {
    this.setState({
      isShowPasswordSet: false,
    })
  }
  //注销
  exitLog = () => {
    this.setState({
      isShowLogOut: true,
      visible1: false
    })
  }
  //隐藏注销
  closeLogOut = () => {
    this.setState({
      isShowLogOut: false,
    })
  }
  //显示关于
  openAboutMe = () => {
    this.setState({
      isShowAbout: true,
      visible: false
    })
  }
  //隐藏关于
  closeAbout = () => {
    this.setState({
      isShowAbout: false
    })
  }
  //显示在线支持
  openOnlineSupport = () => {
    this.setState({
      name1: "在线支持",
      visible: false,
      name2: null
    })
    this.props.callBackBanner({ menuName: '在线支持', url: "Components/OnlineSupport", id: 2323, parentId: 0 });
  }
  //打开操作手册
  openHelp = () => {
    // this.setState({
    //   name1: "操作手册",
    //   visible: false,
    //   name2: null
    // })
    // this.props.callBackBanner({ menuName: '操作手册', url: "Components/HelpManual", id: 251, parentId: 0 });
    window.open("http://iepms.sz-mtr.com:8503/szhelp/index.html");
  }
  //打开消息
  openMessage = () => {
    this.setState({
      name1: "我的消息",
      visible: false,
      name2: null
    })
    this.props.callBackBanner({ menuName: '我的消息',menuCode:'MessageMenu', url: "Message", id: 262, parentId: 0 }, true);
  }

  //阅读消息
  readMessage = (item) => {
    localStorage.setItem("openMessage", JSON.stringify(item))
    this.props.callBackBanner({ menuName: '我的消息',menuCode:'MessageMenu', url: "Message", id: 262, parentId: 0 }, true);
  }

  //打开我的流程
  openMyProcess = () => {
    this.setState({
      name1: "我的流程",
      visible: false,
      name2: null
    })
    this.props.callBackBanner({ menuName: '我的流程', url: "MyProcess/MyHome", id: 345, parentId: 0 });
  }
  //头部打开我的流程
  openMyProcess1 = () => {
    this.setState({
      name1: "我的流程",
      tipVisible: false,
      name2: null
    })
    this.props.callBackBanner({ menuName: '我的流程',menuCode:'ProcessMenu', url: "MyProcess/MyHome", id: 345, parentId: 0 });
  }

  openTask = (taskId, procInstId) => {
    this.props.openWorkFlowMenu({ taskId: taskId, procInstId: procInstId });
  }
  //三级菜单显示控制
  showMenu = (menuList, menu, flag) => {
    this.setState({
      menuthreeKey: flag ? menu.id : null,
      menuList2: menuList,
      tempName: menu.menuName
    })

  }
  changeMenuType = (menutype) => {
    const {collapsed} = this.props
    let menuTypeRudex= ''
    if(menutype == '1'){
      menuTypeRudex = 'colTheme'
    }else if(menutype == '2'&& collapsed == false){
      menuTypeRudex = 'rowTheme-vertical'
    }else if(menutype == '2'&& collapsed == true){
      menuTypeRudex = 'rowTheme-inline'
    }
    this.props.actions.changeMenuTheme(menuTypeRudex)
    localStorage.setItem('menutype',menutype);
    localStorage.removeItem('menumode');
    if(this.state.selectMenu){
        let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        if (userInfo && userInfo.favortCodes) {
          if (userInfo.favortCodes.indexOf(this.state.selectMenu.menuCode) > -1) {
            this.setState({isFav:true})
          }
        }
    }
    
    this.setState({ menutype });
    this.props.changeMenuStyle(menutype);
  }
  changeMenuShowStyle = (mode) => {
    localStorage.setItem('menumode',mode);
    this.setState({
      menumode: mode
    })
    this.props.changeMenuShowStyle(mode);
  }
  render() {

    //帮助内容
    const content = (
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        <li style={{ padding: "10px 20px" }} className="my-btnback" onClick={this.openHelp}><MyIcon type="icon-caozuoshouce1" style={{ fontSize: '18px', verticalAlign: "text-bottom" }} />&nbsp;&nbsp;操作手册</li>
      </ul>
    )
    //风格设置内容
    const personalConfig = [
      { name: "蓝色菜单风格", color: "#006bc3" },
      { name: "暗色菜单风格", color: "black" },
      { name: "亮色菜单风格", color: "white" },
    ]
    const themeConfig = [
      { backgroundColor: "#f5222d", file: "color1" },
      { backgroundColor: "#fa541c", file: "color2" },
      { backgroundColor: "#faad14", file: "color3" },
      { backgroundColor: "#13c2c2", file: "color4" },
      { backgroundColor: "#52c41a", file: "color5" },
      { backgroundColor: "#1890ff", file: "color6" },
      { backgroundColor: "#2f54eb", file: "color7" },
      { backgroundColor: "#722ed1", file: "color8" },
    ]
    const content2 = (
      <div className={style.personalstyle}>
        <span className={style.styletitle}>整体风格设置</span>
        <section className={style.style1}>
          {personalConfig.map(item => {
            return <Tooltip placement="top" title={item.name} key={item.color}>
              <div className={style.stylew} onClick={this.changeTheme.bind(this, item.color)}>
                <div className={style.stylehead} style={{ backgroundColor: item.color }}></div>
                <div className={style.stylemain}>{this.state.headbackcolor == item.color ? <Icon type="check" /> : null}</div>
              </div>
            </Tooltip>
          })}
        </section>
        <span className={style.styletitle}>主题色</span>
        <section className={style.color}>
          {themeConfig.map(item => {
            return <div key={item.file} style={{ backgroundColor: item.backgroundColor }} onClick={this.onChangeSetColor.bind(this, item.file)}>{this.state.color == item.file ? <Icon type="check" /> : null}</div>
          })}

        </section>
        <span className={style.styletitle}>导航模式</span>
        <div className={style.menuSelect}>
          {/* <div className={style.stymenu} onClick={() => this.changeMenuType(1)} style={{ color: this.state.menutype == 1 ? "#1890ff" : null }}>菜单一</div>
          <div className={style.stymenu} onClick={() => this.changeMenuType(2)} style={{ color: this.state.menutype == 2 ? "#1890ff" : null }}>菜单二</div> */}
          <div className={style.menuStyle} onClick={() => this.changeMenuType(1)}><img src="../../../static/images/suzhou/topSideMenu.svg" style={{width:'48px',height:'48px'}} alt=""/>{this.state.menutype == 1 ? <Icon type="check" /> : ''}</div>
          <div className={style.menuStyle} onClick={() => this.changeMenuType(2)}><img src="../../../static/images/suzhou/leftSideMenu.svg" style={{width:'48px',height:'48px'}} alt=""/>{this.state.menutype == 2 ? <Icon type="check" /> : ''}</div>
        </div>
        {this.state.menutype == 2 &&
          <div>
            <span className={style.styletitle}>菜单样式</span>
            <div className={style.menuSelect}>
              <div className={style.stymenu} onClick={() => this.changeMenuShowStyle('inline')} style={{ color: this.state.menumode == 'inline' ? "#1890ff" : null }}>展开式</div>
              <div className={style.stymenu} onClick={() => this.changeMenuShowStyle('vertical')} style={{ color: this.state.menumode == 'vertical' ? "#1890ff" : null }}>弹出式</div>
            </div>
          </div>
        }
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          <li className="my-btnback" style={{ padding: "10px 25px" }} onClick={this.openPersonaInfo}><MyIcon type="icon-nav_profile" style={{ fontSize: '18px', verticalAlign: "text-bottom" }} />&nbsp;个人信息</li>
          <li className="my-btnback" style={{ padding: "10px 25px" }} onClick={this.modifyPW}><MyIcon type="icon-mima" style={{ fontSize: '18px', verticalAlign: "text-bottom" }} />&nbsp;修改密码</li>
          <li className="my-btnback" style={{ padding: "10px 25px" }} onClick={this.exitLog}><MyIcon type="icon-tuichu" style={{ fontSize: '18px', verticalAlign: "text-bottom" }} />&nbsp;注销用户</li>
        </ul>
      </div>
    )
    //系统菜单
    const content3 = (
      <section className={style.sysmenu}>

        {this.state.sysmenu && this.state.sysmenu.map((item, index) => {
          return <div className={style.sysmenuitem} key={index} onClick={this.handleClick1.bind(this, index, item.menuName)}><MyIcon type={item.image} style={{ fontSize: '25px' }} /><p>{item.menuName}</p></div>
        })}

      </section>
    )
    //消息内容
    const messageContent = (

      <div className={style.message}>
        <div className={style.messagecontanior}>
          {this.props.unReadmessage && this.props.unReadmessage.list && this.props.unReadmessage.list.map((item, index) => {
            return (
              <div className={style.messageItem} key={index}>
                <MyIcon type="icon-nv" style={{ fontSize: "40px", marginRight: 15 }} />
                <div className={style.messageContent}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} onClick={this.readMessage.bind(this, item)} className="topBtnActivity">{item.title}</span>
                  <br></br>
                  <span className="my-text">{item.recvTime}</span>
                </div>
                <span className={`${style.toptip} my-text`}>{`${item.duration}`}</span>
              </div>
            )
          })}
        </div>

        <div className={style.messageBottom}> <span className="topBtnActivity" onClick={this.openMessage}><MyIcon type="icon-39" style={{ fontSize: "18px", marginRight: 5, verticalAlign: "text-bottom" }} />阅读更多消息</span></div>
      </div>
    )
    //提示内容
    const tipContent = (
      <div className={style.tipContent}>
        <div className={style.tipmessage}>
          {this.props.myTodo.list && this.props.myTodo.list.map((item, index) => {

            const { id, procInstId } = item;
            return (
              <div className={style.tipContentItem} key={index} onClick={this.openTask.bind(this, id, procInstId)}>
               <p className="topBtnActivity">{item.procInstName} &nbsp;&nbsp;&nbsp;&nbsp;{item.lastOwner}</p>
                <span className="my-text">{item.startTime}</span>
                <span className={`${style.tipleft} my-text`}>{item.stayTime}</span>
              </div>
            )
          })}
        </div>


        <div className={style.tipContentBottom}> <span className="topBtnActivity" onClick={this.openMyProcess1}><MyIcon type="icon-xiaoxi" style={{ fontSize: "18px", marginRight: 5, verticalAlign: "text-bottom" }} />阅读更多待办</span></div>
      </div>
    )
    //分类搜素
    const searchMenu = (
      <section className={style.searchClass} onClick={e => e.stopPropagation()} >
        <Menu>
          <Menu.Item><Checkbox></Checkbox>&nbsp;&nbsp;项目</Menu.Item>
          <Menu.Item><Checkbox></Checkbox>&nbsp;&nbsp;计划</Menu.Item>
          <Menu.Item><Checkbox></Checkbox>&nbsp;&nbsp;文档</Menu.Item>
        </Menu>
        <p><span className="my-link" onClick={this.gotoAdvaceSearch}>高级搜索&nbsp;<MyIcon type="icon-jiantouyou" style={{ fontSize: 14 }} /></span></p>
      </section>
    )
    //搜素列表
    const searchList = (
      <section className={style.SearchList} onClick={e => e.stopPropagation()}>
        <div className={style.modal}>
          <Menu>
            <Menu.Item><MyIcon type="icon-xiangmu" style={{ fontSize: 14 }} />&nbsp;&nbsp;ACM项目文档</Menu.Item>
            <Menu.Item><MyIcon type="icon-xiangmu" style={{ fontSize: 14 }} />&nbsp;&nbsp;ACM项目文档</Menu.Item>
            <Menu.Item><MyIcon type="icon-xiangmu" style={{ fontSize: 14 }} />&nbsp;&nbsp;ACM项目文档</Menu.Item>
          </Menu>
          <span className={`${style.more} my-link`}>更多&nbsp;<MyIcon type="icon-jiantouyou" style={{ fontSize: 14 }} /></span>
        </div>
        <div className={style.modal}>
          <Menu>
            <Menu.Item><MyIcon type="icon-jihua1" style={{ fontSize: 14 }} />&nbsp;&nbsp;ACM项目文档</Menu.Item>
            <Menu.Item><MyIcon type="icon-jihua1" style={{ fontSize: 14 }} />&nbsp;&nbsp;ACM项目文档</Menu.Item>
            <Menu.Item><MyIcon type="icon-jihua1" style={{ fontSize: 14 }} />&nbsp;&nbsp;ACM项目文档</Menu.Item>
          </Menu>
          <span className={`${style.more} my-link`}>更多&nbsp;<MyIcon type="icon-jiantouyou" style={{ fontSize: 14 }} /></span>
        </div>
        <div className={style.modal}>
          <Menu>
            <Menu.Item><MyIcon type="icon-wenjianjia" style={{ fontSize: 14 }} />&nbsp;&nbsp;ACM项目文档</Menu.Item>
            <Menu.Item><MyIcon type="icon-wenjianjia" style={{ fontSize: 14 }} />&nbsp;&nbsp;ACM项目文档</Menu.Item>
            <Menu.Item><MyIcon type="icon-wenjianjia" style={{ fontSize: 14 }} />&nbsp;&nbsp;ACM项目文档</Menu.Item>
          </Menu>
          <span className={`${style.more} my-link`}>更多&nbsp;<MyIcon type="icon-jiantouyou" style={{ fontSize: 14 }} /></span>
        </div>
        <p><span className="my-link" onClick={this.gotoAdvaceSearch}>高级搜索&nbsp;<MyIcon type="icon-jiantouyou" style={{ fontSize: 14 }} /></span></p>
      </section>
    )

    return (
      <div className={style.main}>
        <div className={style.content} style={{borderBottom:this.state.menutype == 2 ? 'none' : '8px solid #f5f5f5'}}>
          <div className={style.head} style={{ backgroundColor: this.state.headbackcolor }}>
            {/*头部左侧*/}
            <div className={style.headLeft}>
              {/* <Icon type="search" style={{fontSize: 18}}/>
              <input placeholder="搜索项目"/>
              <span className={style.searchSubIcon}>+</span> */}
              {/* <Icon type="align-left" style={{ cursor: "pointer", fontSize: 20, color: this.state.headbackcolor != "white" ? "white" : "rgba(0, 0, 0, 0.65)" }} onMouseEnter={this.showDrawer} onClick={this.showDrawer} /> */}
              {this.state.menutype == 2 && <Icon type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'} onClick={this.props.toggleCollapsed} style={{ cursor: "pointer", fontSize: 20, color: this.state.headbackcolor != "white" ? "white" : "rgba(0, 0, 0, 0.65)" }} />}
              <Drawer
                placement="left"
                closable={false}
                onClose={this.onClose}
                width="400px"
                visible={this.state.visibleDrawer}
                bodyStyle={{ padding: 0, height: "100%" }}
                mask={false}
              >
                <div className={style.DrawerMenu} onMouseLeave={this.closeDrawer} onClick={e => e.stopPropagation()} >
                  <header><MyIcon type="icon-xiazai44" style={{ fontSize: 18, color: "#1890ff" }} />&nbsp;首页</header>
                  <section className={style.sectionStyle}>
                    <h3><MyIcon type="icon-gongzuotai" style={{ fontSize: 18, color: "#1890ff" }} />&nbsp;管理看板</h3>
                    <Menu>
                      <Menu.Item>项目清单</Menu.Item>
                      <Menu.Item>形象进度</Menu.Item>
                      <Menu.Item>项目进展分析</Menu.Item>
                      <Menu.Item>项目管理看板</Menu.Item>
                    </Menu>
                  </section>
                  <div className={style.divider} />
                  <section className={style.sectionStyle}>
                    <h3><MyIcon type="icon-fl-renyuan" style={{ fontSize: 18, color: "#1890ff" }} />&nbsp;个人中心</h3>
                    <Menu>
                      <Menu.Item>常用模块</Menu.Item>
                      <Menu.Item>我的仪表板</Menu.Item>
                      <Menu.Item>我的预警</Menu.Item>
                      <Menu.Item>我的问题</Menu.Item>
                      <Menu.Item onClick={this.openMyProcess}>我的流程</Menu.Item>
                      <Menu.Item>我的计划</Menu.Item>
                      <Menu.Item>我的行动项</Menu.Item>
                    </Menu>
                  </section>
                  <div className={style.divider} />
                  <section className={style.favfile}>
                    <div className={style.favtitle}>
                      <h3><MyIcon type="icon-shoucang1" style={{ fontSize: '18px', color: "#ffc618" }} />&nbsp;收藏夹</h3>
                      <Button type="primary" ghost size="small" onClick={this.openFevModal}>打开</Button>
                      <Button size="small" onClick={this.deleteFev}>删除</Button>
                    </div>
                    <Menu selectedKeys={this.state.favSelectedKeys}>
                      {this.state.favList && this.state.favList.map((item, i, array) => {
                        return <Menu.Item key={i} onMouseEnter={this.onMouseEnterHandle.bind(this, i)} onMouseLeave={this.onMouseLeavehanle.bind(this, i)} onClick={this.selectFav.bind(this, i)}><Checkbox checked={item.ischecked == 1 ? true : false} />&nbsp;&nbsp;&nbsp;<span >{item.menuName}</span>{this.state.favMouseIndex == i ? i == 0 ? <Icon type="arrow-down" onClick={this.moveDown.bind(this, i)} /> : i == array.length - 1 ? <Icon type="arrow-up" onClick={this.moveUp.bind(this, i)} /> : <><Icon type="arrow-up" onClick={this.moveUp.bind(this, i)} /><Icon type="arrow-down" onClick={this.moveDown.bind(this, i)} /></> : null}</Menu.Item>
                      })}
                    </Menu>
                  </section>

                </div>
              </Drawer>
              {this.state.menutype == 2 && <Divider type="vertical" style={{ height: 25 }} />}
              {/* <img src="/static/images/zhonghe-logo.png" style={{ width: 50 }} />
              <h2 style={{ margin: 0, whiteSpace: "nowrap", color: this.state.headbackcolor != "white" ? "white" : "#333" }}> 进度计划管理系统</h2> */}

              {/* <img src={this.state.headbackcolor == "white" ? "/static/images/logo-bk_3.png" : "/static/images/logo-wt_3.png"} style={{ height: 35 }} /> */}
              <img src={this.state.headbackcolor == "white" ? "/static/images/heb/heb_banner.png" : "/static/images/heb/heb_banner.png"} style={{ height: 25 }} />
              {/*<img src="/static/images/logowhite.png" />*/}
              {/*<img src={this.state.headbackcolor == "white" ? "/static/images/logo-bk_3.png" : "/static/images/logo-wt_3.png"} style={{ height: 35 }} />*/}
              {/* <img src={this.state.headbackcolor == "white" ? "/static/images/hegongye.png" : "/static/images/hegongye.png"} style={{ height: 35 }} /> */}
              {/* <MyIcon   type="icon-jimi" style={{fontSize:30}}/>  */}
              {/* 密级图标 */}
              {/* {this.state.securityLogo && <div className={style.security}>{ this.state.securityLogo.title}</div>} */}
              {/* 
              {this.state.securityLogo && this.state.securityLogo.id == 1 && <MyIcon type="icon-jimi" style={{ fontSize: 30 ,marginLeft:8}} />}
              {this.state.securityLogo && this.state.securityLogo.id == 2 && <MyIcon type="icon-juemi" style={{ fontSize: 30 ,marginLeft:8}} />}
              {this.state.securityLogo && this.state.securityLogo.id == 3 && <MyIcon type="icon-feimi" style={{ fontSize: 30 ,marginLeft:8}} />}
              {this.state.securityLogo && this.state.securityLogo.id == 4 && <MyIcon type="icon-mimi" style={{ fontSize: 30 ,marginLeft:8}} />}  */}
            </div>
            {/*头部中间*/}
            {
              this.state.menutype == 1 && this.props.menuData && this.props.menuData.length > 0 &&
              (
                <Menus menuList2={this.state.menuList2}
                  menuthreeKey={this.state.menuthreeKey}
                  addTab={this.addTab}
                  isThreeMenu={this.state.isThreeMenu}
                  menuData={this.props.menuData}
                  headbackcolor={this.state.headbackcolor}
                  selectindex={this.state.selectindex}
                  handleClick={this.handleClick}
                  showMenu={this.showMenu}
                />
              )
            }

            {/*头部右侧*/}

            <div className={style.headRight}>
              {/*{this.state.isPc &&*/}
              {/*<div className={style.mySearch}>*/}
              {/*<Popover*/}
              {/*placement="bottom"*/}
              {/*content={searchMenu} trigger="click"*/}
              {/*visible={this.state.isShowSearchClassfyMenu}*/}
              {/*onVisibleChange={this.handleVisibleSearchMenu}*/}
              {/*style={{ padding: 20 }}*/}
              {/*>*/}
              {/*<div>*/}
              {/*<MyIcon type="icon-gengduo-" style={{ verticalAlign: "middle", fontSize: 20, marginRight: 5, visibility: !this.state.isShowSearch ? "hidden" : null, color: this.state.headbackcolor != "white" ? "white" : "rgba(0, 0, 0, 0.65)" }} onClick={this.showSearchMenu} />*/}
              {/*</div>*/}

              {/*</Popover>*/}
              {/*<div>*/}
              {/*<input type="text" placeholder="站内搜索" ref={input => this.input = input} style={{ visibility: !this.state.isShowSearch ? "hidden" : null }} />*/}
              {/*</div>*/}

              {/*<Popover*/}
              {/*placement="bottomRight"*/}
              {/*content={searchList} trigger="click"*/}
              {/*visible={this.state.isShowSearchList}*/}
              {/*onVisibleChange={this.handleVisibleSearchlist}*/}
              {/*>*/}
              {/*<div>*/}
              {/*<MyIcon type="icon-search" style={{ verticalAlign: "middle", fontSize: "20px", cursor: "pointer", color: this.state.headbackcolor != "white" ? "white" : "rgba(0, 0, 0, 0.65)" }} onClick={this.state.isShowSearch ? this.searchfunction : this.openSearch} />*/}
              {/*</div>*/}

              {/*</Popover>*/}

              {/*/!*分类搜索 *!/*/}

              {/*/!*搜索结果列表*!/*/}

              {/*</div>*/}


              {/*}*/}


              {/*帮助 */}
              <Popover
                placement="bottom"
                content={content} trigger="click"
                visible={this.state.visible}
                onVisibleChange={this.handleVisibleChange}
              >
                <div style={{ marginRight: 25 }}>
                  <MyIcon type="icon-wenti2" style={{ verticalAlign: "middle", fontSize: "20px", cursor: "pointer", color: this.state.headbackcolor != "white" ? "white" : "rgba(0, 0, 0, 0.65)" }} />
                </div>
              </Popover>
              {/*提示 */}
              <Popover
                placement="bottomRight"
                content={tipContent} trigger="click"
                visible={this.state.tipVisible}
                onVisibleChange={this.handleTipVisibleChange}
                style={{ top: 100 }}
              >
                <div style={{ position: "relative", marginRight: 25 }}>
                  {this.props.myTodo && this.props.myTodo.list.length > 0 && <span className={style.tipbtn} style={{ backgroundColor: "#52c41a" }}>{this.props.myTodo.num}</span>}
                  <MyIcon type="icon-notice" style={{ verticalAlign: "middle", fontSize: "20px", cursor: "pointer", color: this.state.headbackcolor != "white" ? "white" : "rgba(0, 0, 0, 0.65)" }} />
                </div>
              </Popover>


              {/*消息 */}
              <Popover
                placement="bottomRight"
                content={messageContent} trigger="click"
                visible={this.state.messageVisible}
                onVisibleChange={this.handleMessageVisibleChange}
                style={{ top: 100 }}
              >
                {/* <Badge count={25} style={{ backgroundColor: '#fbb216' }}> */}
                <div style={{ position: "relative", marginRight: 25 }}>
                  {this.props.unReadmessage && this.props.unReadmessage.num > 0 && <span className={style.tipbtn} style={{ backgroundColor: "#fbb216", left: 18 }}>{this.props.unReadmessage.num}</span>}

                  <MyIcon type="icon-message" style={{ verticalAlign: "middle", fontSize: "20px", cursor: "pointer", color: this.state.headbackcolor != "white" ? "white" : "rgba(0, 0, 0, 0.65)" }} />
                </div>


              </Popover>

              {/*头像 */}
              <MyIcon type="icon-nv" style={{ fontSize: "30px", marginRight: 15 }} />

              {/*WSD */}
              <Popover
                placement="bottomRight"
                content={content2} trigger="click"
                visible={this.state.visible1}
                onVisibleChange={this.handleVisibleChange1}
              >
                <div style={{color: this.state.headbackcolor != "white" ? "white" : "rgba(0, 0, 0, 0.65)"}} className={style.popoverTxt} ><span className={style.userName}>{this.state.actuName}</span>&nbsp;<Icon type="caret-down" /></div>
              </Popover>


            </div>
          </div>
          {/*子菜单 */}
        {/* {
          this.state.menutype == 1 && (
          <div className={style.menuList}>
            <Row>
              <Col offset={3} span={18}>
                <Menu
                  selectedKeys={this.state.menuIndex ? [this.state.menuIndex.toString()] : []}
                  mode="horizontal"
                >
                  {this.state.childrenMemnu && this.state.isThreeMenu != 1 && this.state.childrenMemnu.map((item, i) => {
                    return <Menu.Item key={item.id} onClick={this.addTab.bind(this, item)}>{item.menuName}</Menu.Item>
                  })}
                </Menu>
              </Col>
            </Row> */}

            {/* {this.state.isPc && ( */}
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
          {/* </div> */}
          {/* )} */}
          {/* 密码设置 */}
          {this.state.isShowPasswordSet && <PassWordSet handleCancel={this.closePassWordSet} />}
          {/* 关于 */}
          {this.state.isShowAbout && <AboutMe handleCancel={this.closeAbout} />}
          {/* 注销 */}
          {this.state.isShowLogOut && <LogOut handleCancel={this.closeLogOut} />}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
    unReadmessage: state.unReadmessage,
    myTodo: state.myTodo,
    menuTheme:state.menuTypeData
  }
};
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(Object.assign({}, UnReadMessageAction, MytodoAction, changeMenuTheme), dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(HeaderEps);
