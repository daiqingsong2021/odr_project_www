import React from 'react'
import style from './style.less'
import { Icon ,Menu,Dropdown} from 'antd'

class SolveTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      const menu = (
        <Menu onClick={this.props.onClickHandle.bind(this, 'SolveTopBtn')}>
            <Menu.Item key="1">
              <Icon type="export" />直接解决
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="select" />解决审批
            </Menu.Item>
        </Menu>
    );
    return (
        <span  className={`topBtnActivity ${style.main}`}>
            <Icon type="copy" />
            <Dropdown overlay={menu}>
                <a className="ant-dropdown-link" href="#"> 解决 <Icon type="down" /></a>
            </Dropdown>
        </span>
    )
    }
  }

  export default SolveTopBtn
