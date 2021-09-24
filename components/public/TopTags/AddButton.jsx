
/*
* @text：按钮名称
* @MbuttonEven:按钮的点击事件 */
import React from 'react'
import {Button} from 'antd'
const Mbutton=({text,MbuttonEven})=>{
    <Button onClick={MbuttonEven}>{text}</Button>
}

Mbutton.propTypes = {
    text:React.PropTypes.string,
    MbuttonEven: React.PropTypes.func,

}

export default Buttons
