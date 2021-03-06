import React, { Component } from 'react'
import style from './style.less'
import { Modal, Menu, Icon } from 'antd'
import MyIcon from '../../../../../components/public/TopTags/MyIcon'


class Drop extends Component {

    state={
        visible: false,
    }

    componentDidMount() {
    }

    click = (v, record) => {
        this.props.handleCancel(v, record)
    }


    onClickHandle = (name) => {
        this.props.openDeleteModal()
    }

   
  

    render() {
        const X = this.props.X;
        const Y = this.props.Y;
        return (
            <div >
                <div className={style.main} style={{ left: X, top: Y }}>
                    <div>
                        <Menu>
                            <Menu.Item onClick={this.click.bind(this, 'amend', this.props.record)}>
                                <MyIcon type="icon-xiugaibianji" />
                                修改
                            </Menu.Item>
                            <Menu.Item onClick={this.onClickHandle} >
                                <MyIcon type="icon-delete" />
                                删除
                            </Menu.Item>

                            <Menu.Item onClick={this.click.bind(this, 'add', this.props.record)}>
                                <MyIcon type="icon-add" />
                                新增文件夹
                            </Menu.Item>
                          
                        </Menu>
                    </div>


                </div>


            </div>
        )
    }
}

export default Drop