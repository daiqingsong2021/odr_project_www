import React,{Component} from 'react'

import {Modal} from 'antd'

export default class FileDetail extends Component{
    constructor(props){
        super(props)
        this.state={}
    }

    render(){
        const{visible} = this.props
        return(
            <div>
                <Modal title='附件明细' visible={visible}/>
            </div>
        )
    }
}