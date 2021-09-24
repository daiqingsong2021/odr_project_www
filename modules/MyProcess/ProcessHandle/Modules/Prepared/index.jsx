import React, { Component } from 'react'
import { Modal, message, notification, Icon } from 'antd';
import moment from 'moment';
import RightTags from '../../../../../components/public/RightTags'
import style from './style.less'
import '../../../../../static/fonts/icon1/iconfont'

import { connect } from 'react-redux'

import axios from "../.././../../../api/axios"
import {
	getPreparedTreeList,
	getuserauthtree,
	addPlanWbs,
	defineOrgTree,
	defineOrgUserList,
	getBaseSelectTree,
	addPlanTask,
	deletePlanTask,
	updatePlanTask,
	updatePlanWbs,
} from "../../../../../api/api"
import { func } from 'prop-types';
import * as util from '../../../../../utils/util';

let gantt = new CreateGantt();
let GanttMenu = function () {
	GanttMenu.superclass.constructor.call(this);
}

let currentRow = null
const confirm = Modal.confirm;

export class PlanPrepared extends Component {
	constructor(props) {
		super(props)
		this.state = {
			contentWidth: '',
			borderLeft: '',
			left: '',
			ganttHeight: '',
			currentData: {}, //选中行数据
			activeIndex: [],
			rightData: [],
			visible: false,
			rightTags: [
				{ icon: 'iconjibenxinxi', title: '基本信息', fielUrl: 'Plan/Prepared/Info' },
				{ icon: 'iconwenjian', title: '文件信息', fielUrl: 'Components/FileInfo' },
				{ icon: 'iconjihuaguanlian', title: '计划关联', fielUrl: 'Plan/Prepared/PlanAcco' },
				{ icon: 'iconguanxitu', title: '逻辑关系', fielUrl: 'Plan/Components/Logic' },
				{ icon: 'iconiconziyuan6', title: '资源计划', fielUrl: 'Plan/Components/ResPlan' },
				{ icon: 'iconjiaofuqingdan', title: '交付清单', fielUrl: 'Components/DeliveryList' },
				{ icon: 'iconjindujixian', title: '进度基线', fielUrl: 'Plan/Prepared/Baseline' },
				{ icon: 'iconrizhi', title: '进展日志', fielUrl: 'Plan/Components/Log' },
				{ icon: 'iconbiangengxinxi', title: '变更信息', fielUrl: 'Plan/Prepared/ChangeInfo' },
			
			],
			selectArray: [3],
			data: [],
			dataMap: [],
			orgTree: [],
			orgUserList: [],
			planTypeData: [],
			planLevelData: [],
			planTaskTypeData: [],
			planTaskDrtnTypeData: []
		}
	}

