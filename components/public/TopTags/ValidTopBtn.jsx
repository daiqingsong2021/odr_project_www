import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class ValidTopBtn extends React.Component {
    constructor(props) {
      super(props)
    }

    render() {
      const MyIcon = Icon.createFromIconfontCN({
        scriptUrl: '/static/icons/iconfont.js', // 在 iconfont.cn 上生成
      });
      return (
        <span  className={`topBtnActivity ${style.main}`}>
            {/* <Icon type="profile" /> */}
            <MyIcon type='icon-biaoge1' style={{ fontSize: '18px' }} />
            <a className="ant-dropdown-link" href="#"> 有效</a>
        </span>
      )
    }
  }

  export default ValidTopBtn
