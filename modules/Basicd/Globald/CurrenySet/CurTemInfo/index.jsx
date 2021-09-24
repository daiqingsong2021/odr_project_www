import React, {Component} from 'react'

import {Form, Row, Col, Input, Button, Icon, Select, DatePicker} from 'antd'
import intl from 'react-intl-universal'
import moment from 'moment';
const locales = {
  "en-US": require( '../../../../../api/language/en-US.json' ),
  "zh-CN": require( '../../../../../api/language/zh-CN.json' )
}
const FormItem = Form.Item;
const { TextArea } = Input;
class CurTemInfo extends Component {
  constructor(props) {
    super( props )
    this.state = {
      initDone: false,
      info: {
        currName: '比特率',
        currCode: 1,
        currSymbol: 1,
        rate: 1,
        creatTime: 1,
        creator: 1,
        currBase: 1,
        remark: 1,
      }
    }
  }

  componentDidMount() {
    this.loadLocales();
    this.setState( {
                     width: this.props.width
                   } )
  }

  loadLocales() {
    intl.init( {
                 currentLocale: 'zh-CN',
                 locales,
               } )
      .then( () => {
        // After loading CLDR locale data, start to render
        this.setState( {initDone: true} );
      } );
  }

  handleSubmit = (e) => {
    e.preventDefault();
    alert( 1 )
    this.props.form.validateFieldsAndScroll( (err,values) => {
      if (!err) {
      }
    } );
  }

  render() {
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
      } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 8},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
      },
    };
    const formItemLayout2 = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 20},
      },
    };
    return (
      <div className={style.main}>
        <Form onSubmit={this.handleSubmit}>
          <div className={style.content}>
            <Row >
              <Col span={12}>
                <Form.Item label={intl.get('wsd.i18n.base.currency.currname')} {...formItemLayout}>
                  {getFieldDecorator( 'currName',{
                    initialValue: this.state.info.currName,
                    rules: [ {
                      required: true,
                      message: intl.get( 'wsd.i18n.message.enter' ) + intl.get( 'wsd.i18n.base.currency.currname' ),
                    } ],
                  } )(
                    <Input/>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={intl.get('wsd.i18n.base.currency.currcode')} {...formItemLayout}>
                  {getFieldDecorator( 'currCode',{
                    initialValue: this.state.info.currCode,
                    rules: [],
                  } )(
                    <Input/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row> <Col span={12}>
              <Form.Item label={intl.get('wsd.i18n.base.currency.currsymbol')} {...formItemLayout}>
                {getFieldDecorator( 'currSymbol',{
                  initialValue: this.state.info.currSymbol,
                  rules: [],
                } )(
                  <Input/>
                )}
              </Form.Item>
            </Col>
              <Col span={12}>
                <Form.Item label={intl.get('wsd.i18n.base.currency.rate')} {...formItemLayout}>
                  {getFieldDecorator( 'rate',{
                    initialValue: this.state.info.rate,
                    rules: [],
                  } )(
                    <Input/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label={intl.get('wsd.i18n.base.currency.creattime')} {...formItemLayout}>
                  {getFieldDecorator( 'creatTime',{
                    initialValue: moment( this.state.info.creatTime ),
                    rules: [],
                  } )(
                    <DatePicker style={{width:'100%'}}/>
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={intl.get('wsd.i18n.base.currency.creator')} {...formItemLayout}>
                  {getFieldDecorator( 'creator',{
                    initialValue: this.state.info.creator,
                    rules: [],
                  } )(
                    <Input/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label={intl.get('wsd.i18n.base.currency.remark')} {...formItemLayout2}>
                  {getFieldDecorator( 'remark',{
                    initialValue: this.state.info.remark,
                    rules: [],
                  } )(
                    <TextArea rows={4}/>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={4} offset={4}>
                <Button onClick={this.handleSubmit} type="primary">保存</Button>
              </Col>
              <Col span={4}>
                <Button>取消</Button>
              </Col>
            </Row>
          </div>

        </Form>
      </div>
    )
  }
}
const CurTemInfos = Form.create()( CurTemInfo );
export default CurTemInfos
