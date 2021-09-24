import React, { Component } from 'react'
import { Table, Form, Row, Col, Input, Button, Icon, Select, DatePicker, Modal } from 'antd';
import intl from 'react-intl-universal'
import emitter from '../../../../api/ev';
import Search from '../../../../components/public/Search'
import moment from 'moment'
import style from './style.less'
import { connect } from 'react-redux'


const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
class ApplyModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initDone: false,
      visible: true,
      data: [],

    }
  }

  componentDidMount() {
    this.loadLocales();

    this.setState({
      width: this.props.width,
      // info: this.props.data
    })
  }

  loadLocales() {
    intl.init({
      currentLocale: 'zh-CN',
      locales,
    })
      .then(() => {
        // After loading CLDR locale data, start to render
        this.setState({
          initDone: true,

        });
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        var data = values;
        data.key = this.state.info['key']
        emitter.emit('noticeUpdateEvents', { status: 'update', data: data })
      }
    });
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = (e) => {
    this.setState({
      visible: false,
    });
    this.props.handleCancel()
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
    this.props.handleCancel()
  }

  render() {

    const columns = [
      {
        title: intl.get('wsd.i18n.plan.feedback.name'),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: intl.get("wsd.i18n.base.planTemAddTask.code"),
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: intl.get('wsd.i18n.plan.feedback.planstarttime'),
        dataIndex: 'planStartTime',
        key: 'planStartTime',
      },
      {
        title: intl.get('wsd.i18n.plan.feedback.planendtime'),
        dataIndex: 'planEndTime',
        key: 'planEndTime',
      },
      {
        title: intl.get('wsd.i18n.plan.feedback.iptname'),
        dataIndex: 'iptName',
        key: 'iptName',
      },
      {
        title: intl.get('wsd.i18n.plan.feedback.username'),
        dataIndex: 'userName',
        key: 'userName',
      }
    ];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
      },
      onSelect: (record, selected, selectedRows) => {
        this.setState({
          selectData: selectedRows
        })
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
      },
    };

    return (
      <div className={style.main}>
        <div>
          <Modal
            title={this.props.title}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText="确定"
            cancelText="取消"
            width="800px"
            footer={
              <div className="modalbtn">

                <Button key={3}>取消</Button>
                <Button key={2} type="primary" >确定</Button>
              </div>
            }
          >

            <div style={{ paddingBottom: '20px' }}>
              <Search />
            </div>
            <Table
              rowKey={record => record.id}
              defaultExpandAllRows={true}
              pagination={false}
              name={this.props.name}
              columns={columns}
              rowSelection={rowSelection}
              dataSource={this.state.data} />

          </Modal>
        </div>

      </div>
    )

  }
}
const ApplyModals = Form.create()(ApplyModal);
export default connect(state => ({
  currentLocale: state.localeProviderData
}))(ApplyModals)
