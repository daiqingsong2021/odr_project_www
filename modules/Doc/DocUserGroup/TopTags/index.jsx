import React, { Component } from 'react'
import Search from '../../../../components/public/Search'
import style from './style.less'
import PublicButton from "../../../../components/public/TopTags/PublicButton"
import * as dataUtil from "../../../../utils/dataUtil";
import DistributionModal from '../DistributionModal';

export class DocTempDoc extends Component {
    state = {
        showDistribute: false
    };
    constructor(props) {
        super(props)
    }


  /**
   *  打开分配用户窗口
   *
   **/
  showUpLoadModal = () => {
    if (!this.props.leftData) {
      dataUtil.message('请选择分组进行操作');
      return;
    }
    this.setState({ showDistribute: true })
  }

  closeDistributionModal = () => {
    this.setState({ showDistribute: false })
  }

    render() {

        return (
            <div className={style.main}>
                <div className={style.search}>
                    <Search search={this.props.search} placeholder="用户名" />
                </div>
                <div className={style.tabMenu}>
                    {/*上传*/}
                    <PublicButton name={'分配用户'} title={'分配用户'} icon={'icon-fenpei'} afterCallBack={this.showUpLoadModal} />
                    {/*删除*/}
                    <PublicButton title={"移除"} useModel={true} verifyCallBack={this.props.deleteVerifyCallBack} afterCallBack={this.props.deleteData} icon={"icon-delete"} />
                </div>
                {this.state.showDistribute && <DistributionModal
                  assignUser={this.props.assignUser}
                  rightData={this.props.rightData}
                  handleCancel={this.closeDistributionModal.bind(this)}
                />}
            </div>

        )
    }
}

export default DocTempDoc
