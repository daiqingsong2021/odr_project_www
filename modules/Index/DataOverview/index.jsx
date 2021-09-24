import React, { Component } from 'react';
import { Statistic, Row, Col, Divider, Spin } from 'antd';
import style from './style.less';
import axios from "../../../api/axios"
import { getMyUnfinishTaskList, wfBizTypeList } from "../../../api/api"
import { homePageCollectDataVo } from '@/modules/Suzhou/api/suzhou-api';
import { connect } from 'react-redux';
import * as dataUtil from "../../../utils/dataUtil"
const { Countdown } = Statistic;

//数据概览
class DataOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading:true
    }
  }

  componentDidMount(){
    this.getList()
  }
  getList = () => {
    axios.get(homePageCollectDataVo).then(res => {
      const data = res.data.data ? res.data.data:[] 
      this.setState({
        data,
        loading:false
      })
    })
  }

  render() {
    const { data, loading } = this.state
    return (
      <div className={style.main}>
        <Spin spinning={loading}>
          <Row gutter={16} type="flex" justify="center" align="middle" style={{marginTop:10,marginBottom:10}}>
            <Col span={24}>
              <div>运营数据概览<i style={{ fontStyle: 'normal', color: 'red' }}></i></div>
              <Divider dashed />
            </Col>
          </Row>
          <Row gutter={16} type="flex" justify="center" align="middle">
            <Col span={5}>
              <Row gutter={16} type="flex" justify="space-between" align="middle">
                <Col span={24}>
                  <Statistic title="年累计客运量（万人次）" value={data.trafficVolumeYear} valueStyle={{ color: 'orange' }} />
                </Col>
              </Row>
              <Row gutter={16} type="flex" justify="space-between" align="middle">
                <Col span={12}>
                  <Statistic title="本月累计客运量（万人次）" value={data.trafficVolumeMonth} />
                </Col>
                <Col span={12}>
                  <Statistic title="本月日均客运量（万人次）" value={data.trafficVolumeMonthAverage} />
                </Col>
              </Row>
            </Col>
            <Divider type="vertical" dashed />
            <Col span={6}>
              <Row gutter={16} type="flex" justify="space-between" align="middle">
                <Col span={24}>
                  <Statistic title="年累计运营里程（万公里）" value={data.operatingKilometres} valueStyle={{ color: 'orange' }} />
                </Col>
              </Row>
              <Row gutter={16} type="flex" justify="space-between" align="middle">
                <Col span={12}>
                  <Statistic title="本月行车计划兑现率" value={data.fulfillmentRate} suffix='%' />
                </Col>
                <Col span={12}>
                  <Statistic title="本月列车准点率" value={data.onTimeRate} suffix='%' />
                </Col>
              </Row>
            </Col>
            <Divider type="vertical" dashed />
            <Col span={5}>
              <Row gutter={16} type="flex" justify="space-between" align="middle">
                <Col span={24}>
                  <Statistic title="年累计电能能耗（千瓦时）" value={data.totalPowerConsumption} valueStyle={{ color: 'orange' }} />
                </Col>
              </Row>
              <Row gutter={16} type="flex" justify="space-between" align="middle">
                <Col span={12}>
                  <Statistic title="本月牵引用电占比" value={data.towPowerRate} suffix='%' />
                </Col>
                <Col span={12}>
                  <Statistic title="本月动力及照明用电占比" value={data.motivePowerRate} suffix='%' />
                </Col>
              </Row>
            </Col>
            <Divider type="vertical" dashed />
            <Col span={5}>
              <Row gutter={16} type="flex" justify="space-between" align="middle">
                <Col span={24}>
                  <Statistic title="年累计施工计划数（条）" value={data.totalPlanYear} valueStyle={{ color: 'orange' }} />
                </Col>
              </Row>
              <Row gutter={16} type="flex" justify="space-between" align="middle">
                <Col span={24}>
                  <Statistic title="本月施工计划兑现率" value={data.totalActualRate} suffix='%' />
                </Col>
              </Row>
            </Col>
          </Row>
        </Spin>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
  }
};

export default connect(mapStateToProps, null)(DataOverview);
