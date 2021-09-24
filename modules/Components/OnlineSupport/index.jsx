import React, { Component } from 'react'

import { connect } from 'react-redux';

import { Table, Col, Input, Row, Select } from 'antd';
import MyIcon from "../../../components/public/TopTags/MyIcon"
import style from './style.less';

class CodeRule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            info: {}
        }
    }


    render() {
        const { intl } = this.props.currentLocale

        return (
            <div className={style.main} style={{ height: this.props.height + 40 }}>
                <div className={style.back}>
                    <div className={style.help}>
                        <main>
                            <h1>有问题？</h1>
                            <h2 className={style.content}>在线系统管理员会尽快回复你</h2>
                            <div className={style.content1}>
                                <div>
                                    <p className={style.phone}>+86 400-060-2325</p>
                                    <span>周一到周日 8：00~ 20：00</span>
                                </div>
                                <MyIcon type="icon-jianzhuanquan-" style={{fontSize:65}}/>
                            </div>
                        </main>
                        <aside><MyIcon type="icon-service"  style={{fontSize:250,marginLeft: 80}}/></aside>
                    </div>


                </div>

            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};


export default connect(mapStateToProps, null)(CodeRule);