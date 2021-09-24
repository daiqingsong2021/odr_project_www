//苏州项目
//--> 字典表
export const getBaseSelectTree = typeCode => `api/base/dict/${typeCode}/select/tree`; //保存更新全局设置

export const planProAuthTree = `api/plan/project/user/auth/tree`; //根据用户查询有权限的项目列表

export const getProjInfoList = 'api/szxm/rygl/projInfo/getProjInfoList'; //人员-基本信息
export const addPorjInfo = 'api/szxm/rygl/projInfo/addPorjInfo'; //人员-基本信息-增加
export const deletePorjInfo = 'api/szxm/rygl/projInfo/deletePorjInfo'; //人员-基本信息-删除
export const updatePorjInfo = 'api/szxm/rygl/projInfo/updatePorjInfo'; //人员-基本信息-修改
export const getsectionId = projectId => `api/sys/section/tree/${projectId}`; //查询标段树形信息
export const getProjInfo = id => `api/szxm/rygl/projInfo/getProjInfo/${id}`; //基本信息
export const getPeopleList = (projInfoId, pageSize, currentPageNum) =>
  `api/szxm/rygl/projInfo/${projInfoId}/getPeopleList/${pageSize}/${currentPageNum}`; //查询人员
export const addPeople = 'api/szxm/rygl/projInfo/addPeople'; //人员增加
export const updatePeople = 'api/szxm/rygl/projInfo/updatePeople'; //人员修改
export const deletePeople = 'api/szxm/rygl/projInfo/deletePeople'; //人员删除

export const getWarnHouseList = (projInfoId, pageSize, currentPageNum) =>
  `api/szxm/rygl/projInfo/${projInfoId}/getWarnHouseList/${pageSize}/${currentPageNum}`; //仓库列表
export const addWarnHouse = 'api/szxm/rygl/projInfo/addWarnHouse'; //仓库增加
export const deleteWarnHouse = 'api/szxm/rygl/projInfo/deleteWarnHouse'; //仓库删除
export const updateWarnHouse = 'api/szxm/rygl/projInfo/updateWarnHouse'; //仓库修改

export const getTsPlatList = (projInfoId, pageSize, currentPageNum) =>
  `api/szxm/rygl/projInfo/${projInfoId}/getTsPlatList/${pageSize}/${currentPageNum}`; //调试平台列表
export const deleteTsPlat = 'api/szxm/rygl/projInfo/deleteTsPlat'; //调试平台删除
export const addTsPlat = 'api/szxm/rygl/projInfo/addTsPlat'; //调试平台增加
export const updateTsPlat = 'api/szxm/rygl/projInfo/updateTsPlat'; //调试平台修改
//特殊工种
export const getSpecialWorkerList = (pageSize, currentPageNum) =>
  `api/szxm/rygl/specialWorker/getSpecialWorkerList/${pageSize}/${currentPageNum}`; //特殊工种列表
export const getSwTypeChose = 'api/szxm/rygl/specialWorker/getSwTypeChose'; //查询工种类型下拉内容
export const getOrgPeopleList = 'api/szxm/rygl/projInfo/getOrgPeopleList'; //查询项目基础信息以及人员信息
export const addSpecialWorker = 'api/szxm/rygl/specialWorker/addSpecialWorker'; //增加特殊工种
export const getSpecialWorker = id => `api/szxm/rygl/specialWorker/getSpecialWorker/${id}`; //查询单个特殊工种信息
export const deleteSpecialWorker = 'api/szxm/rygl/specialWorker/deleteSpecialWorker'; //删除特殊工种信息
export const updateSpecialWorker = 'api/szxm/rygl/specialWorker/updateSpecialWorker'; //修改特殊工种信息
export const getSpecialWorkerTypeList = (pageSize, currentPageNum) =>
  `api/szxm/rygl/specialWorker/getSpecialWorkerTypeList/${pageSize}/${currentPageNum}`; //查询特殊工种类型