	componentWillMount() {
		mini.extend(GanttMenu, mini.Menu, {
			_create: function () {
				GanttMenu.superclass._create.call(this);

				var menuItems = [{
					type: "menuitem",
					iconCls: "icon-mycopy",
					text: mini.Gantt.Add_WBS,
					name: "addwbs"
				},
				{
					type: "menuitem",
					iconCls: "icon-mycopy",
					text: mini.Gantt.Add_Task,
					name: "addtask"
				},
				{
					type: "menuitem",
					iconCls: "icon-mycopy",
					text: mini.Gantt.Remove_Text,
					name: "remove"
				},
				{
					type: "menuitem",
					iconCls: "icon-mycopy",
					text: mini.Gantt.Copy,
					name: "copy"
				},
				{
					type: "menuitem",
					iconCls: "icon-mycopy",
					text: mini.Gantt.Stick,
					name: "stick"
				},
				{
					type: "menuitem",
					iconCls: "icon-mycopy",
					text: mini.Gantt.Wbs_To_Task,
					name: "wbstotask"
				},
				{
					type: "menuitem",
					iconCls: "icon-mycopy",
					text: mini.Gantt.Task_To_Wbs,
					name: "tasktowbs"
				},
				{
					type: "menuitem",
					iconCls: "icon-mycopy",
					text: mini.Gantt.Expansion,
					name: "expansion"
				},
				{
					type: "menuitem",
					iconCls: "icon-mycopy",
					text: mini.Gantt.Close_Plan,
					name: "closeplan"
				},
				{
					type: "menuitem",
					iconCls: "icon-mycopy",
					text: mini.Gantt.ShowOrHide_colum,
					name: "showOrHidecolum"
				}
				];
				this.setItems(menuItems);

				this.addwbs = mini.getbyName("addwbs", this);
				this.addtask = mini.getbyName("addtask", this);
				this.remove = mini.getbyName("remove", this);
				this.copy = mini.getbyName("copy", this);
				this.stick = mini.getbyName("stick", this);
				this.tasktowbs = mini.getbyName("tasktowbs", this);
				this.wbstotask = mini.getbyName("wbstotask", this);
				this.expansion = mini.getbyName("expansion", this);
				this.closeplan = mini.getbyName("closeplan", this);
				this.showOrHidecolum = mini.getbyName("showOrHidecolum", this);

				this.addwbs.on("click", this.__OnAddwbs, this);
				this.addtask.on("click", this.__OnAddtask, this);
				this.remove.on("click", this.__OnRemove, this);
				this.copy.on("click", this.__OnCopy, this);
				this.stick.on("click", this.__OnStick, this);
				this.expansion.on("click", this.__OnExpansion, this);
				this.closeplan.on("click", this.__OnCloseplan, this);
			},
			__OnAddwbs: this.addWbs,
			__OnAddtask: this.addTask,
			__OnRemove: this.removeRow,
			__OnCopy: this.copyRow,
			__OnStick: this.stickRow,
			__OnExpansion: this.expansion,
			__OnCloseplan: this.closePlan
		});
	}

	// 右键执行添加下级WBS
	addWbs = () => {
		this.topTagComponent.showFormModal('WbssTopBtn', { key: 2 })
	}

	// 右键执行添加任务
	addTask = () => {
		this.topTagComponent.showFormModal('TasksTopBtn', { key: 1 })
	}

	// 右键删除
	removeRow = () => {
		this.setState({
			visible: !this.state.visible
		})
	}

	// 右键复制
	copyRow = () => {
		currentRow = gantt.getSelected()
		if (currentRow) {
			notification.success(
				{
					placement: 'bottomRight',
					bottom: 50,
					duration: 2,
					message: '复制成功！',
					description: '成功复制所选行'
				}
			)
		}
	}

	// 右键粘贴
	stickRow = () => {
		const spreadData = {
			taskName: currentRow.name,
			taskCode: currentRow.code,
			orgId: currentRow.org ? currentRow.org.id : '',
			planStartTime: currentRow.planStartTime,
			planEndTime: currentRow.planEndTime,
			planDrtn: currentRow.planDrtn,
			planQty: currentRow.planQty,
			planType: currentRow.planType ? currentRow.planType.id : '',
			planLevel: currentRow.planLevel ? currentRow.planLevel.id : '',
			remark: currentRow.remark,
			projectId: currentRow.projectId,
			defineId: currentRow.defineId,
			taskType: currentRow.taskType
		}
		if (currentRow.nodeType == 'wbs') {
			const data = {
				...spreadData,
				isFeedback: currentRow.feedbackStatus ? currentRow.feedbackStatus.id : '',
				controlAccount: currentRow.controlAccount
			}
			this.addPlanWbs(data, true)
			return
		}
		if (currentRow.nodeType == 'task') {
			const data = {
				...spreadData,
				taskType: currentRow.taskType,
				drtnType: currentRow.drtnType
			}
			this.addPlanTask(data, true)
			return
		}
	}

	// 右键展开
	expansion = () => {
		gantt.expand(gantt.getSelected())
	}

	// 右键删除确认弹窗
	handleOk = () => {
		this.setState({
			visible: !this.state.visible
		})
		this.topTagComponent.showFormModal('DeleteTopBtn')
	}

	// 右键关闭计划
	closePlan = () => {
		gantt.collapse(gantt.getSelected())
	}

