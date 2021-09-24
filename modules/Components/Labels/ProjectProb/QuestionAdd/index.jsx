import React, { Component } from 'react';
import style from './style.less';
import { Table,Form,Timeline,Popover, Row, Col, Card,Input, Button, Icon, Select, DatePicker, Modal, Checkbox,InputNumber,Steps} from 'antd';
import axios from '@/api/axios';
import {getConfirmVoList,queryQuestionRecordList} from '@/api/suzhou-api';
// import { addTsPlat,updateTsPlat} from '../../../api/suzhou-api';
import CheckFile from '../CheckModal';
import FilePopover from '../FilePopover';
import moment from 'moment';
import { connect } from 'react-redux'
import { checkRule } from '../../../../../api/api';


const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const { Step } = Steps;
//人员-新增修改Modal
class Question extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initDone: false,
      menuId: null,
      funcId: null,
      info: {},
      funcCode: '',
      stepHtml:'',
      data:[],
      createTime:'',
      title:'',
      statusVo:'',
      creator:'',
      handle:[],
      visible:false,
      fileInfo:'',//文件信息
    };
  }
  getData=(id)=>{
    axios.get(queryQuestionRecordList(id)).then(res => {
      this.setState({
        info:res.data.data,
        createTime:res.data.data.createTime,
        title:res.data.data.title,
        creator:res.data.data.creatorVo,
        statusVo:res.data.data.statusVo,
        handle:res.data.data.handle,
        reverse:true
      })
    });
  }
  getActionName=(value)=>{ 
    let name = ''
    switch(value.code){
      case '0':
        name = '新建';
        break
      case '1':
        name = '发布';
        break
      case '2':
        name = '处理';
          break
      case '3':
        name = '转发';
        break
      case '4':
        name = '驳回';
        break
      case '5':
        name = '确认';
        break
      case '6':
        name = '挂起';
        break
      case '7':
        name = '取消挂起';
        break
      case '8':
        name = '关闭';
        break
      default:
        name = '无'
    }  
    return name
}
getTimeLineColor=(item)=>{
  let color =''
  switch(item.statusVo.code){
    case '0':
        color = 'blue';
        break
    case '1':
    case '2':
        color = 'yellow';
        break
    case '3':
        color = 'green';
        break
    case '4':
        color = '#ccc';
        break
  }
  return color
}
  componentDidMount() {
    this.props.data?this.getData(this.props.data.id):null;
  };
  handleSubmit = (val, e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {

      }
    });
  };

  handleCancel = (e) => {
    this.props.handleCancel();
  };
  handleVisibleChange = (visible,i) => {
    this.setState({ visible });
  };
  hide = () => {
    this.setState({
      visible: false,
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
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <div className={style.main}>
        <div>
          <Modal 
            title={this.props.title} 
            visible={this.props.visible}
            onCancel={this.handleCancel}
            width="600px"
            footer={null}
          >
          <Timeline reverse = {this.state.reverse}>
          {Array.isArray(this.state.info) && this.state.info.map((item,i)=>{
              return (
                <Timeline.Item color={this.getTimeLineColor(item)}>
                {moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}<br />
                  {item.statusVo.code && item.statusVo.code == '0' && (
                  <span>动作：{this.getActionName(item.actionVo) }<br/>
                        处理说明：{item.remark?item.remark:'无' }<br/>
                        下一步处理人：<span className={style.txtBlue}>{item.userVo?item.userVo.name:'无'}</span>
                      , 下一步处理人所属组织：<span className={style.txtBlue}>{item.orgVo?item.orgVo.name:'无'}</span><br/>
                      创建人：<span className={style.txtRed}>{item.createrVo?item.createrVo.name:'无'}</span>
                      , 所属组织：<span className={style.txtRed}>{item.createrOrgVo?item.createrOrgVo.name:'无'}</span>
                  </span> )}
                  {item.statusVo.code && item.statusVo.code == '1' && (
                  <span>动作：{this.getActionName(item.actionVo) }<br/>
                        处理说明：{item.remark?item.remark:'无' }<br/>
                        下一步处理人：<span className={style.txtBlue}>{item.userVo?item.userVo.name:'无'}</span>
                      , 下一步处理人所属组织：<span className={style.txtBlue}>{item.orgVo?item.orgVo.name:'无'}</span><br/>
                      创建人：<span className={style.txtRed}>{item.createrVo?item.createrVo.name:'无'}</span>
                      , 所属组织：<span className={style.txtRed}>{item.createrOrgVo?item.createrOrgVo.name:'无'}</span>
                  </span> )}
                   {item.statusVo.code && item.statusVo.code == '2' && (
                  <span>动作：{this.getActionName(item.actionVo) }<br/>
                        处理说明：{item.remark?item.remark:'无' }<br/>
                        下一步处理人：<span className={style.txtBlue}>{item.userVo?item.userVo.name:'无'}</span>
                      , 下一步处理人所属组织：<span className={style.txtBlue}>{item.orgVo?item.orgVo.name:'无'}</span><br/>
                      创建人：<span className={style.txtRed}>{item.createrVo?item.createrVo.name:'无'}</span>
                      , 所属组织：<span className={style.txtRed}>{item.createrOrgVo?item.createrOrgVo.name:'无'}</span>
                  </span> )}
                  
                  {item.statusVo.code && item.statusVo.code == '3' && (
                  <span>动作：{this.getActionName(item.actionVo) }<br/>
                        处理说明：{item.remark?item.remark:'无' }<br/>
                        下一步处理人：<span className={style.txtBlue}>{item.userVo?item.userVo.name:'无'}</span>
                      , 下一步处理人所属组织：<span className={style.txtBlue}>{item.orgVo?item.orgVo.name:'无'}</span><br/>
                      创建人：<span className={style.txtRed}>{item.createrVo?item.createrVo.name:'无'}</span>
                      , 所属组织：<span className={style.txtRed}>{item.createrOrgVo?item.createrOrgVo.name:'无'}</span>
                  </span> )}
 
                  {item.statusVo.code && item.statusVo.code == '4' && (
                  <span>动作：{this.getActionName(item.actionVo) }<br/>
                        处理说明：{item.remark?item.remark:'无' }<br/>
                      下一步处理人：<span className={style.txtBlue}>{item.userVo?item.userVo.name:'无'}</span>
                      , 下一步处理人所属组织：<span className={style.txtBlue}>{item.orgVo?item.orgVo.name:'无'}</span><br/>
                      创建人：<span className={style.txtRed}>{item.createrVo?item.createrVo.name:'无'}</span>
                      , 所属组织：<span className={style.txtRed}>{item.createrOrgVo?item.createrOrgVo.name:'无'}</span>
                  </span> )} 
                  &nbsp;&nbsp;&nbsp;&nbsp;{item.fileCount != '0' && <span>
                  <FilePopover record={item} fileCount={item.fileCount} ></FilePopover>
                </span>}
                </Timeline.Item>
              )
            })
          }
          </Timeline>
          </Modal>
        </div>
      </div>
    );
  }
}
const Questions = Form.create()(Question);
const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
  }
};
export default connect(mapStateToProps, null)(Questions);