import React, { Component } from 'react'
import style from './style.less'
import { Timeline, Icon, Modal, Table } from 'antd';
import { connect } from 'react-redux'
import MyIcon from "../../../../components/public/TopTags/MyIcon"
class MenuInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initDone: false,
            visible: true,

        }
    }

    componentDidMount() {
       
    }

    render() {
        const { intl } = this.props.currentLocale

        return (
            <div  >
            
                    <Modal title={intl.get("wbs.il8n.process.processfigure")} visible={true}
                        onCancel={this.props.handleCancel}
                        width="700px"
                        className={style.main}
                        footer={null}
                        centered={true}
                    >
                        <div className={style.ProcessLogModal} >
                           
                            <div className={style.timeLine}>
                                <Timeline>
                                    <Timeline.Item className={this.props.index>=1? style.current:style.asd}><span ><MyIcon type="icon-kaishi"  style={{fontSize:18,verticalAlign:"middle",marginRight:5}}/>{intl.get("wbs.il8n.process.processstart")}</span></Timeline.Item>
                                    <Timeline.Item className={this.props.index>=2? style.current: style.asd}><span ><MyIcon type="icon-design-preparat"  style={{fontSize:18,verticalAlign:"middle",marginRight:5}}/>{intl.get("wbs.il8n.process.planner")}</span></Timeline.Item>
                                    <Timeline.Item className={this.props.index>=3? style.current: style.asd}><span ><MyIcon type="icon-shenpi1"  style={{fontSize:18,verticalAlign:"middle",marginRight:5}}/>{intl.get("wbs.il8n.process.projectapproval")}</span></Timeline.Item>
                                    <Timeline.Item className={this.props.index>=4? style.current: style.asd}><span ><MyIcon type="icon-wodejiaofu"  style={{fontSize:18,verticalAlign:"middle",marginRight:5}}/>{intl.get("wbs.il8n.process.projectauditor")}</span></Timeline.Item>
                                    <Timeline.Item className={this.props.index>=5? style.current: style.asd}><span ><MyIcon type="icon-close"  style={{fontSize:18,verticalAlign:"middle",marginRight:5}}/>{intl.get("wbs.il8n.process.processend")}</span></Timeline.Item>
                                </Timeline>
                            </div>
                        </div>
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


export default connect(mapStateToProps, null)(MenuInfo);