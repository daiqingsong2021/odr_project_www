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
import { checkRule } from '../../../../api/api';


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
      creatTime:'',
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
      // getConfirmVoList
      this.setState({
        info:res.data.data,
        creatTime:res.data.data.creatTime,
        title:res.data.data.title,
        creator:res.data.data.creator,
        statusVo:res.data.data.statusVo,
        handle:res.data.data.handle,
        reverse:true
      })
    });
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
                <Timeline.Item>
                {moment(item.creatTime).format('YYYY-MM-DD')}<br />
                {item.type && item.type == '0' && (
                  <span>标题为："{item.title }"被创建，问题描述：{item.desc}
                  <br />提出人：<span className={style.txtBlue}>{item.creater}</span>
                  , 提出部门：<span className={style.txtBlue}>{item.createrDept}</span></span>
                )}
                {item.type && item.type == '1' && (
                  <span> 该问题第<span style={{color:"red"}}>{item.clcs}</span>次被处理，处理内容：{item.desc}
                  <br />处理人：<span className={style.txtBlue}>{item.creater}</span>
                  , 处理部门：<span className={style.txtBlue}>{item.createrDept}</span></span>
                )}
                {item.type && item.type == '2' && (
                  <span> 该问题已被确认，确认结果：<span style={{color:"red"}}>{item.qrjg}</span>，确认内容：{item.desc}
                  <br />确认人：<span className={style.txtBlue}>{item.creater}</span>
                  , 确认部门：<span className={style.txtBlue}>{item.createrDept}</span></span>
                )}
                <br />{item.fileCount != '0' && <span>
                  <FilePopover record={item} fileCount={item.fileCount}></FilePopover>
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