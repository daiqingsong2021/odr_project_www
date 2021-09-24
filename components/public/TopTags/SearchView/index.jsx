import React, { Component } from 'react'
import style from './style.less'
import { Icon, Input, Button, Form, Popover, Layout } from 'antd'
import * as dataUtil from "../../../../utils/dataUtil";
import axios from "../../../../api/axios";
import {saveView} from "../../../../api/api";
const { Header, Footer, Sider, Content } = Layout;

export function SearchView(SearchContent) {

  const  SearchView_ = class SearchView extends Component {
    constructor(props) {
      super(props);
      let searchName = props.searchName ? props.searchName : "name";
      this.state = {
        searchVisible : false,
        saveAsVisible: false,
        info : {},
        viewId : -1,
        SearchContent : null,
        initOpenSearch :false,
        defaultVisible : true,
        popoverDisplay : "none",
        searchName : searchName,
        searchText : "",
        searchChange : false
      }
    }

    componentDidMount() {
      if (this.props.onRef) {
        this.props.onRef(this);
      }
    }

    /**
     * 设置查询条件
     *
     * @param content
     * @param viewId
     */
    setSearchData = (content,viewId) => {
      this.props.form.resetFields();
      let {SearchContent } = this.state;

      content[this.state.searchName] = content[this.state.searchName] || null;

      if(SearchContent && SearchContent.beforeLoad){

        content = SearchContent.beforeLoad(content);
      }
      let searchText = content[this.state.searchName] || "";
      this.setState({info : content, viewId : viewId, searchText : searchText});
    }
    /**
     * 根据查询内容查询
     *
     */
    search = () =>{
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let {SearchContent } = this.state;
          if(SearchContent && SearchContent.beforeSaveView){
            values = SearchContent.beforeSaveView(values);
          }
          if(this.props.searchDatas){
            this.props.searchDatas(values);
          }
        }
      })
    }
    /**
     * 另存为视图，将查询条件保存至一个新的视图内。
     * @param e
     */
    saveAsView = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            if (!this.state.viewName || this.state.viewName.trim() == "") {
              dataUtil.message("请填写视图名称");
              return;
            }
            let {SearchContent } = this.state;
            if(SearchContent && SearchContent.beforeSaveView){
              values = SearchContent.beforeSaveView(values);
            }
            let obj = {
              viewContent: JSON.stringify(values),
              viewName: this.state.viewName,
              bizType: this.props.bizType
            }

            if(this.props.getViewBtn){
              let ViewBtn = this.props.getViewBtn();
              if(ViewBtn){
                ViewBtn.saveAsView(obj,(data) => {
                  this.setState({ saveAsVisible: false,searchVisible : false, viewName : null,viewId : data.id });
                  this.search();
                });
              }
            }
          }
        })
    }
    /**
     * 将当前新的查询条件保存为当前的视图
     * @param e
     */
    saveView = (e) => {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let obj = {
            viewContent: JSON.stringify(values),
            viewName: this.state.viewName,
            bizType: this.props.bizType
          }

          if(this.props.getViewBtn){
            let ViewBtn = this.props.getViewBtn();
            if(ViewBtn){
              ViewBtn.saveView(obj,() => {
                this.setState({ saveAsVisible: false,searchVisible : false });
                this.search();
              });
            }
          }
        }
      })
    }

    /**
     * 查询组件加载方法
     *
     * @param component
     */
    searchContentOnRef = (component) =>{
      let info = this.state.info;
      // 调用加载视图之前的自定义方法
      if(component && component.beforeLoad){
        info = component.beforeLoad(this.state.info);
      }
      // 设置查询内容，查询组件等
      this.setState({SearchContent:component,info,defaultVisible : false,popoverDisplay : ""});
    }
    /**
     * 搜索下拉展开事件
     * @param v
     */
    onVisibleChange = (v) =>{
      // 设置显示/隐藏
      this.setState({searchVisible: v,defaultVisible:false});
    }
    /***
     * 将默认搜索框的内容同步给更多搜索内
     *
     * @param v
     */
    inputOnChange = (e) =>{
      let v  = e.target.value;
      let info = {};
      info[this.state.searchName] = v;
      this.setState({searchText : v});
      this.props.form.setFieldsValue({...info})
    }

    setSearchText = (searchText) => {
      this.setState({searchText});
    }

    render() {

      const saveAsContent = (
        <div>
          <p>视图名称：<Input style={{ width: 150 }} value={this.state.viewName} onChange={e => this.setState({ viewName: e.currentTarget.value })} /></p>
          <div align="right"><Button type="primary" onClick={this.saveAsView }>保存</Button></div>
        </div>
      );
      const content = (
        <Layout style = {{background: "#FFFFFF"}}>
          <Content>
            <Form onSubmit={this.handleSubmit } style={{ width: 480 }} className={style.formstyle}>
              <SearchContent {...this.props } info = {this.state.info} setSearchText = {this.setSearchText }
                             onRef={this.searchContentOnRef }  >
              </SearchContent>
            </Form>
          </Content>
          <Footer style = {{background: "#FFFFFF"}}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>


              {
                this.props.getViewBtn && (
                  <Popover placement="topRight" title={"另存为视图"}
                           style={{ width: 88,marginLeft:10 }}
                           content={saveAsContent}
                           defaultVisible = {true}
                           visible={this.state.saveAsVisible}
                           onVisibleChange={(v) => this.setState({ saveAsVisible : v })}
                           trigger="click">
                    <Button >另存视图</Button>
                  </Popover>
                )
              }
              {
                ( this.state.viewId && this.state.viewId != -1 && this.props.getViewBtn ) &&
                (
                  <Button  style={{ width: 88,marginLeft:10 }} onClick={this.saveView}>保存视图</Button>
                )
              }
              <Button style={{ width: 88,marginLeft:10 }}  onClick={() => this.props.form.resetFields()}>重置</Button>
              <Button type="primary" onClick={this.search } style={{ width: 88,marginLeft:10 }} >搜索</Button>
            </div>
          </Footer>
        </Layout>
      )
      return (
        <div className={style.main}>
          <span>
              <Icon type="search" className={style.icon} onClick = {this.search } />
              <input type="text" placeholder={this.props.placeholder || "名称"} onChange = {this.inputOnChange} value={this.state.searchText} ref={input => this.input = input} />
          </span>
          <span onClick={this.search.bind(this)} className={style.search}>搜索</span>
          <span style = {{display:this.state.popoverDisplay}}>
            <Popover placement="bottomRight" content={content}
                     trigger="click"
                     title = {"搜索"}
                     defaultVisible = {this.state.defaultVisible}
                     visible={this.state.searchVisible || this.state.defaultVisible}
                     onVisibleChange={this.onVisibleChange}>
              <Icon type={"unordered-list"} rotate={this.state.searchVisible ? 270 : 0} style={{ fontSize: 16, marginLeft: 5, verticalAlign: "sub" }} />
            </Popover>
          </span>
        </div>
      )
    }
  }
  return Form.create()(SearchView_);
}
