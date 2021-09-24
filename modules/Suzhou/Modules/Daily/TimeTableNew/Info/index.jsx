import React from 'react';
import ComponentLineOne from '../InfoForLine1';
import ComponentLineThree from '../InfoForLine3';

// 竣工备案 同质量报监
export default props => {
    return props.record.line == '1'?
<ComponentLineOne type={1} {...props} />:<ComponentLineThree type={2} {...props} />
}