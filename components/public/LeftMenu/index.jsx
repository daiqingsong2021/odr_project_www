import React from 'react'
import style from './style.less'
import { Menu, Button, Icon } from 'antd';
const { SubMenu } = Menu;
const iconMapList = [
  'appstore',
  'solution',
  'team',
  'setting',
  'inbox',
  'ordered-list',
  'insurance',
  'safety',
  'alert',
  'question-circle',
  'file-text',
  'file-protect',
  'medicine-box',
  'bar-chart'
];
let lessNodesAppended;
class LeftMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actuName: '',
      favList: [],
      favIndex: null,
      menutype: 2,
      selectMenu: null,
      selectSubMenu:null,
      collapsed:false,
      color: "color6",//皮肤色
      headbackcolor: "white",
      selectedKeysList:[]
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
                        selectSubMenu:arr[j],
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
        if (flag) {
          this.setState({
            name2: null,
            name1: null,
            menuIndex: null,
            childrenMemnu: null
          })
        }
      }
      
      if(this.state.selectindex && this.state.selectMenu && this.state.selectSubMenu){
        this.setState({
          selectedKeysList: [String(this.state.selectindex), String(this.state.selectSubMenu.id), String(this.state.selectMenu.id)]
        })
      }
  }
  componentDidMount() {
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    let { actuName, isThreeMenu, sysmenu, sysmenuname, childrenMemnu, color, headbackcolor, isPc } = this.state;

    if (userInfo) {
      actuName = userInfo.actuName;
      isThreeMenu = userInfo.isThreeMenu;
    }

    let color1 = localStorage.getItem("color")
    if (color1 != null) {
      color = color1;
    }

    let headbackcolor1 = localStorage.getItem("headbackcolor")
    if (headbackcolor1 != null) {
      headbackcolor = headbackcolor1;
    }

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
      securityLogo
    }, () => {
      // this.setColor(this.state.color);
      this.changeTheme(this.state.headbackcolor);
    })
  }
  //切换主体
  changeTheme = (v) => {
    localStorage.setItem("headbackcolor", v)
    this.setState({
      headbackcolor: v
    })
  }
  addTab = (menuInfo,subId) => {
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
      selectMenu: menuInfo,
      selectedKeysList:[String(menuInfo.parentId),String(subId),String(menuInfo.id)]
    })
    console.log(menuInfo)
    this.props.callBackBanner(menuInfo)
  }
  //三级菜单显示控制
  showMenu = (menuList, menu, flag) => {
    this.setState({
      menuthreeKey: flag ? menu.id : null,
      menuList2: menuList,
      tempName: menu.menuName
    })

  }

  render() {
    // const menuHeight = document && document.body && document.body.clientHeight - 58 || 'auto';
    return (
      <div className={style.leftMenu} style={{textAlign:this.state.collapsed ? 'center' : 'left'}}>
        {/* <Button type="primary" size="small" onClick={this.toggleCollapsed} style={{marginTop:'15px',marginLeft:this.state.collapsed ? '0' : '15px'}}>
          <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
        </Button> */}
        {
          this.props.menuData && this.props.menuData.length > 0 &&
          (
            <Menu
                  mode={this.props.menumode}
                  selectedKeys={this.state.selectedKeysList}
                  inlineCollapsed={this.props.collapsed}
                  style={{border:'none'}}
            >
              {
                this.props.menuData.map((item, index) => {
                  return <SubMenu key={item.id} title={
                    <span>
                      <Icon type={iconMapList[index]} />
                      <span>{item.menuName}</span>
                    </span>
                  }
                  style={{width:this.props.collapsed ? 'auto' : '200px'}}
                  >
                    {
                      item.children.map((subItem,subIndex) => {
                        return <Menu.ItemGroup title={subItem.groupName} key={subItem.id}>
                          {
                            subItem.children.map((thirdItem,thirdIndex) => {
                              return <Menu.Item key={thirdItem.id} onClick={() => this.addTab(thirdItem,subItem.id)}>{thirdItem.menuName}</Menu.Item>
                            })
                          }
                        </Menu.ItemGroup>
                      })
                    }
                  </SubMenu>
                })
              }
            </Menu>
          )
        }
          {/* <div style={{ backgroundColor: this.state.headbackcolor }}>
            {
              this.props.menuData && this.props.menuData.length > 0 &&
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
           
          </div> */}
      </div>
    )
  }
}

export default LeftMenu;
