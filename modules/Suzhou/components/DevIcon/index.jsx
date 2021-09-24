import React from 'react';
import { Icon } from 'antd';
export default () => (
  <div
    style={{
      height: `calc(100vh - 140px)`,
      display: `flex`,
      justifyContent: `center`,
      alignItems: `center`,
    }}
  >
    <div>
      <Icon type="warning" style={{ fontSize: 100, color: '#faad14' }} />
      <br />
      <p style={{ fontSize: 30, textAlign: 'center' }}>开发中</p>
    </div>
  </div>
);
