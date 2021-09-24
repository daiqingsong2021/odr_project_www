import React, { Component } from 'react'
import style from './style.less'
import { Icon } from 'antd'

export class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            values: "",
        }
    }

    change = (e) => {
        this.setState({
            value: e.target.value
        })
    }

    click() {
        if (this.props.search) {
            this.props.search(this.input.value)
        }

    }

    render() {
        let placeholder = this.props.placeholder || "名称/代码";
        return (
            <div className={style.main}>
                <span>
                    <Icon type="search" className={style.icon} />
                    <input type="text" placeholder= {placeholder } ref={input => this.input = input} />
                </span>
                <span onClick={this.click.bind(this)} className={style.search}>搜索</span>
            </div>
        )
    }
}

export default Search
