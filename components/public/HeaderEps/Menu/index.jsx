import { Menu,Dropdown  } from 'antd';
import ReactDOM from 'react-dom'
import style from "../style.less";

export  default  class Menus extends React.Component {

  componentDidMount() {
    const dom = ReactDOM.findDOMNode(this);
    dom.firstChild.style.width = this.props.menuWidth;
  }

  render() {
    //三级菜单详情
    const menuNode = (
      <div className={style.menuModal}>
        {this.props.menuList2 && this.props.menuList2.map(item => (
          <div key={item.id} className={style.itemstyle}>
            <h4><span className={style.ulicon}></span>{item.groupName}</h4>
            <div className={style.listss}>
              {item.children && item.children.map((child, i) => {
                return <p key={child.id} onClick={this.props.addTab.bind(this, child, i)}><span></span>{child.menuName}</p>
              })}
            </div>
          </div>
        ))}
      </div>
    )
    return (
      <>
      {
        this.props.isThreeMenu != 1 &&
        <div className={style.headCenter}>
          {
            this.props.menuData.length > 0 && (
              <Menu
                theme={this.props.headbackcolor == "white" ? "light" : "dark"}
                selectedKeys={this.props.selectindex? [this.props.selectindex.toString()]:[]}
                mode="horizontal"
                style={{ borderBottom: "none",display: "flex",justifyContent : "flex-end"}}
              >
                {
                  this.props.menuData.map((item, index) => {
                    return <Menu.Item key={index} onClick={this.props.handleClick.bind(this, index, item.menuName)} style={{ fontSize: 14, fontWeight: 600, paddingBottom: 2 }}>{item.menuName} </Menu.Item>
                  })
                }
              </Menu>
            )
          }
        </div>
      }
      {/* 下拉菜单/三级菜单*/}
      {
        this.props.isThreeMenu == 1 &&
        <div className={style.menu2style} >
          {
            this.props.menuData.length > 0 &&
            <Menu
              theme={this.props.headbackcolor == "white" ? "light" : "dark"}
              mode="horizontal"
              selectedKeys={this.props.selectindex? [this.props.selectindex.toString()]:[]}
              style={{ borderBottom: "none",display: "flex",justifyContent : "flex-end"}}
            >
              {
                this.props.menuData.map(item => (
                    <Menu.Item key={item.id} >
                      <Dropdown
                        overlay={menuNode}
                        placement="bottomCenter"
                        visible={this.props.menuthreeKey == item.id}
                        onVisibleChange={this.props.showMenu.bind(this, item.children, item)}
                      >
                        <div> {item.menuName} </div>
                      </Dropdown >
                    </Menu.Item>
                  )
                )
              }
            </Menu>
            }
        </div>
      }
      </>
    );
  }
}
