import React, { Component } from 'react'
import style from './style.less'
import { Pagination, Select } from 'antd'
const Option = Select.Option
class FooterPagination extends Component {
    constructor(props) {
        super(props)
        this.state = {
            total: 50,
            pageSize: 10,
            pageSizeOptions: ['10', '20', '30', '40'],
            current: 2
        }
    }
    onChangeCurrentPage = (pageNumber) => {
        this.setState({
            current: pageNumber
        })
    }
    onShowSizeChange=(current, size)=>{
        this.setState({
            pageSize: size
        })
    }
    render() {
        return (
            <div className={style.main}>
                <div className={style.left}>

                    <Pagination
                        size="small"
                        showSizeChanger showQuickJumper
                        defaultCurrent={2}
                        current={this.state.current}
                        total={this.state.total}
                        pageSize={this.state.pageSize}
                        pageSizeOptions={this.state.pageSizeOptions}
                        onChange={this.onChangeCurrentPage} 
                        onShowSizeChange={this.onShowSizeChange}/>
                </div>
                <span className={style.pageSizestyle}>每页共{this.state.pageSize}条,共{this.state.total}条</span>
            </div>
        )

    }
}
export default FooterPagination