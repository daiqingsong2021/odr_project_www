import React, { Component } from "react";
import style from './style.less';
import E from 'wangeditor';
import { Row, Col } from 'antd';



class RichText extends Component {

    componentDidMount(){
        var editor = new E('#div1', '#div2')
        editor.create()
    }

    render(){
        
        return(
            <div className={style.main}>
                
                <Row type="flex" justify="start">
                    <Col span={24}>
                        <div id='div1' className={style.textTop}></div>
                    </Col>
                    <Col span={24}>
                        <div id='div2' className={style.text}></div>
                        
                    </Col>
                </Row>
            </div>
        )
    }
}

export default RichText