import React, { Component } from 'react'
import style from './style.less'
import { Icon, Button, Tooltip, Modal, Row, Col } from 'antd';
import axios from "../../../../../api/axios"
import {tmmOpen} from "../../../../../api/api"
import { connect } from 'react-redux'
export class SysAgreement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isagree: false
        }
    }
    //开启权限
    openOption=()=>{
        axios.get(tmmOpen(1),null,true).then(res=>{
            this.props.ishasagree()
        })
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {

        this.setState({
            visible: false,
        });
        axios.get(tmmOpen(0),null,true).then(res=>{
            this.props.ishasagree()
        })
     
    }

    handleCancel = (e) => {
      
        this.setState({
            visible: false,
        });
    }
    render() {
        const { intl } = this.props.currentLocale
        const text = <span style={{ color: '#3c8dff' }}>{intl.get("wsd.i18n.sys.three.agreement1")}</span>;
        return (

            <div className={style.main}>
                {this.props.isagree &&
                    <span className={style.agreementExit}>
                        <Tooltip placement="left" title={text} className={style.tip}>
                            <Icon type="poweroff" style={{ fontSize: 15, color: '#3c8dff' }} onClick={this.showModal} />
                        </Tooltip>
                        <Modal
                            title={intl.get("wsd.i18n.sys.three.agreement2")}
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            mask={false}
                            centered={true}
                            maskClosable={false}
                            footer={ 
                                <div className="modalbtn">
                                 <Button key={3} onClick={this.handleOk} type="primary">{intl.get("wsd.global.btn.sure")}</Button>
                                <Button key={2}  onClick={this.handleCancel} >{intl.get("wsd.global.btn.cancel")}</Button>
                                </div>
                            }
                        >
                            <div className={style.tiptext}>
                                <h3>{intl.get("wsd.i18n.sys.three.agreementr")}</h3>
                                <p>{intl.get("wsd.i18n.sys.three.agreement3")}</p>
                            </div>

                        </Modal>
                    </span>}
                <div className={style.agreementAccredit}>
                    <Row>
                        <Col span={10} offset={7}>

                            <div className={style.agreementAccept}>
                                <img src="/static/images/members.png" />
                                <div className={style.setroleRules}>
                                    <p>{intl.get("wsd.i18n.sys.three.agreementy")}</p>
                                    <p>{intl.get("wsd.i18n.sys.three.agreement23")}</p>
                                    <p>{intl.get("wsd.i18n.sys.three.agreementw")}</p>
                                    <p>{intl.get("wsd.i18n.sys.three.agreement4")}</p>
                                    <p>{intl.get("wsd.i18n.sys.three.agreement5")}</p>
                                </div>
                                {!this.props.isagree &&
                                    <Button type="primary" block size="large" onClick={this.openOption}>{intl.get("wsd.i18n.sys.three.agreement6")}</Button>
                                }
                                {
                                    this.props.isagree &&
                                    <div className={style.agreementIcon}>
                                        <Icon type="check" />
                                        <span><strong>{intl.get("wsd.i18n.sys.three.agreement7")}</strong></span>
                                    </div>
                                }

                            </div>
                        </Col>
                    </Row>
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
  
  
  export default connect(mapStateToProps, null)(SysAgreement);