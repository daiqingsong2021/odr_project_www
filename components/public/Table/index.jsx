import React from 'react'
import style from './style.less'
import { Table, Button } from 'antd';


class table extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
    };
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  render() {
    const {props} = this
    const {children} = props
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <Table
          rowKey={(record, index) => index}
          rowSelection={this.props.rowSelection}
          columns={this.props.columns}
          dataSource={this.props.data} pagination={false}
          onRow={this.props.onRow}
        />
      </div>

    )
  }
}

export default table;