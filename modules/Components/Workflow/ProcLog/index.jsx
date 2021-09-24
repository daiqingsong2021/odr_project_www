import React, {Component} from 'react'
import style from './style.less'
import {Timeline, Icon, Modal} from 'antd';
import {connect} from 'react-redux'
import {getProcessLogList} from "../../../../api/api"
import axios from "../../../../api/axios"

class ProcLog extends Component {
  constructor(props) {
    super(props)
    this.state = {

      data: []
    }
  }

  componentDidMount() {
    axios.get(getProcessLogList(this.props.procInstId)).then(res => {
      this.setState({
        info: res.data.data
      })
    })
  }

  render() {
    const {intl} = this.props.currentLocale
    const {info} = this.state
    return (
      <div>
        <Modal title={intl.get("wbs.il8n.process.processlog")} visible={true}
               onOk={this.handleOk} onCancel={this.props.handleCancel}
               width="700px"
               footer={null}
               centered={true}
               className={style.main}
               bodyStyle={{minHeight: 300}}
        >
          {info &&
          <div className={style.ProcessLogModal}>

            <p className={style.titleh}>{`${info.processInstName} (${intl.get("wsd.i18n.plan.activitybiz.releasename")}:${info.creator ? info.creator.name : null})`}</p>
            <div className={style.nodecontent}>
              <Timeline>

                {info && info.wfLog && info.wfLog.map((item, i) =>
                  <div key={item.id}>
                    <Timeline.Item>
                      <div className={i == 1 ? `${style.node} ${style.currentcolr}` : style.node}>
                        <p><Icon type="exception" style={{marginRight: "5px"}}/><span
                          className={style.head}>{intl.get("wsd.i18n.plan.activitydefineinfo.nodeName") + "："}</span>{item.workItemName}</p>
                        <div className={style.maas}>
                          <div className={style.a}>
                            <p><span className={style.head}>{intl.get("wbs.il8n.process.operatetype") + "："}</span>{item.operateType}</p>
                            {
                              item.operateType != "批准" && <p><span className={style.head}>{item.operateType == "驳回" ? "驳回至：" : "送审至："}</span>{item.nextUserName}</p>
                            }
                          </div>
                          <p><span className={style.head}>{intl.get("wbs.il8n.process.handler") + "："}</span>{item.operateUser}</p>
                          <p><span className={style.head}>{intl.get("wbs.il8n.process.adivce") + "："}</span>{item.opinion}</p>
                        </div>
                      </div>
                      <div className={style.time}>
                        <p>{item.createTime}</p>
                        <p className={style.s}>{intl.get("wbs.il8n.process.staytime") + "：" + item.stayTime}</p>
                      </div>
                    </Timeline.Item>

                  </div>
                )}
              </Timeline>
            </div>

          </div>
          }
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentLocale: state.localeProviderData,
  }
};
export default connect(mapStateToProps, null)(ProcLog);
