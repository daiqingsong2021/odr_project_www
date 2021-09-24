import React from 'react'
//import './style.less'
import PropTypes from 'prop-types';


export  let WrapAuth = ComposedComponent => class WrapComponent extends React.Component {
    // 构造
    constructor(props) {
        super(props);
    }

    static propTypes = {
        auth: PropTypes.string.isRequired
    };

    render() {
        if (this.props.auth) {
            return <ComposedComponent { ...this.props} />;
        } else {
            return <ComposedComponent disabled={true} { ...this.props} />
        }
    }
};

