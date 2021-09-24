/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:35:16
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-02-28 15:02:48
 */

import React from 'react'
import { Button } from 'antd';


class SubmitButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            flag:false
        }
    }
    componentDidMount(){
        //组件在被挂载后将_isMounted的值更新为true，表示已挂载
      this._isMounted = true;
    }
    componentWillUnmount() {
        //在组件被卸载时将_isMounted更新为false，表示组件已卸载
        console.log("卸载。。。")
        this._isMounted = false;
      }
    handleClick =(e) => {  
        let timer = -1;
        e.preventDefault();
        if (!this.state.flag) {
            this.setState({
                flag:true
            },()=>{
                this.props.onClick()
                clearTimeout(timer);
                let _this=this
                timer = setTimeout(function() {
                    if(_this._isMounted){
                        _this.setState({flag:false})
                    }
                }, this.props.period || 1000);
            })      
        }
    }
    render() {
        let disabled = this.props.edit == false || this.state.flag;
        return <Button onClick={this.handleClick} disabled={disabled} type={this.props.type} style={{width:this.props.width? this.props.width:null}}>{this.props.content}</Button>
    }
}

export default SubmitButton