	componentDidMount() {
		axios.get(getuserauthtree).then(res => {
			const { data } = res.data
			data && this.getPreparedTreeList([33]) //data[0].id
		})
		let h = document.documentElement.clientHeight || document.body.clientHeight;   //浏览器高度，用于设置gantt高度作用
		let w = document.documentElement.clientWidth / 2 || document.body.clientWidth / 2; //右侧弹出框高度
		this.setState({
			contentWidth: w - 41,
			borderLeft: w,
			left: w,
			ganttHeight: h - 200
		})
		// 实例化gantt，将gantt赋值到state中，以便全局操作，获取gantt。
		gantt.setStyle("width:100%; height:100%;");
		gantt.setMultiSelect(true);

		/* -------------以下进行自定义列------------- */
		let columns = []
		//String => 名称
		let ganttColumn = {
			name: "name",
			header: "名称<br/>String",
			field: "name",
			width: 260,
			editor: {
				type: "textbox"
			}
		};
		columns.push(ganttColumn);

		//String => 代码
		let ganttColumn2 = {
			name: "code",
			header: "代码<br/>String",
			field: "code",
			width: 100,
			editor: {
				type: "textbox"
			}
		};
		columns.push(ganttColumn2);

		//String => 责任主体
		let ganttColumn3 = {
			name: "org",
			header: "责任主体<br/>String",
			field: "orgName",
			width: 100,
			editor: {
				type: "textbox"
			}
		};
		columns.push(ganttColumn3);

		//String => 责任人
		let ganttColumn4 = {
			name: "user",
			header: "责任人<br/>String",
			field: "userName",
			width: 80,
			editor: {
				type: "textbox"
			}
		};
		columns.push(ganttColumn4);

		//Date => 计划开始时间
		let ganttColumn5 = {
			header: "计划开始时间<br/>Date",
			field: "planStartTime",
			width: 150,
			renderer: function (e) {
				var date = e.value;
				if (!date) return "";
				//return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
				return date
			},
			editor: {
				type: "datepicker"
			}

		};
		columns.push(ganttColumn5);

		//Date => 计划完成时间
		let ganttColumn6 = {
			header: "计划完成时间<br/>Date",
			field: "planEndTime",
			width: 150,
			renderer: function (e) {
				var date = e.value;
				if (!date) return "";
				//return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
				return date
			},
			editor: {
				type: "datepicker"
			}

		};
		columns.push(ganttColumn6);

		//String => 计划工期
		let ganttColumn7 = {
			name: "planDrtn",
			header: "计划工期<br/>String",
			field: "planDrtn",
			width: 80,
			editor: {
				type: "textbox"
			}
		};
		columns.push(ganttColumn7);

		//String => 计划工时
		let ganttColumn8 = {
			name: "planQty",
			header: "计划工时<br/>String",
			field: "planQty",
			width: 100,
			editor: {
				type: "textbox"
			}
		};
		columns.push(ganttColumn8);

		//String => 计划类型
		let ganttColumn11 = {
			name: "planType",
			header: "计划类型<br/>String",
			field: "planType",
			width: 80,
			editor: {
				type: "textbox"
			}
		};
		columns.push(ganttColumn11);

		//String => 计划级别
		let ganttColumn12 = {
			name: "planLevel",
			header: "计划级别<br/>String",
			field: "planLevel",
			width: 80,
			editor: {
				type: "textbox"
			}
		};
		columns.push(ganttColumn12);

		//String => 作业类型
		let ganttColumn13 = {
			name: "taskType",
			header: "作业类型<br/>String",
			field: "taskType",
			width: 80,
			editor: {
				type: "textbox"
			}
		};
		columns.push(ganttColumn13);

		//String => 工期类型
		let ganttColumn14 = {
			name: "drtnType",
			header: "工期类型<br/>String",
			field: "drtnType",
			width: 120,
			editor: {
				type: "textbox"
			}
		};
		columns.push(ganttColumn14);

		//String => 发布人
		let ganttColumn18 = {
			name: "releaseUser",
			header: "发布人<br/>String",
			field: "releaseUser",
			width: 100,
			editor: {
				type: "textbox"
			}
		};
		columns.push(ganttColumn18);

		//Date => 发布日期
		let ganttColumn19 = {
			header: "发布日期<br/>Date",
			field: "publicTime",
			width: 100,
			renderer: function (e) {
				var date = e.value;
				if (!date) return "";
				//return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
				return date
			},
			editor: {
				type: "datepicker"
			}

		};
		columns.push(ganttColumn19);

		//String => 计划状态
		let ganttColumn20 = {
			name: "status",
			header: "计划状态<br/>String",
			field: "status",
			width: 100,
			editor: {
				type: "textbox"
			}
		};
		columns.push(ganttColumn20);

		//String => 备注
		let ganttColumn21 = {
			name: "remark",
			header: "备注<br/>String",
			field: "remark",
			width: 100,
			editor: {
				type: "textbox"
			}
		};
		columns.push(ganttColumn21);

		//将列集合数组设置给甘特图
		gantt.setColumns(columns);
		gantt.setTreeColumn("name");

		/* -------------设置Column结束------------- */

		/* -------------自定义单元格开始------------- */
		gantt.on("drawcell", function (e) {
			var task = e.record, column = e.column, field = e.field;
			if (column.name == "name") {
				if(task.nodeType == 'project') {
					e.cellHtml = '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-xiangmuqun"></use></svg> ' + task.name
					return
				}
				if(task.nodeType == 'define') {
					e.cellHtml = '<svg class="icon"  style="font-size:16px;" aria-hidden="true"><use xlink:href="#icon-jihua1"></use></svg> ' + task.name
					return
				}
				if(task.nodeType == 'wbs') {
					e.cellHtml = '<svg class="icon" style="font-size:16px;" aria-hidden="true"><use xlink:href="#icon-WBS"></use></svg> ' + task.name
					return
				}
				if(task.nodeType == 'task') {
					e.cellHtml = '<svg class="icon" aria-hidden="true"><use xlink:href="#icon-renwu1"></use></svg> ' + task.name
					return
				}	
			}
			if (column.name == "org") e.cellHtml = task.org ? task.org.name : ''
			if (column.name == "user") e.cellHtml = task.user ? task.user.name : ''
			if (column.name == "planType") e.cellHtml = task.planType ? task.planType.name : ''
			if (column.name == "planLevel") e.cellHtml = task.planLevel ? task.planLevel.name : ''
			if (column.name == "taskType") {
				switch (task.taskType) {
					case 1:
						e.cellHtml = "作业任务";
						break;
					case 2:
						e.cellHtml = "开始里程碑";
						break;
					case 3:
						e.cellHtml = "完成里程碑";
						break;
					case 4:
						e.cellHtml = "资源任务";
						break;
					default:
						e.cellHtml = "";
						break;
				}
			}
			if (column.name == "drtnType") e.cellHtml = task.drtnType ? task.drtnType.name : ''
			if (column.name == "releaseUser") e.cellHtml = task.releaseUser ? task.releaseUser.name : ''
			if (column.name == "status") e.cellHtml = task.status ? task.status.name : ''
		})
		/* -------------自定义单元格结束------------- */

		/* -------------创建右键菜单开始------------- */
		let menu = new GanttMenu()
		gantt.setContextMenu(menu)

		//监听菜单的opening事件，此事件在菜单显示前激发。可以控制菜单项的显示和可操作。
		menu.on("beforeopen", function (e) {
			let gantt = this.owner;       //PlusProject对象
			let task = gantt.getSelected();
			if (!task) {
				e.cancel = true;
				return;
			}

			//显示和可编辑所有菜单项
			this.addwbs.show();
			this.addtask.show();
			this.remove.show();
			this.copy.show();
			this.stick.show();
			this.tasktowbs.show();
			this.wbstotask.show();
			this.expansion.show();
			this.closeplan.show();
			this.showOrHidecolum.show();


			// this.add.show();
			// this.edit.show();
			// this.remove.show();

			// this.upgrade.enable();
			// this.downgrade.enable();

			// if (task.Summary) {
			// 	this.edit.hide();
			// 	this.remove.hide();

			// 	this.upgrade.disable();
			// 	this.downgrade.disable();
			// } else {
			// 	this.add.hide();
			// }
		});
		/* -------------创建右键菜单结束------------- */

		// 选中行设置选中行内容
		gantt.on('beforeselect', (e) => {
			const data = gantt.getSelected()
			this.setState({
				rightData: [data]
			})
		})

	}

