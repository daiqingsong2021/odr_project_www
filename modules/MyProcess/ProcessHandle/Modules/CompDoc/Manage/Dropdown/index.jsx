import React, { Component } from 'react'
import style from './style.less'
import { Modal, Menu, Icon } from 'antd'
import MyIcon from '../../../../../../../components/public/TopTags/MyIcon'


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
        this.props.handleCancel('delete', this.props.record)
    }

    showDeleteConfirm = () => {
        this.setState({
            visible: !this.state.visible
        })
    }
    handleOk = () => {
        this.setState({
            visible: !this.state.visible
        })
        this.onClickHandle()
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
                            <Menu.Item onClick={this.showDeleteConfirm} >
                                <MyIcon type="icon-delete" />
                                删除
                            </Menu.Item>

                            <Menu.Item onClick={this.click.bind(this, 'add', this.props.record)}>
                                <MyIcon type="icon-add" />
                                新增文件夹
                            </Menu.Item>
                            <Menu.Item onClick={this.click.bind(this, 'temToImport')}>
                                <MyIcon type="icon-daoru" />
                                模板导入
                            </Menu.Item>
                        </Menu>
                    </div>


                </div>

                <Modal
                    width={350}
                    title="删除"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.showDeleteConfirm}
                >
                    <p style={{ textAlign: 'center', fontSize: 18, paddingTop: 10, paddingBottom: 10 }}>
                        <Icon type="warning"
                            style={{
                                fontSize: 30,
                                color: '#faad14'
                            }} /> &nbsp;{this.props.deleteDesc ? this.props.deleteDesc : '确认要删除此项吗？'}
                    </p>
                </Modal>

            </div>
        )
    }
}

export default Drop