export const deleteSpecialWorkerType = 'api/szxm/rygl/specialWorker/deleteSpecialWorkerType'; //删除特殊工种
export const addSpecialWorkerType = 'api/szxm/rygl/specialWorker/addSpecialWorkerType'; //增加特殊工种类型记录
export const getSpecialWorkerType = id => `api/szxm/rygl/specialWorker/getSpecialWorkerType/${id}`; //查询单个特殊工种类型信息
export const updateSpecialWorkerType = 'api/szxm/rygl/specialWorker/updateSpecialWorkerType'; //更新特殊工种类型
//定时器
export const getTimeTaskList = (pageSize, currentPageNum) =>
  `api/szxm/timeTask/getTimeTaskList/${pageSize}/${currentPageNum}`; //定时器列表
export const addTimeTask = 'api/szxm/timeTask/addTimeTask'; //新增定时器
export const deleteTimeTask = 'api/szxm/timeTask/deleteTimeTask'; //删除定时器
export const resumeTimeTask = id => `api/szxm/timeTask/resumeTimeTask/${id}`; //恢复定时器
export const pauseTimeTask = id => `api/szxm/timeTask/pauseTimeTask/${id}`; //暂停定时器
export const triggerTimeTask = id => `api/szxm/timeTask/triggerTimeTask/${id}`; //执行定时器
//人员变更
export const getPeopleChangeList = (pageSize, currentPageNum) =>
  `api/szxm/rygl/peopleChange/getPeopleChangeList/${pageSize}/${currentPageNum}`; //查询人员变更
export const deletePeopleChange = 'api/szxm/rygl/peopleChange/deletePeopleChange'; //删除人员变更
export const getPeopleChange = id => `api/szxm/rygl/peopleChange/getPeopleChange/${id}`; //查询单个人员变更信息
export const updatePeopleChange = 'api/szxm/rygl/peopleChange/updatePeopleChange'; //人员变更修改
export const addPeopleChange = 'api/szxm/rygl/peopleChange/addPeopleChange'; //增加人员变更
//人员进退场
export const getPeopleEntryList = (pageSize, currentPageNum) =>
  `api/szxm/rygl/peopleEntry/getPeopleEntryList/${pageSize}/${currentPageNum}`; //查询人员进退场
export const addPeopleEntry = 'api/szxm/rygl/peopleEntry/addPeopleEntry'; //增加人员退场
export const deletePeopleEntry = 'api/szxm/rygl/peopleEntry/deletePeopleEntry'; //删除人员退场
export const updatePeopleEntry = 'api/szxm/rygl/peopleEntry/updatePeopleEntry'; //人员退场修改
export const getPeopleEntry = id => `api/szxm/rygl/peopleEntry/getPeopleEntry/${id}`; //查询单个人员进退场信息
export const addPeopleEntryDetail = 'api/szxm/rygl/peopleEntry/addPeopleEntryDetail'; //增加项目人员进退场明细
export const getPeopleEntryDetailList = (enTryId, pageSize, currentPageNum) =>
  `api/szxm/rygl/peopleEntry/${enTryId}/getPeopleEntryDetailList/${pageSize}/${currentPageNum}`; //查询项目人员进退场明细列表
export const updatePeopleEntryDetail = 'api/szxm/rygl/peopleEntry/updatePeopleEntryDetail'; //修改人员进退场明细
export const deletePeopleEntryDetail = 'api/szxm/rygl/peopleEntry/deletePeopleEntryDetail'; //删除人员进退场明细
export const dowPeopTemp = 'api/szxm/rygl/peopleEntry/dowPeopTemp'; //人员模板导出（人员进退场明细、组织信息人员模块用）（格式为XSLX文件）
export const dowErrorWb = 'api/szxm/rygl/peopleEntry/dowErrorWb'; //错误日志导出（格式为XSLX文件）
export const uploadPeoEntryDetailFile = 'api/szxm/rygl/peopleEntry/uploadPeoEntryDetailFile'; //人员进退场明细导入
//人员通讯录
export const getOrgTree = (projectId)=>`api/szxm/rygl/addressBook/getOrgTree/${projectId}` //查询通讯录树
export const getPeople = (pageSize, currentPageNum) => `api/szxm/rygl/addressBook/getPeople/${pageSize}/${currentPageNum}` //查询人员信息

// 质量报监api
export const queryQuaSuperv = (pageSize, currentPageNum) =>
  `/api/szxm/zlgl/quaSuperv/queryQuaSuperv/${pageSize}/${currentPageNum}`;
