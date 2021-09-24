import React, { Component } from 'react';
import style from './style.less';
import { connect } from 'react-redux';
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Icon,
  Select,
  DatePicker,
  Modal,
  message,
  Switch, notification,
} from 'antd';
import intl from 'react-intl-universal';
import axios from '../../../../api/axios';
import { addDocUserGroup,getUserGroupInfo, orgPer, updateDocUserGroup } from '../../../../api/api';
import { planProAuthTree } from '../../../../api/suzhou-api';


const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;
export class AddBusinessObject extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    const { type, data } = this.props;
    if (type == "modify") {
        this.groupInfo();
    }
  }

  groupInfo = () => {
      axios.get(getUserGroupInfo(this.props.data.id)).then(res => {
        this.setState({
          info: res.data.data,
        })
      })
}

  handleSubmit = e => {
    e.preventDefault();
    const { type, data } = this.props
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //新增
        if (type == "add") {
          let info = {
            ...values
          }
          axios.post(addDocUserGroup, info, true).then(res => {
            this.props.addGroup(res.data.data)
            this.props.form.resetFields();
            this.props.handleCancel()
          })
          return
        }
        //修改
        if (type == "modify") {
          let info = {
            ...data,
            ...values
          }
          axios.put(updateDocUserGroup, info, true).then(res => {
            this.props.updateGroup(res.data.data)
            this.props.handleCancel()
          })
        }
      }
    });
  };

  render() {
    const { intl } = this.props.currentLocale
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
        {/* <h2>{intl.get('wbs.add.name')}</h2>*/}
        <Modal
//          className={style.formMain}
          width="650px"
          mask={false}
          maskClosable={false}
          centered={true}
          title={this.props.title}
          visible={true}
          onCancel={this.props.handleCancel}
          footer={
            <div className="modalbtn">
              {this.props.type == "add" &&
                <div>
                  <Button key="submit1" onClick={this.handleSubmit}>
                    {intl.get("wsd.global.btn.saveandcontinue")}
                  </Button>
                  <Button key="submit2" type="primary" onClick={this.handleSubmit}>
                    {intl.get("wsd.global.btn.preservation")}
                  </Button>
                </div>
              }
              {this.props.type == "modify" &&
                <div>
                  <Button key="submit1" onClick={this.props.handleCancel}>
                    {intl.get("wsd.global.btn.cancel")}
                  </Button>
                  <Button key="submit2" type="primary" onClick={this.handleSubmit}>
                    {intl.get("wsd.global.btn.preservation")}
                  </Button>
                </div>
              }
            </div>
          }
        >
          <Form onSubmit={this.handleSubmit}>
            <div className={style.content}>
              <Row>
                <Col span={20}>
                  <Form.Item label={"组名"} {...formItemLayout}>
                    {getFieldDecorator('groupName', {
                      initialValue: this.state.info ? this.state.info.groupName : null,
                      rules: [
                        {
                          required: true,
                          message:
                            intl.get('wsd.i18n.message.enter') +
                            "组名",
                        },
                      ],
                    })(<Input maxLength={21}/>)}
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
const AddBusinessObjects = Form.create()(AddBusinessObject);

export default connect(state => ({ currentLocale: state.localeProviderData }))(AddBusinessObjects);
