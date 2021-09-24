import React, { Component } from "react";
import style from './style.less';
import E from 'wangeditor';
import { Row, Col } from 'antd';



class RichText extends Component {

    state = {

        editorHtml: '',
        editorText: '',
    }

    setEditor = () => {
        var editor = new E('#div1', this.div2);
        editor.customConfig.uploadImgShowBase64 = true;
        editor.customConfig.menus = [
            'bold',  // 粗体
            'fontSize',  // 字号
            'fontName',  // 字体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'link',  // 插入链接
            'list',  // 列表
            'justify',  // 对齐方式
            'quote',  // 引用
            'emoticon',  // 表情
            'image',  // 插入图片
            'table',  // 表格
            'undo',  // 撤销
            'redo'  // 重复
        ];
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        editor.customConfig.onchange = (html) => {
            this.setState({
                editorHtml: html,
                editorText: editor.txt.text()
            })
            this.props.editorHtml(html)
        }


        editor.create()

        this.setState({
            editor
        })
    }


    componentDidMount() {
        this.setEditor();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.isNell) {
            this.state.editor.txt.clear();
            this.props.succeedDel();
        }
        if(newProps.editorTxtHtml){
            this.state.editor.txt.html(newProps.editorTxtHtml )
        }
    }


    render() {
        return (
            <div className={style.main}>

                <Row type="flex" justify="start">
                    <Col span={24}>
                        <div id='div1' className={style.textTop}></div>
                    </Col>
                    <Col span={24}>
                        <div id='div2' ref={(ref) => this.div2 = ref} className={style.text} >
                    
                        </div>

                    </Col>
                </Row>
            </div>
        )
    }
}

export default RichText