export const updateQuaSuperv = () => `/api/szxm/zlgl/quaSuperv/updateQuaSuperv`; // 质量报监基本信息修改
export const queryQuaSupervDesc = () => `/api/szxm/zlgl/quaSuperv/queryQuaSupervDesc`; // 质量报监进展情况
export const queryBaseInfo = () => `/api/szxm/zlgl/quaSuperv/queryBaseInfo`; // 获取增加的信息
export const addQuaSuperv = () => `/api/szxm/zlgl/quaSuperv/addQuaSuperv`; // 确定增加
export const deleteQuaSuperv = () => `/api/szxm/zlgl/quaSuperv/deleteQuaSuperv`; // 删除
export const queryQuaSupervDescList = (supervisorId, pageSize, currentPageNum) =>
  `/api/szxm/zlgl/quaSuperv/${supervisorId}/queryQuaSupervDescList/${pageSize}/${currentPageNum}`; // 获取报监情况说明
export const addQuaSupervDesc = () => `/api/szxm/zlgl/quaSuperv/addQuaSupervDesc`; // 增加情况说明
export const updateQuaSupervDesc = () => `/api/szxm/zlgl/quaSuperv/updateQuaSupervDesc`; // 修改
export const deleteQuaSupervDesc = () => `/api/szxm/zlgl/quaSuperv/deleteQuaSupervDesc`; // 删除
export const getSectionTree = projectId => `/api/sys/section/tree/${projectId}`;
// 质量报验api
export const queryQuaInsp = (pageSize, currentPageNum) =>
  `/api/szxm/zlgl/quaInsp/queryQuaInsp/${pageSize}/${currentPageNum}`; // 获取表格
export const queryFlowQuaInsp = `/api/szxm/zlgl/quaInsp/queryFlowQuaInsp` // 发布流程表格
// 设备报验
export const queryDeviceCheckList = (pageSize, currentPageNum) =>
  `/api/szxm/sbgl/check/queryDeviceCheckList/${pageSize}/${currentPageNum}`; // 搜索设备报验数据列表
export const queryDeviceCheckInfo = id => `/api/szxm/sbgl/check/queryDeviceCheckInfo/${id}`; // 查询单个设备报验基础信息
export const addDeviceCheck = () => `/api/szxm/sbgl/check/addDeviceCheck`; // 增加设备报验数据中
export const updateDeviceCheck = () => `/api/szxm/sbgl/check/updateDeviceCheck`; // 修改设备报验数据
export const delDeviceCheck = () => `/api/szxm/sbgl/check/delDeviceCheck`; // 删除设备报验数据
export const queryDeviceRecordList = (pageSize, currentPageNum, type) =>
  `/api/szxm/sbgl/${type}/queryDeviceRecordList/${pageSize}/${currentPageNum}`; // 搜索设备明细列表
export const addDeviceRecord = () => `/api/szxm/sbgl/check/addDeviceRecord` // 增加设备明细
export const updateDeviceRecord = () => `/api/szxm/sbgl/check/updateDeviceRecord` // 修改设备明细
export const delDeviceRecord = (type) => `/api/szxm/sbgl/${type}/delDeviceRecord` // 删除设备明细
// 台账管理
// export const queryDeviceRecordList = (pageSize, currentPageNum) => 
//   `/api/szxm/sbgl/record/queryDeviceRecordList/${pageSize}/${currentPageNum}` // 搜索设备台账数据接口列表
// export const delDeviceRecord = () => `/api/szxm/sbgl/record/delDeviceRecord` // 逻辑删除设备台账（实为修改状态位）
export const querySpecialStaffList = (pageSize, currentPageNum) =>
  `/api/szxm/sbgl/record/querySpecialStaffList/${pageSize}/${currentPageNum}` // 查询特殊人员信息