	// 获取下拉框字典
	getBaseSelectTree = (typeCode) => {
		axios.get(getBaseSelectTree(typeCode)).then(res => {
			const { data } = res.data
			// 初始化字典-计划-计划类型
			if (typeCode == 'plan.define.plantype') {
				this.setState({
					planTypeData: data
				})
			}

			// 初始化字典-计划-计划级别
			if (typeCode == 'plan.task.planlevel') {
				this.setState({
					planLevelData: data
				})
			}

			// 初始化字典-任务-作业类型
			if (typeCode == 'plan.project.tasktype') {
				this.setState({
					planTaskTypeData: data
				})
			}

			// 初始化字典-项目-工期类型
			if (typeCode == 'plan.project.taskdrtntype') {
				this.setState({
					planTaskDrtnTypeData: data
				})
			}
		})
	}

	// 删除选中甘特图行
	deleteTask = () => {
		var task = gantt.getSelected();
		if (task) {
			confirm({
				title: '删除选中项',
				okText: '确定',
				cancelText: '取消',
				content: "确定删除计划 \"" + task.name + "\" ？",
				onOk() {
					gantt.removeTask(task);
					message.success('删除成功')
				},
				onCancel() { },
			});
		} else {
			message.warning('请选中计划')
		}
	}

	// 获取选择计划列表
	openPlan = (selectArray) => {
		this.setState({
			selectArray: selectArray
		}, () => {
			this.getPreparedTreeList(selectArray)
		})
	}

