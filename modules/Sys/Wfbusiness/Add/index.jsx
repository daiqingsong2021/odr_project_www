import React, { Component } from 'react';
import style from './style.less';
import { Modal, Button, Form, Row, Col, Input } from 'antd';
import axios from '../../../../api/axios'
import { wfBizTypeAdd } from '../../../../api/api'


import { connect } from 'react-redux';



class WfAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {},
    };
  }



  componentDidMount() {

  }


  handleSubmit = (val, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {

        axios.post(wfBizTypeAdd, fieldsValue, true, '新增成功').then(res => {
          this.props.addData(res.data.data);
          if (val == 'save') {
            this.props.handleCancel();
          } else{
            this.props.form.resetFields();
          }

        })

      }
    });
  };

  render() {
    const { intl } = this.props.currentLocale;
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };
    return (
      <div>
        <Modal
          title={this.props.modelTitle}
          visible={this.props.modalVisible}
          onCancel={this.props.handleCancel}
          footer={<div className="modalbtn">
            <Button key={1} onClick={this.handleSubmit.bind(this, 'goOn')} >保存并继续</Button>
            <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">保存</Button>

          </div>}
          width="850px"
          centered={true}
          className={style.main}
        >

          <Form onSubmit={this.handleSubmit}>
            <div className={style.content}>
              <Row type="flex">

                <Col span={24}>
                  <Form.Item label={intl.get('wsd.i18n.sys.wfbusiness.wfcode')} {...formItemLayout}>
                    {getFieldDecorator('typeCode', {
                      initialValue: this.state.info.wfCode,
                      rules: [{
                        required: true,
                        message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.wfbusiness.wfcode'),
                      }],
                    })(
                      <Input />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row> <Col span={24}>
                <Form.Item label={intl.get('wsd.i18n.sys.wfbusiness.wfname')} {...formItemLayout}>
                  {getFieldDecorator('typeName', {
                    initialValue: this.state.info.wfName,
                    rules: [{
                      required: true,
                      message: intl.get('wsd.i18n.message.enter') + intl.get('wsd.i18n.sys.wfbusiness.wfname'),
                    }],
                  })(
                    <Input />,
                  )}
                </Form.Item>
              </Col>
                <Col span={24}>
                  <Form.Item label={intl.get('wsd.i18n.sys.wfbusiness.wfurl')} {...formItemLayout}>
                    {getFieldDecorator('url', {
                      initialValue: this.state.info.wfUrl,
                      rules: [],
                    })(
                      <Input />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row> <Col span={24}>
                <Form.Item label={intl.get('wsd.i18n.sys.wfbusiness.wfevents')} {...formItemLayout}>
                  {getFieldDecorator('event', {
                    initialValue: this.state.info.wfEvents,
                    rules: [],
                  })(
                    <Input />,
                  )}
                </Form.Item>
              </Col>
                <Col span={24}>
                  <Form.Item label={intl.get('wsd.i18n.sys.wfbusiness.modecode')} {...formItemLayout}>
                    {getFieldDecorator('moduleCode', {
                      initialValue: this.state.info.modeCode,
                      rules: [],
                    })(
                      <Input />,
                    )}
                  </Form.Item>
                </Col>

              </Row>
            </div>

          </Form>

        </Modal>
      </div>
    );
  }
}


const WfAdds = Form.create()(WfAdd);
export default connect(state => ({
  currentLocale: state.localeProviderData
}))(WfAdds);