export const queryDeviceRecordInfo = (id) => `/api/szxm/sbgl/record/queryDeviceRecordInfo/${id}` // 查询单个设备台账基础信息
export const addDeviceSpecialStaff = () => `/api/szxm/sbgl/record/addDeviceSpecialStaff` // 增加特殊人员信息
export const updateDeviceSpecialStaff = () => `/api/szxm/sbgl/record/updateDeviceSpecialStaff` // 修改特殊人员数据
export const delDeviceSpecialStaff = () => `/api/szxm/sbgl/record/delDeviceSpecialStaff` // 删除特殊人员信息
// 吊装管理
export const queryDeviceHoistingList = (pageSize, currentPageNum) =>
  `/api/szxm/sbgl/hoisting/queryDeviceHoistingList/${pageSize}/${currentPageNum}` // 查询设备吊装数据
export const queryDeviceHoistingInfo = (id) => `/api/szxm/sbgl/hoisting/queryDeviceHoistingInfo/${id}` // 查询单个设备吊装基础信息
export const addDeviceHoisting = () => `/api/szxm/sbgl/hoisting/addDeviceHoisting` // 增加设备吊装数据
export const updateDeviceHoisting = () => `/api/szxm/sbgl/hoisting/updateDeviceHoisting` // 修改设备吊装数据
export const delDeviceHoisting = () => `/api/szxm/sbgl/hoisting/delDeviceHoisting` // 删除设备吊装数据


export const addQuaInsp = () => `/api/szxm/zlgl/quaInsp/addQuaInsp`;
// 质量体系api
export const queryQuaSystem = () => `/api/szxm/zlgl/quaSystem/selectQuaSystemList`; //查询质量体系
export const queryQuaSystemAdd = () => `/api/szxm/zlgl/quaSystem/addQuaSystem`; //增加质量单元
export const queryQuaSystemPut = () => `/api/szxm/zlgl/quaSystem/updateQuaSystem`; //修改质量单元
export const queryQuaSystemDelete = () => `/api/szxm/zlgl/quaSystem/deleteQuaSystem`; //删除质量单元

//系统管理
export const menuMenuTree = (menuId) => `api/sys/menu/menu/tree/menuId/${menuId}` //系统管理-菜单管理

//公共api
export const getuserauthtree_ = (type) => `api/szxm/plan/define/user/auth/${type}/tree_`//打开计划–获取用户权限内的计划定义集合，包括（queryDefineTreeByUser参与任务的的计划定义集合）

//计划管理-计划定义
export const defineTree_ = (projectIds, type) => `api/szxm/plan/define/${projectIds}/${type}/tree_`//计划定义列表
export const defineInfo_ = (id) => `api/szxm/plan/define/${id}/info_`//获取计划定义
export const defineAdd_ = 'api/szxm/plan/define/add_'//新增
export const defineUpdate_ = 'api/szxm/plan/define/update_' //修改计划定义
export const defineDel_ = (id) => `api/szxm/plan/define/${id}/delete_`//删除计划定义
export const getPlanDefineListByProjectId_ = (projectId,planTypes) => `api/szxm/plan/define/${projectId}/${planTypes}/list_` // 打开计划–获取用户权限内的计划定义集合，包括（queryDefineTreeByUser参与任务的的计划定义集合）
export const getDefineListByUserAuthAndProjectId_ = projectId => `api/szxm/plan/define/${projectId}/auth/select/list_` //通过项目ID获取用户权限内的计划定义列表
export const getdefineIdListByProjectId_ = projectId => `api/szxm/plan/define/${projectId}/defineIdList_` //通过项目ID获取计划列表
export const getSectionIdsByDefineId = defineId => `api/szxm/plan/define/${defineId}/sectionId` //通过计划定义ID获取标段id
export const querySectionTreeList = (projectId) => `api/sys/section/tree/${projectId}`//获取标段数据
export const querySectionTreeList2 = (projectId) => `api/sys/project/section/tree/${projectId}`//获取标段数据
export const definePreConditionAdd_ = (projectId) =>`api`//新增前置条件计划

/// 计划编制
export const getPreparedTreeList_ = `api/szxm/plan/task/tree_` //获取前置条件树
export const releasePlanTaskTree_ = (projectId, type) => `api/szxm/plan/task/${projectId}/${type}/release/tree_` // 发布计划树
export const cancelReleasePlanTaskTree_ = (projectId, type) => `api/szxm/plan/task/${projectId}/${type}/cancelRelease/tree_` // 取消发布计划树
export const impPlan_ = (planType) => `api/szxm/plan/task/imp/${planType}/plan` //引入计划
export const planPreConditionTree_ = (taskId) => `api/szxm/plan/preCondition/${taskId}/tree` //前置条件页签

