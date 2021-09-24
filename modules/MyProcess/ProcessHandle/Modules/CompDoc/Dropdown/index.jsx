import React, { Component } from 'react'
import style from './style.less'
import { Menu, Button, Icon } from 'antd'
import MyIcon from '../../../../../../components/public/TopTags/MyIcon'


class Drop extends Component {

    componentDidMount() {

    }

    handleCancel() {
        this.props.handleCancel
    }

    click = (v, id) => {
        this.props.handleCancel(v, id)
    }

    render() {
        const X = this.props.X;
        const Y = this.props.Y;
        return (
            <div className={style.main} style={{ left: X, top: Y }}>
                <div>
                    <Menu>
                        <Menu.Item onClick={this.click.bind(this, 'mangageDoc')}>
                            <MyIcon type="icon-wenjianjiaguanli" />
                            管理文件夹
                        </Menu.Item>

                    </Menu>
                </div>


            </div>
        )
    }
}

export default Drop