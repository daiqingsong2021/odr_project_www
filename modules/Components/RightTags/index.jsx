import React, {Component} from 'react';
import { Icon, Spin, message, notification} from 'antd';
import dynamic from 'next/dynamic';
import {connect} from 'react-redux';
import style from './style.less';
import Tags from './tags';

class TopTags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: false,
      height: '',
      isLoading: true,
      fileUrl: '',
      data: [],                   // 左侧模块点击传的参
      rightTagList: [],
      width: '', // 组织机构控制右侧宽度
      currentIndex: null,// 图标位置
    };
  }

  static getDerivedStateFromProps(nextProps,state) {
   
     if (!nextProps.rightData) {
      return {content: false, fileUrl: false, currentIndex: null};
    }
    
    if(state.currentIndex!=null){
    }
    
    if(state.currentIndex!=null && nextProps.rightTagList[state.currentIndex].fielUrl!=state.fileUrl){
      return {fileUrl:nextProps.rightTagList[state.currentIndex].fielUrl}
    }
    return null;
  }
  
  componentDidMount() {
    if (this.props.rightData == null) {
      this.setState({
        content: false
      });
    }
    
    // 初始化css样式
    const h = document.documentElement.clientHeight || document.body.clientHeight;   // 浏览器高度，用于设置组件高度
    this.setState({
      height: h - 200,
    });
  }

  // 关闭
  closeRightBox = () => {
    this.setState({
      content: false,
      currentIndex: null,
    })
  };

  // 通过tag组件点击的标签，切换相应的内容组件
  openRightBox = (fileUrl, index) => {
    if (this.props.rightData) {
      const {content} = this.state;
      this.setState({
        fileUrl,
        content: true,
        isLoading: false,
        currentIndex: index,
      });
    } else {
      notification.warning(
        {
          placement: 'bottomRight',
          bottom: 50,
          duration: 2,
          message:'未选中数据',
          description:'请选择数据进行操作'
        }
      )
    }

  };
  changeFileUrl = (fileUrl) => {
    this.setState({
      fileUrl: fileUrl
    })
  }

  render() {
    const widowsWidth = document.documentElement.clientWidth || document.body.clientWidth;
    const id = Math.random().toString(36).substr(2);
    let box;
    let type = false;
    const width = document.documentElement.clientWidth * 0.7 || document.body.clientWidth * 0.7; // 右侧弹出框宽度;
    let isLoading = false;

    // 鼠标拖动时，设置div宽度
    function onmousemove(e) {
      box = document.getElementById(id);
      if (type) {
        const event = e || window.event;
        const target = event.target || event.srcElement;
        if ((widowsWidth - event.clientX - 50) < 400) {
          box.style.width = `${400}px`;
        } else {
          if (widowsWidth - event.clientX - 50 > widowsWidth - 100) {
            box.style.width = `${widowsWidth - 100}px`;
          } else {
            box.style.width = `${widowsWidth - event.clientX - 50}px`;
          }
        }
      }
    }

    // 鼠标抬起时,移除全局监听事件
    function onmouseup(e) {
      if (type) {
        type = false;
        isLoading = false;
        window.removeEventListener('mouseup', onmouseup, false);
        window.removeEventListener('mousemove', onmousemove, false);
      }
    }

    // 鼠标点下，添加全局监听鼠标事件
    function onmousedown(e) {
      if (!type) {
        window.addEventListener('mouseup', onmouseup);
        window.addEventListener('mousemove', onmousemove);
        const event = e || window.event;
        const target = event.target || event.srcElement;
        const x = event.clientX - target.offsetLeft;
        type = true;
        isLoading = true;
        e.preventDefault();
      }
    }

    const ComponentsForm = dynamic(import(`../../../modules/${this.state.fileUrl}/index`), {
      loading: () => <Spin size="small"/>,
    });
    return (
      <div className={style.main} style={{height: this.state.height}}>
        {this.state.content && (
          <div id={id} className={style.content} style={{width: this.state.width === '' ? width : this.state.width}}>
            <div className={style.border} onMouseDown={onmousedown}>
              <Icon type="caret-left" className={style.leftIcon}/>
              <Icon type="caret-right" className={style.rightIcon}/>
            </div>
            <div className={style.rightClose} onClick={this.closeRightBox}>
              <Icon type="double-right"/>
            </div>
            {this.state.isLoading ? (
              <Spin/>
            ) : (
              <ComponentsForm
                data={this.props.rightData}
                closeRightBox={this.closeRightBox}
                submitData={this.props.submitData}
                changeFileUrl={this.changeFileUrl}
                {...this.props} // 所有方法属性往组件透传
              />
            )}
          </div>
        )}
        <div className={style.list}>
          <Tags
            rightTagList={this.props.rightTagList}
            openRightBox={this.openRightBox}
            currentIndex={this.state.currentIndex}
          />
        </div>
      </div>
    );
  }
}

export default connect()(TopTags);
