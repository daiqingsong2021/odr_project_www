/*
 * @Author: wihoo.wanghao
 * @Date: 2019-01-17 11:43:11
 * @Last Modified by: wihoo.wanghao
 * @Last Modified time: 2019-01-17 15:04:28
 */

import React, {Component} from 'react'

import Search from '../../../../components/public/Search'
import style from './style.less'
import {notification} from 'antd'
import SelectPlanBtn from "../../../../components/public/SelectBtn/SelectPlanBtn"
import PublicButton from '../../../../components/public/TopTags/PublicButton'

export class PlanDefineTopTags extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {


    return (
      <div className={style.main}>
        <div className={style.search}>
          <Search search={this.props.search}/>
        </div>
        <div className={style.tabMenu}>
          {/*选择项目计划*/}
          <SelectPlanBtn openPlan={this.props.openPlan}/>
          <PublicButton name={'查看'} title={'查看'} icon={'icon-chakan'}
                        afterCallBack={this.props.see}
          />
        </div>

      </div>

    )
  }
}

export default PlanDefineTopTags