	// 刷新甘特图列表
	refreshGanttList = (data) => {
		const loop = (value, _id) => {
			for (let k = 0; k < value.length; k++) {
				if (value[k].id === _id) {
					Object.assign(value[k], {
						UID: value[k]['id'], //唯一标识
						Start: value[k]['planStartTime'], //计划开始时间
						Finish: value[k]['planEndTime'], //计划结束时间
						Name: value[k]['name'], //显示文字
					});
					break;
				}

				if (value[k].children) {
					loop(value[k].children, _id);
				}
			}
		}

		const dataMap = util.dataMap(data);
		dataMap.map((v, i) => {
			loop(data, v.id)
		})
		
		gantt.loadTasks([...data]);
		gantt.unmask();
		gantt.render(document.getElementById('ganttCr'));
		gantt.setRowHeight(38) //gantt.rowHeight + 25

		// 开启只读模式
		gantt.setReadOnly(true);
	}

	// 扩展甘特图特有字段
	spreadGanttData = (data) => {
		return {
			...data,
			UID: data.id, //唯一标识
			Start: data.planStartTime, //计划开始时间
			Finish: data.planEndTime, //计划结束时间
			name: data.taskName ? data.taskName : data.name, //显示文字
		}
	}

	// 获取计划编制列表
	getPreparedTreeList = (defineIds) => {
		gantt.loading();
		axios.post(getPreparedTreeList, { defineIds }).then(res => {
			let { data } = res.data
			this.refreshGanttList(data)
		})
	}

	// 获取责任主体列表
	defineOrgTree = () => {
		const rightData = this.state.rightData[0]
		if (rightData.id) {
			axios.get(defineOrgTree(rightData.projectId || rightData.id)).then(res => {
				const { data } = res.data
				
				this.setState({
					orgTree: data ? data : []
				})
			})
		}
	}

	// 根据责任主体id获取责任人列表
	defineOrgUserList = (orgid) => {
		if (orgid) {
			axios.get(defineOrgUserList(orgid)).then(res => {
				this.setState({
					orgUserList: res.data.data
				})
			})
		}
	}

	// 添加WBS level: true为下级 false为同级
	addPlanWbs = (ndata, level) => {
		if (ndata) {
			const rightData = this.state.rightData[0];
			const parentTask = gantt.getParentTask(rightData)
			let parentId
			if (level) { //下级
				switch (rightData.nodeType) {
					case 'define':
						parentId = 0
						break;
					case 'wbs':
						parentId = rightData.id
						break;
					case 'task':
						parentId = rightData.parentId
						break;
					default:
						parentId = 0
				}
			} else {  //同级
				switch (rightData.nodeType) {
					case 'wbs':
						parentTask.nodeType == 'wbs' ? parentId = rightData.parentId : parentId = 0
						break;
					case 'task':
						parentId = rightData.parentId
						break;
					default:
						parentId = 0
				}
			}
			axios.post(addPlanWbs, { ...ndata, parentId }, true).then(res => {
				if (level) {
					gantt.addTask(this.spreadGanttData(res.data.data), "add", rightData)
				} else {
					gantt.addTask(this.spreadGanttData(res.data.data), "after", rightData)
				}
			})
		}
	}