//前置条件
export const getPlanTaskPredList_ = taskId => `api/szxm/plan/task/${taskId}/pred/list_` // 获取紧前任务列表
export const getPlanTaskFollowList_ = taskId => `api/szxm/plan/task/${taskId}/follow/list_` // 获取后续任务列表
export const getPlanTaskPredAssginTree_ = defineId => `api/szxm/plan/task/${defineId}/pred/assgin/tree_` // 逻辑关系分配任务树
export const addPlanTaskPred_ = (taskId, predTaskId) => `api/szxm/plan/task/${taskId}/${predTaskId}/pred/add_` // 增加逻辑关系分配(前置任务)
export const updatePlanTaskPred_ = `api/szxm/plan/task/pred/update_` // 修改逻辑关系
export const deletePlanTaskPred_ = `api/szxm/plan/task/pred/delete_` // 删除逻辑关系分配


//项目文档
export const docProjectFolderTree_ = (projectId) => `api/szxm/doc/project/folder/${projectId}/tree`//文件夹列表
export const docCorpFolderTree_=`api/szxm/doc/corp/folder/tree`//企业文件夹列表
export const docCorpFolderTreeByMenuId_ = (menuId) => `api/szxm/doc/corp/folder/${menuId}/tree`//企业文件夹过滤菜单id
export const docProjectFolderAdd_ = 'api/szxm/doc/project/folder/add'//文件夹新建
export const docCorpFolderAdd_ = `api/szxm/doc/corp/folder/add`//企业文件夹新建
export const getDocProjectFolderById_ = (folderId) => `api/szxm/doc/project/folder/${folderId}/info`//获取文件夹信息
export const getDocCorpFolderById_ = (folderId) => `api/szxm/doc/corp/folder/${folderId}/info`//获取企业文件夹信息
export const docProjectFolderUpdate_ = 'api/szxm/doc/project/folder/update'//文件夹修改
export const docCorpFolderUpdate_ = `api/szxm/doc/corp/folder/update`//企业文件夹修改
export const docFolderDetete_ = (folderId) =>`api/szxm/doc/folder/${folderId}/delete`//删除文件夹

//基础数据
export const updateDictSortNum_ = (id,upOrDown) => `api/base/dict/update/${id}/${upOrDown}/sort`//码值排序
export const getCalendarDefaultInfo = `api/base/calendar/calc/pos/default/info`//获取默认日历信息


//项目团队
export const updateProjectTeamSort_ = (id,upOrDown) => `api/sys/projectteam/${id}/${upOrDown}/sort`//项目团队排序
export const updateUserByUserIdAndUpOrDown_ = (teamId,id,upOrDown) => `api/sys/projectteam/user/${teamId}/${id}/${upOrDown}/sort`//团队成员排序


