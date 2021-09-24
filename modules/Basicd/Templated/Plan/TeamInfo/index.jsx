import React, { Component } from 'react'
import style from './style.less'

import TeamB from "../TeamTableB"
import { connect } from 'react-redux'
class TeamInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,

        }
    }
    render() {
        const { intl } = this.props.currentLocale
        return (
            <div className={style.main}>
              
                    <div className={style.GroupTeam}>
                        <h3 className={style.listTitle}>{intl.get("wbs.global.tags.template")}</h3>
                        <TeamB data={this.props.data} bizType={this.props.bizType}></TeamB>
                    </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};


export default connect(mapStateToProps, null)(TeamInfo);