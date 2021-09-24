import React from 'react'
import style from './style.less'
import { Icon } from 'antd'
import MyIcon from './MyIcon'

class Distribute extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <span  className={`topBtnActivity ${style.main}`} onClick={this.props.onClickHandle.bind(this, 'Distribute')}>
                <MyIcon type='icon-fenfa' style={{ fontSize: '18px' }} className='my-icon'/>
                <a className="ant-dropdown-link" href="#"> 分发</a>
            </span>
        )
    }
}

export default Distribute
