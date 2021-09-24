import React, { Component } from 'react'
import { Form, Row, Col, Input, Button,  Select, InputNumber } from 'antd';
import intl from 'react-intl-universal'
import { connect } from 'react-redux'
import { curdCurrentData } from '../../../../store/curdData/action'
import axios from '../../../../api/axios';
import { getPlanDelvInfo,getPlanPbsById} from '../../../../api/api';
const Option = Select.Option;
const { TextArea } = Input;
import LabelFormLayout from "../../../../components/public/Layout/Labels/Form/LabelFormLayout"
import LabelFormButton from "../../../../components/public/Layout/Labels/Form/LabelFormButton"


class MenuInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            info: {}
        }
    }

    componentDidMount() {
        this.getInfo();
    }
    //获取pbs或交付物基本信息
    getInfo = () => {
      const { rightData, delivType } = this.props;
      if(rightData && rightData.type == 'pbs'){
          axios.get(getPlanPbsById(this.props.rightData.id)).then(res => {
              this.setState({
                info: res.data.data
              })
          })
      }else if(rightData && rightData.type == 'delv'){
        axios.get(getPlanDelvInfo(this.props.rightData.id)).then(res => {
          this.setState({
            info: res.data.data
          })
        })
      }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            const { rightData } = this.props
            if (!err) {
                const data = {
                    ...rightData,
                    ...values
                }
                if (rightData['type'] == 'delv') {
                    // 修改交付物
                    this.props.updatePlanDelv(data)
                } else {
                    // 修改PBS
                    this.props.updatePlanPbs(data)
                }
            }
        });
    }

    render() {
        const { rightData } = this.props
        const {
            getFieldDecorator
        } = this.props.form;
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
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        return (

          <LabelFormLayout title = {this.props.title} >
            <Form onSubmit={this.handleSubmit}>

              <Row type="flex">
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.pre.epsInfo.projectname')} {...formItemLayout}>
                    {getFieldDecorator('delvTitle', {
                      initialValue: this.state.info.delvTitle,
                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.pre.epsInfo.projectname'),
                      }],
                    })(
                      <Input maxLength={66}/>
                    )}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={intl.get('wsd.i18n.pre.epsInfo.projectcode')} {...formItemLayout}>
                    {getFieldDecorator('delvCode', {
                      initialValue: this.state.info.delvCode,
                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.pre.epsInfo.projectcode'),
                      }],
                    })(
                      <Input maxLength={66}/>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              {
                rightData['type'] == 'delv' && <Row >
                  <Col span={12}>
                    <Form.Item label={intl.get('wsd.i18n.sys.menu.menutype')} {...formItemLayout}>
                      {getFieldDecorator('delvType', {
                        initialValue: this.state.info.delvTypeVo ? this.state.info.delvTypeVo.id : '',
                        rules: [],
                      })(
                        <Select>
                          {
                            this.props.delivType.map((v, i) => {
                              return <Option value={v.value} key={i}>{v.title}</Option>
                            })
                          }
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="计划交付数量" {...formItemLayout}>
                      {getFieldDecorator('delvNum', {
                        initialValue: this.state.info.delvNum,
                        rules: [],
                      })(
                        <InputNumber min={0} max={100} style={{width:"100%"}} />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              }
              <Row >
                <Col span={24}>
                  <Form.Item label={intl.get('wsd.i18n.plan.activitydefine.remark')} {...formItemLayout1}>
                    {getFieldDecorator('remark', {
                      initialValue: this.state.info.remark,
                      rules: [],
                    })(
                      <TextArea rows={2} maxLength={85}/>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <LabelFormButton>
              <Button disabled={!this.props.editAuth} onClick={this.handleSubmit} style={{ width: "100px" }} type="primary">保存</Button>
              <Button onClick={this.props.closeRightBox} style={{ width: "100px", marginLeft: "20px" }}>取消</Button>
            </LabelFormButton>
          </LabelFormLayout>
        )
    }
}
const MenuInfos = Form.create()(MenuInfo);
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {
        curdCurrentData
    })(MenuInfos);
