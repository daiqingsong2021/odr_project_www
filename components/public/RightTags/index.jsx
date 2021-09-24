import React, { Component } from 'react';
import { Tooltip, Icon, Spin, notification } from 'antd';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import style from './style.less';
import axios from '../../../api/axios'
import * as layoutUtil from '../Layout/layoutUtil'

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
      rightMenu : {"1":[]},
			width: '', // 组织机构控制右侧宽度
			currentIndex: null,// 图标位置
		};
	}

	getTagsList = () => {
		axios.get('/api/sys/menu/label/' + this.props.menuCode + '/infos').then(res => {
			if (res.data.data) {
				this.setState({
					rightMenu: res.data.data
				})
			}
		})
	}

  /**
   * 设置页签会话缓存
   * @param data
   */
	setLabelInfo(data){
    layoutUtil.setLabelInfo(this.props.menuCode,data);
  }

  /**
   * 获取页签会话缓存
   *
   * @returns {string | {}}
   */
  getLabelInfo=()=>{
    return layoutUtil.getLabelInfo(this.props.menuCode);
	}

	componentDidMount() {
		if(this.props.openRight){
			this.openRightBox('Suzhou/Modules/Security/InsidelTraining/Study', 1,'学习人员')
		}
		this.getTagsList();
		if (this.props.rightData == null) {
			this.setState({
				content: false,
			},() => {
        // 主页面设置为初始化宽度
        // this.renderInitWidth();
      });
		}
		// 初始化css样式
		const h = document.documentElement.clientHeight || document.body.clientHeight;   // 浏览器高度，用于设置组件高度
		this.setState({
			height: h - 290,
		});
	}
	componentWillReceiveProps(newProps, state) {
		if (this.state.content && (newProps.rightData == null || newProps.groupCode == -1)) {
			this.setState({
				content: false,
			},() => {

        let {showLabels} = this.getLabelInfo();

        if(showLabels != false){
          this.renderInitWidth(newProps);
        }
      });
		}

		if(newProps.groupCode != -1 ){
      if (newProps.groupCode != this.props.groupCode && this.state.content) {
        const {rightMenu,currentTitle}=this.state;
        let rm = rightMenu[newProps.groupCode] || {};
        let index=rm.findIndex(item=>item.menuName==currentTitle)
        if(index>-1){
          this.setState({
            fileUrl:rightMenu[newProps.groupCode][index].url,
            currentIndex:index
          })
        }else{
          this.setState({
            fileUrl:rightMenu[newProps.groupCode][0].url,
            currentIndex:0
          })
		}
      }
    }
	}

	// 关闭
	closeRightBox = () => {
		this.props.rightIconBtn ? this.props.rightIconBtn() : null;
		this.setState({
			content: false,
			currentIndex: null,
		},() => {
		  // 主页面设置为初始化宽度
      this.renderInitWidth();
    });
	};

  /**
   * 主页面设置为初始化宽度
   */
  renderInitWidth = () =>{
    if(this.props.renderWidth){
      const widowsWidth = document.documentElement.clientWidth || document.body.clientWidth;
      const renderWidth = widowsWidth - 40;
      this.setLabelInfo({renderWidth});
      this.props.renderWidth({contentWidth : renderWidth, showLabels : false});
    }
  }
	// 通过tag组件点击的标签，切换相应的内容组件
	openRightBox = (fileUrl, index,title) => {
		if (this.props.rightData) {
			const { content } = this.state;
			this.props.rightHide ? this.props.rightHide() : null;
			this.setState({
				fileUrl,
				content: true,
				isLoading: false,
				currentIndex: index,
				currentTitle:title
			},() => {
        if(this.props.renderWidth){

          let {renderWidth,lastRenderWidth} = this.getLabelInfo();
          let showLabels = true;
          if(!content){
            if(!lastRenderWidth){
              renderWidth = this.getInitSelectRenderWidth();
              this.setLabelInfo({renderWidth,lastRenderWidth : renderWidth})
            }else{
              renderWidth = lastRenderWidth;
            }
          }
          this.props.renderWidth( {contentWidth : renderWidth, showLabels : showLabels});
        }
      });
		} else {
			notification.warning(
				{
					placement: 'bottomRight',
					bottom: 50,
					duration: 2,
					message: '未选中数据',
					description: '请选择数据进行操作'
				}
			)
		}

	};
	changeFileUrl = (fileUrl) => {
		this.setState({
			fileUrl: fileUrl
		})
	}

  /**
   * 获取选中页签，左侧区域的初始宽度
   *
   * @returns {number}
   */
	getInitSelectRenderWidth = () => {
    const widowsWidth = document.documentElement.clientWidth || document.body.clientWidth;
    const width = widowsWidth * 0.6; // 右侧弹出框宽度;
    let renderWidth = widowsWidth - width -40;
    return renderWidth;
  }

	render() {
		const widowsWidth = document.documentElement.clientWidth || document.body.clientWidth;
		const id = Math.random().toString(36).substr(2);
		let box;
		let type = false;
		let {lastRenderWidth} = this.getLabelInfo()

		const width = lastRenderWidth ? widowsWidth - lastRenderWidth -40 : (widowsWidth * 0.6); // 右侧弹出框宽度;
    let labelWidth = width;

		let isLoading = false;
    let tableThis = this;
		// 鼠标拖动时，设置div宽度
		function onmousemove(pad, e) {
			box = document.getElementById(id);
			if (type) {
				let event = null
				if (pad != 'pad') {
					event = e || window.event;
				} else {
					event = e.changedTouches[0]
				}
				let renderWidth = 0;
				if ((widowsWidth - event.clientX - 50) < 400) {
          renderWidth = widowsWidth - 400 -40;
					box.style.width = `${400}px`;
				} else {
					if (widowsWidth - event.clientX - 50 > widowsWidth - 100) {
            renderWidth = 50;
						box.style.width = `${widowsWidth - 100}px`;
					} else {
            renderWidth = event.clientX;
						box.style.width = `${widowsWidth - event.clientX - 40}px`;
					}
				}
        let labelWidth = widowsWidth - renderWidth;
        tableThis.setLabelInfo({renderWidth,labelWidth,lastRenderWidth: renderWidth});
			}
		}

		// 鼠标抬起时,移除全局监听事件
		function onmouseup(e) {
			if (type) {
				type = false;
				isLoading = false;
        if(tableThis.props.renderWidth){
          const {renderWidth} = tableThis.getLabelInfo();
          tableThis.props.renderWidth({contentWidth : renderWidth, showLabels : true});
        }

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
			loading: () => <Spin size="small" />,
		});
		let groupCode = this.props.groupCode != undefined ? this.props.groupCode : 1
		const MyIcon = Icon.createFromIconfontCN({
			scriptUrl: '/static/fonts/rightIcon/iconfont.js', // 在 iconfont.cn 上生成
		});
	let labelMainId = this.props.menuCode + "-LabelsGroup";
		return (

			<div className={style.main} id = {labelMainId} data-contentwidth = {this.state.width === '' ? width : this.state.width} style={{ height: this.props.height ? this.props.height : this.state.height + 100 }}>
				{this.state.content && (
					<div id={id} className={style.content} data-content={"LabelsGroup"} style={{ width: this.state.width === '' ? width : this.state.width }}>
						<div className={style.border} onMouseDown={onmousedown.bind(this)} onTouchStart={onmousedown} onTouchMove={onmousemove.bind(this, 'pad')} onTouchEnd={onmouseup}>
							<Icon type="caret-left" className={style.leftIcon} />
							<Icon type="caret-right" className={style.rightIcon} />
						</div>
						<div className={style.rightClose} onClick={this.closeRightBox}>
							<Icon type="double-right" />
						</div>
						{this.state.isLoading ? (
							<Spin />
						) : (
								<ComponentsForm
									data={this.props.rightData}
									closeRightBox={this.closeRightBox}
									currentTitle={this.state.currentTitle}
									submitData={this.props.submitData}
									changeFileUrl={this.changeFileUrl}
									{...this.props} // 所有方法属性往组件透传
                  title = {this.state.currentTitle }
                  height = {this.state.height + 100}
                  labelWidth = {labelWidth }
								/>
							)}
					</div>
				)}
				<div className={style.list}>
					
					<div style={{ border: "1px solid #f2f2f2", padding: "5px 0" }}>
						{this.state.rightMenu && groupCode != -1 && this.state.rightMenu[groupCode] && this.state.rightMenu[groupCode].map((item, index) => {
							return (
								<Tooltip key={index} placement="left" title={item.menuName} overlayStyle={{ backgroundColor: 'white' }}>
									<li onClick={this.openRightBox.bind(this, item.url, index,item.menuName)} className={this.state.currentIndex == index ? "homeActivity" : null}>
										<MyIcon type={item.image} style={{ fontSize: '18px', color: this.state.currentIndex == index ? "white" : null }} />
									</li>
								</Tooltip>)
						})}

					</div>
				</div>
				<div>

				</div>
			</div>
		);
	}
}

export default connect()(TopTags);
