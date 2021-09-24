import React, {Component} from 'react'
import intl from 'react-intl-universal'
import {Table} from 'antd'
import style from './style.less'
import DeleteTopBtn from "../../../../../components/public/TopTags/DeleteTopBtn"
import AddTopBtn from "../../../../../components/public/TopTags/AddTopBtn"
import ModifyTopBtn from "../../../../../components/public/TopTags/ModifyTopBtn"
class DigButton extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
        this.onClickHandle=this.onClickHandle.bind(this);

    }
    onClickHandle=(e)=>{
    }

    render() {

        return (
            <div className={style.main}>
                <AddTopBtn onClickHandle={this.onClickHandle}></AddTopBtn>
                <DeleteTopBtn onClickHandle={this.onClickHandle}></DeleteTopBtn>
                <ModifyTopBtn onClickHandle={this.onClickHandle}></ModifyTopBtn>
            </div>
        )
    }
}

export default DigButton
