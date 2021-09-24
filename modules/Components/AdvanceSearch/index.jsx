import React, { Component } from 'react'

import { connect } from 'react-redux';

import { Table, Icon, Input ,DatePicker,Select} from 'antd';
import MyIcon from "../../../components/public/TopTags/MyIcon"
import style from './style.less';

import axios from "../../../api/axios"
const Search = Input.Search;
const Option = Select.Option;
class CodeRule extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() {


    }

    render() {
        const { intl } = this.props.currentLocale

        return (
            <div className={style.main} style={{ height: this.props.height +40}}>

                <section className={style.leftbox}>
                    <p>请输入您想输入的内容</p>
                    <Search
                    className={style.Searchinput}
                        enterButton="搜索"
                        onSearch={value => console.log(value)}
                    />
                    <Select style={{ width: "100%" }}>
                        <Option value="1">全部</Option>
                    </Select>
                    <ul>
                        <li>项目</li>
                        <li>经营</li>
                        <li>计划</li>
                        <li>项目</li>
                        <li>资源</li>
                        <li>文档</li>
                        <li>沟通</li>
                    </ul>
                    <DatePicker placeholder="开始时间" style={{width:"100%"}} className={style.date}/>
                    <DatePicker placeholder="结束时间" style={{width:"100%"}} className={style.date}/>
                </section>
                <section className={style.rightbox}>
                    <h3>共2条搜索结果</h3>
                    <li>
                       <span className="ant-menu-item-selected ">ACM</span>计划模板 <MyIcon type="icon-weibiaoti40" style={{fontSize:20}} className="ant-menu-item-selected "/>
                    </li>
                    <li>
                       <span className="ant-menu-item-selected ">ACM</span>计划模板 <MyIcon type="icon-weibiaoti40" style={{fontSize:20}} className="ant-menu-item-selected "/>
                    </li>
                </section>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        currentLocale: state.localeProviderData,
    }
};


export default connect(mapStateToProps, null)(CodeRule);