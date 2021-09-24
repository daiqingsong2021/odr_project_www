import React, {Component} from 'react'
import dynamic from 'next/dynamic'
import style from './style.less'

export class PlanDefineTopTags extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roleBtnData: []
    }
  }
  handleCancel = () => {
    this.setState({
      modalVisible: false
    })
  }
  render() {
    let topTags = this.state.roleBtnData.map((v, i) => {
      return dynamic(import('../../../../../components/public/TopTags/' + v.name))
    })

    let showFormModal = (name) => {
      let that = this
      // 新增文档模板按钮
      if (name === 'AddTopBtn') {
        this.setState({
          modalVisible: true
        })
      }
    }

    return (
        <div className={style.main}>
          {/*<div className={style.search}>
            <Search/>
          </div>*/}
          <div className={style.tabMenu}>
            {
              topTags.map((Component, key) => {
                return <Component key={key} onClickHandle={showFormModal}/>
              })
            }
          </div>


        </div>

    )
  }
}

export default PlanDefineTopTags
