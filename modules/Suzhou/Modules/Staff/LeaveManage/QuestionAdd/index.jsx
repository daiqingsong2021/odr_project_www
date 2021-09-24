import React, { Component } from 'react';
import style from './style.less';
import { Table,Form, Row, Col, Card,Input, Button, Icon, Select, DatePicker, Modal, Checkbox,InputNumber,Steps} from 'antd';
import axios from '../../../../../../api/axios';
import { addTsPlat,updateTsPlat,getPeopleList } from '../../../../api/suzhou-api';
import moment from 'moment';
import { connect } from 'react-redux'


const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const { Step } = Steps;
//人员-新增修改Modal
class WareroomAdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initDone: false,
      menuId: null,
      funcId: null,
      info: {},
      funcCode: '',
      stepHtml:'',
      questionList:[],
      subQuestion:[],
      data:[
        {
          name:'xxx',
          address:'hhh',
        },{
          name:'aaa',
          address:'bbb'
        }
      ]
    };
  }
  componentDidMount() {
    if (this.props.addOrModify == 'add') {
      if (this.props.data) {
        
      }
    } else if (this.props.addOrModify == 'modify') {
      this.setState({
        info: this.props.data
      });
    }
    // axios.get('api/szxm/questionconfirm/99001/list').then(res => {
    //   const question = res.data.data.handle;
    //   const subQuestion = res.data.data.handle[0].confirm;
    //   this.setState({
    //     questionList:question,
    //     subQuestion:subQuestion
    //   })
    // });
  };

  handleSubmit = (val, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.props.addOrModify == 'add') {
          let data = {
            ...values,
            projInfoId:this.props.rightData.id,
            sectionId:this.props.rightData.sectionId,
            projectId:this.props.rightData.projectId
          }
          axios.post(addTsPlat, data, true).then(res => {
            this.props.addData(res.data.data)
            if (val == 'save') {
              this.props.handleCancel()
            } else if (val == 'goOn') {
              this.props.form.resetFields();
            }
          })
        } else if (this.props.addOrModify == 'modify') {
          let data = {
            ...values,
            id:this.props.data.id
          }
          axios.put(updateTsPlat, data, true).then(res => {
            this.props.updateSuccess(res.data.data)
            this.props.handleCancel()
          })
        }
      }
    });
  };

  handleCancel = (e) => {
    this.props.handleCancel();
  };
  render() {
    const { intl } = this.props.currentLocale;
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
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
    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title:'平台地址',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: "问题详情",
        // render:()=>{
        //   return "查看"
        // }
        render: () => <a href="javascript:;" onClick={this.onTest}>action</a>,
      }
    ];
    const message =  (
      <div>
        确认结果：<span style={{color:"green"}}>通过</span> <br />
        确认内容：撒旦撒旦撒到那时你打死你打算年的年撒大叔大婶六角恐龙就离开就dasasaadasdsadas
        <div>确认人：<span style={{color:"blue"}}>李四</span><br />
        确认部门：<span style={{color:"blue"}}>中铁十三局</span></div>
        <a href="#">查看详情</a>
      </div>
     );
    const message1 = (
      <div>
        确认结果：<span style={{color:"green"}}>通过</span> <br />
        回复内容：xsadsadsadsadsaaaaaaaaaaaaaaaaaasaddds
          xxdsadsadsasaxasdsadsadsadsadsadsadsadsadsaa<br />
          回复人：<span style={{color:"blue"}}>李四</span><br />
          回复部门：<span style={{color:"blue"}}>中铁十三局 </span> 
          <a href="#">查看详情</a>
      </div>
    );
    const message2 = (
      <div>
        确认结果：<span style={{color:'red'}}>未通过</span><br />
        确认内容：撒旦撒旦撒到那时你打死你打算年的年撒大叔大婶六角恐龙就离开就dasasaadasdsadas
        确认人：<span style={{color:"blue"}}>李四</span><br />
        确认部门：<span style={{color:"blue"}}>中铁十三局</span>
        <a href="#">查看附件</a> 
      </div>
    )
    const {questionList,subQuestion} = this.state;
    return (
      <div className={style.main}>
        
        <div>
          <Modal 
            title={this.props.title} 
            visible={this.props.visible}
            onCancel={this.handleCancel}
            width="600px"
          //   footer={<div className="modalbtn">
          //     {this.props.addOrModify == 'add' ? <Button key={3} onClick={this.handleSubmit.bind(this, 'goOn')}>{intl.get('wsd.global.btn.saveandcontinue')}</Button>
          //       : <Button key={1} onClick={this.handleCancel}>{intl.get('wsd.global.btn.cancel')}</Button>}
          //     <Button key={2} onClick={this.handleSubmit.bind(this, 'save')} type="primary">{intl.get('wsd.global.btn.preservation')}</Button>
          //   </div>}
          >
          
          <div>

            <Steps size="small" direction="vertical" current={3}>
            {
              questionList.length && questionList.map((item,i) => {
                return <Step title={item.handleTime} description={item.handleResult}></Step>
              })
            }
            {
              subQuestion.length && subQuestion.map((item,i) => {
                return <Step title={item.confirmTime} description={item.desc}></Step>
              })
            }
            <Step title="2019年5月10日，" description={message} />
            <Step title="2019年5月10日" description={message1} icon={<Icon type="close-circle" />} />
            <Step title="2019年5月10日，" description={message} />
          </Steps>
        </div>
          </Modal>
        </div>
      </div>
    );
  }
}
const WareroomAdds = Form.create()(WareroomAdd);
const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
  }
};
export default connect(mapStateToProps, null)(WareroomAdds);