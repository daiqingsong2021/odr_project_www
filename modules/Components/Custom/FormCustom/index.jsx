import React, { Component } from 'react';
import style from './style.less';
import { Form, Row,Button} from 'antd';
import { connect } from 'react-redux';
import FormCustom from '../../../../components/public/FormItem/FormCustom';

export class CustomForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {

  }

  // 表单提交
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err){
          if(this.props.handleSubmit){
            this.props.handleSubmit(values,this.props.form ,err);
          }
        }
    });
  };

  handleCancel = (e) =>{
    this.props.handleCancel(e);
  }

  /*
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
  */

  render() {
    const { edit } = this.props;
    let disabled = !edit;
    return (
      <div className={style.main} style={{ height: '100%' }}>
        <div className={style.mainScorll}>
          <h3  className={style.listTitle}>{this.props.title || "自定义"}</h3>
          <Form onSubmit={this.handleSubmit}>
            <div className={style.content}>
              <FormCustom {...this.props}></FormCustom>
            </div>
          </Form>
        </div>
        <div className={style.mybtn}>
          <Row>
            <Form.Item wrapperCol={{ offset: 4 }}>
            
              <Button className="globalBtn" onClick={this.handleCancel} style={{ marginRight: 20 }}>取消</Button>
              <Button className="globalBtn" onClick={this.handleSubmit} 
                      type="primary" disabled={disabled }>保存</Button>
            </Form.Item>
          </Row>
        </div>
      </div>
    );
  }
}
const CustomForms = Form.create()(CustomForm);
export default connect(state => ({ currentLocale: state.localeProviderData }))(CustomForms);
