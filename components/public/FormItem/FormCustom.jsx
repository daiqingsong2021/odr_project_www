import React, { Component } from 'react';
import { Row, Col} from 'antd';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormTreeSelect from './FormTreeSelect';
import FormDate from './FormDate';
import FormCheckGroup from './FormCheckGroup'
import FormRadioGroup from './FormRadioGroup'
import FormNumber from './FormNumber'
import FormTextArea from './FormTextArea'

export class FormCustom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data : [],
      fromItems : []
    };
  }

  componentDidMount() {

  }

  render() {
    const formItemLayout = this.props.formItemLayout || {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      }
    };
    return (
      <>
        {
          this.props.formItems.map((rowItem,key) => {
            return(
              <Row key={key}>
                {
                  rowItem.cols.map((colItem,index) => {
                    return (
                      <Col span={colItem.span || 12} key={index}>
                        {
                          (!colItem.formType || colItem.formType == "Input") &&
                          (
                            <FormInput formItemLayout = {colItem["formItemLayout"] || formItemLayout } getFieldDecorator = {this.props.form.getFieldDecorator } {...colItem}  />
                          )
                        }
                        {
                          colItem.formType && colItem.formType == "Select" &&
                          (
                            <FormSelect formItemLayout = {colItem["formItemLayout"] || formItemLayout }  getFieldDecorator = {this.props.form.getFieldDecorator } {...colItem}  />
                          )
                        }

                        {
                          colItem.formType && colItem.formType == "TreeSelect" &&
                          (
                            <FormTreeSelect formItemLayout = {colItem["formItemLayout"] || formItemLayout }  getFieldDecorator = {this.props.form.getFieldDecorator } {...colItem}  />
                          )
                        }
                        {
                          colItem.formType && (colItem.formType == "DateTime" || colItem.formType == "Date" ) &&
                          (
                            <FormDate formItemLayout = {colItem["formItemLayout"] || formItemLayout }  getFieldDecorator = {this.props.form.getFieldDecorator } {...colItem}  />
                          )
                        }
                        {
                          colItem.formType && colItem.formType == "Checkbox" &&
                          (
                            <FormCheckGroup formItemLayout = {colItem["formItemLayout"] || formItemLayout }  getFieldDecorator = {this.props.form.getFieldDecorator } {...colItem}  />
                          )
                        }
                        {
                          colItem.formType && colItem.formType == "Radio" &&
                          (
                            <FormRadioGroup formItemLayout = {colItem["formItemLayout"] || formItemLayout }  getFieldDecorator = {this.props.form.getFieldDecorator } {...colItem}  />
                          )
                        }
                        {
                          colItem.formType && colItem.formType == "InputNumber" &&
                          (
                            <FormNumber formItemLayout = {colItem["formItemLayout"] || formItemLayout }  getFieldDecorator = {this.props.form.getFieldDecorator } {...colItem}  />
                          )
                        }
                        {
                          colItem.formType && colItem.formType == "TextArea" &&
                          (
                            <FormTextArea formItemLayout = {colItem["formItemLayout"] || formItemLayout }  getFieldDecorator = {this.props.form.getFieldDecorator } {...colItem}  />
                          )
                        }

                      </Col>
                    )
                  })
                }
              </Row>
            )
          })
        }
      </>
    );
  }
}
export default FormCustom;