//沟通
export const getMyQuestionList1 = (pageSize, currentPageNum) => `api/szxm/question/my/${pageSize}/${currentPageNum}/list`   //我的问题
export const getMyQuestionList2 = (pageSize, currentPageNum) => `api/szxm/question/my/${pageSize}/${currentPageNum}/user/list`   //我负责的问题
export const getMyQuestionList3 = (pageSize, currentPageNum) => `api/szxm/question/my/${pageSize}/${currentPageNum}/creator/list`   //我创建的问题
export const queryQuestionComu = (projectId, pageSize, currentPageNum) =>`api/szxm/question/${projectId}/${pageSize}/${currentPageNum}/list`
export const queryQueByBizIdAndBizType =(projectId,bizId,bizType) => `api/szxm/question/${projectId}/${bizId}/${bizType}/page/list`//项问题页签
export const questionAdd = `api/szxm/question/add`  // post 问题管理-增加项目问题
export const questionDelete = `api/szxm/question/delete`  // delete 问题管理-删除
export const questionUpdate = `api/szxm/question/update` // put 问题管理-修改问题
export const questionHandleList = questionId => `api/szxm/question/handle/${questionId}/list` // get 问题管理-处理记录
export const questionHandleAdd = `api/szxm/question/handle/add` // post 问题管理-新增处理记录
export const questionHandleDelete = `api/szxm/question/handle/delete`  // delete 问题管理-删除处理记录
export const questionHandleInfo = id => `api/szxm/question/handle/${id}/info` // get 问题处理-处理记录基本信息
export const questionHandleUpdate = `api/szxm/question/handle/update` // put 问题处理-修改处理记录
export const questionInfo = id => `api/szxm/question/${id}/info`  // get 沟通管理-基本信息
export const questionReleaseList = projectId => `api/szxm/question/${projectId}/release/list`  // get 问题管理-发布列表
export const questionCancelReleaselist = projectId => `api/szxm/question/${projectId}/cancel/release/list`  // get 问题管理-取消发布列表
export const questionRelease = `api/szxm/question/release` // put 问题管理-发布
export const questionCancelRelease = `api/szxm/question/cancel/release` // put 问题管理-取消发布项目问题
export const submitToNextUser = (nextUserId,handleId) => `api/szxm/questionconfirm/${nextUserId}/${handleId}/submit`//提交给下个一人处理
export const submitToQueCreator =(handleId) => `api/szxm/questionconfirm/${handleId}/submit`//提交给问题创建者
export const rejectQueHandle = `api/szxm/questionconfirm/reject`//驳回处理
export const confirmQueHandle = `api/szxm/questionconfirm/confirm`//确认处理
export const getConfirmVoList =(questionId) => `api/szxm/questionconfirm/${questionId}/list`//问题跟踪记录
export const getQueHandelList =(handleId) => `api/szxm/questionconfirm/handle/${handleId}/list`//处理跟踪记录
export const querySubmitAuth = (questionId) => `api/szxm/question/my/user/${questionId}/submit/auth`//获取提交权限

//实施计划
export const checkTotalDesignWorkload = `api/szxm/plan/task/check/workload`//验证设计总量与计划完成量
export const queryImplementTaskTree = `api/szxm/plan/implement/task/tree`//查询实施计划
export const getImplementDefinedSectionIds = (definedIds) => `api/szxm/plan/${definedIds}/sectionIds`//获取计划定义绑定的标段IDS
export const queryRelationMateriel = (fbId) => `api/szxm/plan/materiel/${fbId}/list`//获取关联物料信息
export const addRelationMateriel = `api/szxm/plan/materiel/add`//增加关联物料
export const updateRelationMateriel = `api/szxm/plan/materiel/update`//更新关联物料
export const deleteRelationMaterielByIds = (ids) => `api/szxm/plan/materiel/${ids}/batch/delete`//批量删除关联物料
export const deleteRelationMateriel = (id) => `api/szxm/plan/materiel/${id}/delete`//删除关联物料
export const getImplmentPlanAssginTree_ = (defineId,planType) => `api/szxm/plan/task/${defineId}/pred/assgin/${planType}/tree_`//实施计划前置条件分配计划树
export const getPlanTaskId_ = (implmentYTaskId) =>`api/szxm/plan/${implmentYTaskId}/get/taskId`//根据年度id获取总体id(根据月度计划id获取年度计划id)
export const getTotalTaskIdByMTaskId_ = (implmentYTaskId) =>`api/szxm/plan/${implmentYTaskId}/get/totalTaskId`//根据月度计划id获取总体计划id
export const queryPlanTaskStepList_ = (relationTaskId,taskId,type) => `api/szxm/planStep/${relationTaskId}/${taskId}/${type}/list`//工序列表
export const getPlanTaskStepInfo_ = (id) =>`api/szxm/planStep/${id}/info`//获取工序信息
export const addPlanTaskStep_ =`api/szxm/planStep/add`//新增工序
export const updatePlanTaskStep_ =`api/szxm/planStep/update`//更新工序
export const deletePlanTaskStep_ =`api/szxm/planStep/delete`//删除工序
export const isHaveStep_ = (taskId) =>`api/szxm/plan/task/${taskId}/ishaveStep`//是否有工序
export const isHaveStationByTaskId_ = (taskId) =>`api/szxm/station/detail/feedback/task/${taskId}/isHaveStation`//是否有车站

