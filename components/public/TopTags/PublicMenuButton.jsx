import React from 'react'
import style from './style.less'
import { Icon, Checkbox, Menu, Dropdown,Modal } from 'antd'
import MyIcon from "../../../components/public/TopTags/MyIcon"
class PublicMenuButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          ...this.initProps(this.props)
        }
    }

    componentWillReceiveProps(newProps, state) {
        this.setState(this.initProps(newProps));
    }

    initProps = (props) =>{
      return {
        visible: false,     //提示窗口显示状态 默认隐藏
        edit: !props.edit ? props.edit : true,
        title: props.title ? props.title : '',
        menus: props.menus ? props.menus : [],
        icon: props.icon ? props.icon : '',
        beforeCallBack: props.beforeCallBack ? props.beforeCallBack : false,
        verifyCallBack: props.verifyCallBack ? props.verifyCallBack : false,
        useModel: props.useModel ? true : false,
        content: props.content ? props.content : '确认要继续操作此项吗?',
        afterCallBack: props.afterCallBack ? props.afterCallBack : '',
        show: false,
        res: props.res ? props.res : false,
      }
    }

    //关闭/打开 警告提示窗口,判断提示框显示时，是否需要验证操作
    showMdel = () => {
      if (!this.props.verifyCallBack || this.props.verifyCallBack()) {
        this.setState({
          visible: !this.state.visible
        })
      }
    }

    componentDidMount() {
      let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      if(userInfo.funcCodes){
        // 判断res是否存在 权限列表中，存在放行 或者 未赋予按钮res 一律放行
        if (userInfo.funcCodes.indexOf(this.state.res)>0 || this.state.res==false) {
          this.setState({
            show:true
          })
        }
      }
    }

    //提示窗口 确认按钮操作
    handleOk = () => {
      this.setState({
        visible: !this.state.visible
      })
      this.props.afterCallBack();
    }
    handleClick = (a,b) => {
      this.props.afterCallBack(a,b);
    }
    render() {
        const menu = (
            <Menu>
              {
                this.state.menus.map((m, i) =>{
                    const {key,icon,label,edit} = m;
                    let edit_ = edit == undefined ? true : edit;
                    return(
                      <Menu.Item key={key} disabled={!edit_} onClick={this.handleClick.bind(this,key)}>
                        <MyIcon type={icon}/>{label}
                      </Menu.Item>
                    )
                })
              }
            </Menu>
        );
        return (
            <span className={`topBtnActivity ${style.main}`}>
                <MyIcon type={this.props.icon} />
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" href="#"> {this.state.title}  <Icon type="caret-down" /></a>
                </Dropdown>
                <Modal
                    width={350}
                    title={this.state.title}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    centered={true}
                    onCancel={this.showMdel}
                >
                  <p style={{textAlign: 'center', fontSize: 18, paddingTop: 10, paddingBottom: 10}}>
                    <Icon type="warning"
                          style={{
                            fontSize: 30,
                            color: '#faad14'
                          }}/> &nbsp;{this.state.content ? this.state.content : '确认要继续操作此项吗？'}
                  </p>
                </Modal>
            </span>

        )
    }
}

export default PublicMenuButton
