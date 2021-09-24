
/*
* @IconType：图标类型*/
import React from 'react'
import { Icon } from 'antd'
const Icons =({IconType})=>{
    <Icon type={IconType}></Icon>
}
Mbutton.propTypes = {
    IconType:React.PropTypes.string,
}
export default Icons
