import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Icon, InputNumber } from 'antd';
import axios from "../../../../../api/axios"
import { connect } from 'react-redux';
import { tmmInfo,tmmRuleset} from "../../../../../api/api"
const FormItem = Form.Item;
class PasswardInfo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      info:{}
    }
  }

  componentDidMount() {
    this.setState({
      width: this.props.width
    })
    this.gettmmInfo()
  }
  //获取密码设置
  gettmmInfo=()=>{
    axios.get(tmmInfo).then(res=>{
        if(res.data.data){
          this.setState({
            info:res.data.data
          })
        }


    })
    
  }
  //保存密码规则设置
  upSet=(e)=>{
    const body={
      id:this.state.info.id,
      cycle:e.cycle,
      length:e.length,
      errorNumber:e.errorNumber,
      lockTime:e.lockTime
    }
    axios.put(tmmRuleset,body,true).then(res=>{
    })
  
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      this.upSet(values);
      if (!err) {
      }
    });
  }
  render() {
    const { intl } = this.props.currentLocale
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched, } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <div className={style.main}>

        <Form onSubmit={this.handleSubmit}>
          <div className={style.content}>
            <Row  type="flex">
              <Col span={18}>
                <Form.Item label={intl.get("wsd.i18n.sys.three.cycle")} {...formItemLayout}>
                  {getFieldDecorator('cycle', {
                    initialValue: this.state.info.cycle,
                    rules: [],
                  })(
                    <InputNumber style={{width:"100%"}} precision={0} step={0} min={0} max={99999999999}/>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>

                <div className={style.list}>
                  <span>{intl.get("wsd.i18n.sys.three.dayunit")}</span>
                </div>

              </Col>
            </Row>
            <Row  type="flex">
              <Col span={18}>
              <Form.Item label={intl.get("wsd.i18n.sys.three.length")} {...formItemLayout}>
                  {getFieldDecorator('length', {
                    initialValue: this.state.info.length,
                    rules: [],
                  })(
                    <InputNumber style={{width:"100%"}} precision={0} step={0} min={0} max={99999999999}/>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>

                <div className={style.list}>
                  <span>{intl.get("wsd.i18n.sys.three.position")}</span>
                </div>

              </Col>
            </Row>
            <Row  type="flex">
              <Col span={18}>
              <Form.Item label={intl.get("wsd.i18n.sys.three.errorNumber")}{...formItemLayout}>
                  {getFieldDecorator('errorNumber', {
                    initialValue: this.state.info.errorNumber,
                    rules: [],
                  })(
                    <InputNumber style={{width:"100%"}} precision={0} step={0} min={0} max={99999999999}/>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>
                <div className={style.list}>
                  <span>{intl.get("wsd.i18n.sys.three.time")}</span>
                </div>

              </Col>
            </Row>
            <Row  type="flex">
              <Col span={18}>
              <Form.Item label={intl.get("wsd.i18n.sys.three.lockTime")} {...formItemLayout}>
                  {getFieldDecorator('lockTime', {
                    initialValue: this.state.info.lockTime,
                    rules: [],
                  })(
                    <InputNumber style={{width:"100%"}}  precision={0} step={0} min={0} max={99999999999}/>
                  )}
                </Form.Item>
              </Col>
              <Col span={6}>

                <div className={style.list}>
                  <span>{intl.get("wsd.i18n.sys.three.minutes")}</span>
                </div>

              </Col>
              
            </Row>
            <Row  type="flex">
              <Col span={18} offset={6}>
                    <Button  onClick={this.handleSubmit} type="primary" style={{padding: "0 34px"}}>{intl.get("wsd.i18n.sys.three.updateset")}</Button>
              </Col>          
            </Row>
          </div>

        </Form>
      </div>
    )
  }
}
const PasswardInfos = Form.create()(PasswardInfo);
export default connect(state => ({ currentLocale: state.localeProviderData }))(PasswardInfos);