	// 添加任务
	addPlanTask = (ndata) => {
		const rightData = this.state.rightData[0];
		const parentTask = gantt.getParentTask(rightData)
		let parentId
		if (parentTask.nodeType == 'wbs') {
			parentId = parentTask.id
		} else {
			parentId = 0
		}
		axios.post(addPlanTask, { ...ndata, parentId }, true).then(res => {
			gantt.addTask(this.spreadGanttData(res.data.data), "add", rightData)
		})
	}

	// 删除WBS和任务
	deletePlanTask = () => {
		const { rightData } = this.state;
		axios.deleted(deletePlanTask(rightData[0]['id']), null, true).then(res => {
			gantt.removeTask(rightData[0])
		})
	}

	// 修改WBS
	updatePlanWbs = (ndata) => {
		const rightData = this.state.rightData[0];
		axios.put(updatePlanWbs, ndata, true).then(res => {
			gantt.updateTask(rightData, this.spreadGanttData(ndata))
		})
	}

	// 修改任务
	updatePlanTask = (ndata) => {
		const rightData = this.state.rightData[0];
		axios.put(updatePlanTask, ndata, true).then(res => {
			gantt.updateTask(rightData, this.spreadGanttData(ndata))
		})
	}

	render() {
		const { orgTree, rightData, orgUserList, planTypeData, planLevelData, selectArray, planTaskTypeData, planTaskDrtnTypeData } = this.state
		return (
			<div>
				{/* <TopTags
					openPlan={this.openPlan} //选择计划列表
					defineOrgTree={this.defineOrgTree} //获取责任主体列表
					orgTree={orgTree}
					projectIds={selectArray}
					defineOrgUserList={this.defineOrgUserList} //根据责任主体id获取责任人列表
					orgUserList={orgUserList}
					rightData={rightData.length ? rightData[0] : {}}
					getBaseSelectTree={this.getBaseSelectTree} //获取下拉框字典
					planTypeData={planTypeData}
					planLevelData={planLevelData}
					planTaskTypeData={planTaskTypeData}
					planTaskDrtnTypeData={planTaskDrtnTypeData}
					addPlanWbs={this.addPlanWbs} //添加WBS
					addPlanTask={this.addPlanTask} //添加任务
					deletePlanTask={this.deletePlanTask} //删除任务
					ref={(node) => this.topTagComponent = node}
				/> */}
				<div className={style.main}>
					<div className={style.leftMain} style={{ height: this.props.height }}>
						<div className="miniFit" style={{ height: this.state.ganttHeight, minWidth: 'calc(100vw - 60px)' }}>
							<div ref="ganttCr" id="ganttCr" style={{ width: '100%', height: '100%' }}></div>
						</div>
					</div>
					<div className={style.rightBox} style={{ height: this.props.height }}>
						<RightTags
							rightTagList={this.state.rightTags}
							rightData={rightData.length ? rightData : null}
							data={rightData.length ? rightData[0] : null}
							getBaseSelectTree={this.getBaseSelectTree} //获取下拉框字典
							// planTypeData={planTypeData}
							// planLevelData={planLevelData}
							// planTaskTypeData={planTaskTypeData}
							// planTaskDrtnTypeData={planTaskDrtnTypeData}
							updatePlanWbs={this.updatePlanWbs}
							updatePlanTask={this.updatePlanTask}
							
						/>
					</div>
				</div>
				<Modal
					width={350}
					title="删除"
					visible={this.state.visible}
					onOk={this.handleOk}
					onCancel={this.removeRow}
				>
					<p style={{ textAlign: 'center', fontSize: 18, paddingTop: 10, paddingBottom: 10 }}>
						<Icon type="warning"
							style={{
								fontSize: 30,
								color: '#faad14'
							}} /> &nbsp;{this.props.deleteDesc ? this.props.deleteDesc : '确认要删除此项吗？'}
					</p>
				</Modal>
			</div>

		)
	}
}

export default connect(state => ({
	currentLocale: state.localeProviderData
}))(PlanPrepared);