//问题api
export const queryQuestionList = (pageSize,currentPageNum) =>`api/szxm/ques/queryQuestionList/${pageSize}/${currentPageNum}`  //获取问题列表
export const getReviewIngQuestionList = (pageSize,currentPageNum) => `api/szxm/ques/getReviewIngQuestionList/${pageSize}/${currentPageNum}` //获取待我审核问题列表
export const getProcessIngQuestionList = (pageSize,currentPageNum) => `api/szxm/ques/getProcessIngQuestionList/${pageSize}/${currentPageNum}` //获取待我处理问题列表
export const getQuestion = (id) =>`api/szxm/ques/getQuestion/${id}`  //查询单个问题
export const queryQuestionRecordList = (questionId) =>`api/szxm/ques/${questionId}/queryQuestionRecordList`  //获取问题记录列表
export const addQuestion = `api/szxm/ques/addQuestion`  //新增问题
export const updateQuestion = `api/szxm/ques/updateQuestion`  //修改问题
export const deleteQuestion = `api/szxm/ques/deleteQuestion`  //删除问题
export const publishQuestion = (questionId) =>`api/szxm/ques/publishQuestion/${questionId}` //发布问题
export const handleQuestion = `api/szxm/ques/handleQuestion` //处理问题
export const forwardQuestion = `api/szxm/ques/forwardQuestion` //转发问题
export const verifyQuestion = `api/szxm/ques/verifyQuestion` //审核问题
export const hangUpQuestion = (questionId) =>`api/szxm/ques/hangUpQuestion/${questionId}` //挂起问题
export const cancelHangUpQuestion = (questionId) =>`api/szxm/ques/cancelHangUpQuestion/${questionId}` //取消挂起
export const getStationInfo = (projectId) => `/api/szxm/plan/station/search/${projectId}/list` //获取站点/区间

//领导首页api
export const getLeaderInfo = (projectId) => `api/szxm/plan/task/${projectId}/kanbanlist` //计划
export const secIssueQuantity = `api/szxm/ques/secIssueQuantity` //问题数量统计
export const secIssueList = (pageSize,currentPageNum) =>`api/szxm/ques/secIssueList/${pageSize}/${currentPageNum}` //问题数量统计交互
export const issueClassificationStatistic = `api/szxm/ques/issueClassificationStatistic` //问题分类统计
export const secIssueClassList = (pageSize,currentPageNum) =>`api/szxm/ques/secIssueClassList/${pageSize}/${currentPageNum}` //问题分类统计交互
export const getCheckStatistic = `api/szxm/aqgl/securityCheck/getCheckStatistic` //质量安全检查统计
export const querySecurityCheckList =(pageSize,currentPageNum) =>`api/szxm/aqgl/securityCheck/queryQuestionList/${pageSize}/${currentPageNum}` //质量安全检查统计交互
export const getQuaInspectStatistics = `api/szxm/zlgl/quaInsp/getQuaInspectStatistics` //质量报验统计
export const getQuaInspectStatisticsList = (pageSize,currentPageNum) =>`api/szxm/zlgl/quaInsp/getQuaInspectStatisticsList/${pageSize}/${currentPageNum}` //质量报验统计交互
export const getPgdList = `api/szxm/jdgl/dispatch/getPgdList` //日派工单统计
export const getPgdListByViewType = (pageSize,currentPageNum) =>`api/szxm/jdgl/dispatch/getPgdListByViewType/${pageSize}/${currentPageNum}` //日派工单交互统计
export const getConstruct = `api/szxm/aqgl/constructEvaluation/getConstruct` //施工考评统计
export const queryConstructEvaluationList = (pageSize,currentPageNum) =>`api/szxm/aqgl/constructEvaluation/queryConstructEvaluationList /${pageSize}/${currentPageNum}` //施工考评交互统计
export const getWorkersList = `api/szxm/rygl/peopleEntry/getWorkersList` //人员进退场统计
export const getAttendanceRecords = `api/szxm/rygl/attenter/getAttendanceRecords` //考勤统计
export const getWarningInformation = (pageSize,currentPageNum) =>`api/szxm/rygl/specialWorker/getWarningInformation/${pageSize}/${currentPageNum}` //证书预警统计