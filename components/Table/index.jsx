import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';

import styles from './index.less';

// function initTotalList(columns) {
//   const totalList = [];
//   columns.forEach(column => {
//     if (column.needTotal) {
//       totalList.push({ ...column, total: 0 });
//     }
//   });
//   return totalList;
// }

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns } = props;
    // const needTotalList = initTotalList(columns);

    this.state = {
      selectedRowKeys: [],
      // needTotalList,
    };
  }

  static getDerivedStateFromProps(nextProps) {
    // clean state
    if (nextProps.selectedRows)
      if (nextProps.selectedRows.length === 0) {
        // const needTotalList = initTotalList(nextProps.columns);
        return {
          selectedRowKeys: [],
          // needTotalList,
        };
      }
    return null;
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    // let { needTotalList } = this.state;
    // needTotalList = needTotalList.map(item => ({
    //   ...item,
    //   total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
    // }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({
      selectedRowKeys,
      // needTotalList
    });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  render() {
    const { selectedRowKeys, needTotalList } = this.state;
    const { data = {}, rowKey, rowClassName, onRow, style = {}, ...rest } = this.props;
    const { dataSource = [], pagination } = data;

    const paginationProps = {
      ...pagination,
    };

    let rowSelectionConfig = {};
    if (this.props.rowSelection) {
      rowSelectionConfig = {
        rowSelection: {
          selectedRowKeys,
          onChange: this.handleRowSelectChange,
          getCheckboxProps: record => ({
            disabled: record.disabled,
          }),
        },
      };
    }

    return (
      <div className={styles.standardTable}>
        <Table
          rowKey={rowKey || 'key'}
          rowClassName={rowClassName}
          dataSource={dataSource}
          pagination={paginationProps}
          onRow={onRow}
          onChange={this.handleTableChange}
          style={style}
          size='small'
          {...rest}
          {...rowSelectionConfig}
        />
      </div>
    );
  }
}

export default StandardTable;

// 如果需要知道页码信息,传入onChange()
// 不要页码 pagination={false}
{/*<StandardTable
  data={{
    dataSource: this.state.data, pagination: {
      total, current, pageSize, size: 'small',
      showTotal: v => `每页${pageSize}条,共 ${v} 条`,
      showQuickJumper: true,
      showSizeChanger: true,
    },
  }}
  columns={columns} //列表信息
  rowSelection // 复选框
  rowKey={record => record.id}
  rowClassName={this.setClassName}
  onRow={(record, index) => {
    return {
      onClick: (event) => {
        this.getInfo(record, index);// 行点击操作
      },
    };
  }}
/>*/
}
