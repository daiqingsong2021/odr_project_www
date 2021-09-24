import React from 'react'
import style from './style.less'
import { Icon } from 'antd'

class ExportTableTopBtn extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const MyIcon = Icon.createFromIconfontCN({
      scriptUrl: '/static/icons/iconfont.js', // 在 iconfont.cn 上生成
    });
    return (
      <span  className={`topBtnActivity ${style.main}`}>
        <MyIcon type='icon-biaoge1' style={{ fontSize: '18px' }} />
        <a className="ant-dropdown-link" href="#"> 导出表格</a>
      </span>
    )
  }
}

export default ExportTableTopBtn
