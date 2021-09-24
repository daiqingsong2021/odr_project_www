import React from 'react';
import { DatePicker } from 'antd';
import PropTypes from 'prop-types';

export default class extends React.Component {
  static propTypes = {
    callBackDateValue: PropTypes.func.isRequired,
    size: PropTypes.string,
    disabled: PropTypes.bool,
  };
  static defaultProps = {
    size: 'default',
    disabled: false,
  };
  state = {
    open: false,
  };
  render() {
    return (
      <DatePicker
        disabled={this.props.disabled}
        format="YYYY"
        placeholder="请选择年份"
        size={this.props.size}
        mode="year"
        value={this.props.value}
        style={{ width: '100%' }}
        open={this.state.isopen}
        onChange={value => {
          this.props.callBackDateValue(value);
        }}
        onPanelChange={value => {
          this.setState({ isopen: false });
          this.props.callBackDateValue(value);
        }}
        onOpenChange={status => this.setState({ isopen: !!status })}
      />
    );
  }
}
