import React, { Component } from 'react'
import style from './style.less'
import { Form, Row, Col, Input, Button, Select, Modal } from 'antd';
import intl from 'react-intl-universal'
import { connect } from 'react-redux'
import { prepaProjectteamAdd } from '../../../../api/api';
import axios from "../../../../api/axios"
import * as dataUtil from "../../../../utils/dataUtil";
const Option = Select.Option;
class ProjTeamAdd extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            info: {},
            visiable:true
        }
    }
    handleCancel = (e) => {
        this.props.handleCancel()
    }

    // 点击下拉框
    onTypeChange = (bo, e) => {
      let flag = "org"== bo ? true : false;
      this.setState({
        visiable:flag
      });
    }

    handleSubmit = (bo, e) => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
            let ec5 = values['extendedColumn5'];
            values['extendedColumn5'] = dataUtil.Arr().toString(ec5);
            let data = {
              ...values,
              parentId: this.props.rightData.id == this.props.projectId ? null : this.props.rightData.id,
              bizType: 'project',
              bizId: this.props.projectId.toString()
            }
            
            axios.post(prepaProjectteamAdd, data, true).then(res => {
              /**/
              this.props.addProjTeam(res.data.data,bo)
              if (bo) {
                this.props.form.resetFields()
              } else {
                this.props.handleCancel()
              }
            })
        }
      });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
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

                <Modal title={this.props.title} visible={true} mask={false}
                    maskClosable={false} onCancel={this.props.handleCancel} width="800px" footer={
                        <div className="modalbtn">
                            <Button key={3} onClick={this.handleSubmit.bind(this, true)} >保存并继续</Button>
                            <Button key={2} onClick={this.handleSubmit.bind(this, false)} type="primary" >保存</Button>
                        </div>
                    }
                >
                    <Form onSubmit={this.handleSubmit}>
                        <div className={style.content}>
                           <Row type="flex">
                            <Col span={12}>
                              <Form.Item label={intl.get('wsd.i18n.base.planTemAddTask.name')} {...formItemLayout}>
                                {getFieldDecorator('teamName', {
                                  initialValue: this.state.info.teamName,
                                  rules: [{
                                    required: true,
                                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.planTemAddTask.name'),
                                  }],
                                })(
                                  <Input />
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={12}>
                              <Form.Item label={intl.get('wsd.i18n.base.planTemAddTask.code')} {...formItemLayout}>
                                {getFieldDecorator('teamCode', {
                                  initialValue: this.state.info.teamCode,
                                  rules: [{
                                    required: true,
                                    message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.base.planTemAddTask.code'),
                                  }],
                                })(
                                  <Input />
                                )}
                              </Form.Item>
                            </Col>
                           </Row>
                            <Row type="flex">
                              <Col span={12}>
                                <Form.Item label="类别" {...formItemLayout}>
                                  {getFieldDecorator('extendedColumn1', {
                                    initialValue: 'org',
                                    rules: [{
                                      required: true,
                                      message: '类别必须有值',
                                    }],
                                  })(
                                    <Select onChange={this.onTypeChange}>
                                      <Option value='org' key='org'>组织</Option>
                                      <Option value='section' key='section'>标段</Option>
                                    </Select>
                                  )}
                                </Form.Item>
                              </Col>
                              {this.state.visiable &&
                                <Col span={12}>
                                  <Form.Item label="单位类型" {...formItemLayout}>
                                    {getFieldDecorator('extendedColumn3', {
                                      initialValue: '',
                                      rules: [{
                                        required: true,
                                        message: '单位类型必须有值',
                                      }],
                                    })(
                                      <Select>
                                        {
                                          this.props.orgType&&this.props.orgType.map((v, i) => {
                                            return <Option value={v.value} key={i}>{v.title}</Option>
                                          })
                                        }
                                      </Select>
                                    )
                                    }
                                  </Form.Item>
                                </Col>
                              }
                              {!this.state.visiable &&
                              <Col span={12}>
                                <Form.Item label="标段类型"  onDropdownVisibleChange={this.getRole} {...formItemLayout}>
                                  {getFieldDecorator('extendedColumn2', {
                                    initialValue: '',
                                    rules: [],
                                  })(
                                    <Select>
                                      {
                                        this.props.section.map((v, i) => {
                                          return <Option value={v.value} key={i}>{v.title}</Option>
                                        })
                                      }
                                    </Select>
                                  )}
                                </Form.Item>
                              </Col>
                              }
                            </Row>
                          <Row type="flex">
                            {this.state.visiable &&
                              <Col span={12}>
                                <Form.Item label="单位分类" {...formItemLayout}>
                                  {getFieldDecorator('extendedColumn4', {
                                    initialValue: '',
                                    rules: [],
                                  })(
                                    <Select>
                                      {
                                        this.props.orgClassification&&this.props.orgClassification.map((v, i) => {
                                          return <Option value={v.value} key={i}>{v.title}</Option>
                                        })
                                      }
                                    </Select>
                                  )}
                                </Form.Item>
                              </Col>
                            }
                            {!this.state.visiable &&
                            <Col span={12}>
                              <Form.Item label="专业" {...formItemLayout}>
                                {getFieldDecorator('extendedColumn5', {
                                  initialValue: [],
                                  rules: [],
                                })(
                                  <Select mode="multiple">
                                    {
                                      this.props.professional&&this.props.professional.map((v, i) => {
                                        return <Option value={v.value} key={i}>{v.title}</Option>
                                      })
                                    }
                                  </Select>
                                )}
                              </Form.Item>
                            </Col>
                            }
                          </Row>

                        </div>
                    </Form>
                </Modal>
            </div>
        )
    }
}
const ProjTeamAdds = Form.create()(ProjTeamAdd);
export default connect(state => ({
    currentLocale: state.localeProviderData
}), {

    })(ProjTeamAdds);
