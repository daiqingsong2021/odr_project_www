//苏州项目
//--> 字典表
export const getPermission = menuCode=>`api/sys/auth/user/${menuCode}/auth/list`   //获取用户按钮权限
export const getBaseSelectTree = typeCode => `api/base/dict/${typeCode}/select/tree`; //保存更新全局设置
export const calendarList = 'api/base/calendar/list'; //基础数据-日历设置-日历设置列表
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
export const getOrgTree = 'api/szxm/rygl/addressBook/getOrgTree'; //查询通讯录树
export const getPeople = (pageSize, currentPageNum) =>
  `api/szxm/rygl/addressBook/getPeople/${pageSize}/${currentPageNum}`; //查询人员信息
//考勤配置
export const getKqConfigList = (pageSize, currentPageNum) =>
  `api/szxm/rygl/attenter/getKqConfigList/${pageSize}/${currentPageNum}`; //查询考勤配置列表
export const addKqConfig = 'api/szxm/rygl/attenter/addKqConfig'; //增加考勤配置
export const updateKqConfig = 'api/szxm/rygl/attenter/updateKqConfig'; //修改考勤配置信息
export const deleteKqConfig = 'api/szxm/rygl/attenter/deleteKqConfig'; //删除考勤配置信息
export const getKqConfig = id => `api/szxm/rygl/attenter/getKqConfig/${id}`; //查询单个考勤配置信息
export const saveAllKqConfig = 'api/szxm/rygl/attenter/saveAllKqConfig'; //增加或修改全局考勤配置
export const getAllKqConfig = 'api/szxm/rygl/attenter/getAllKqConfig'; //查询全局考勤配置信息
export const addHoliday = 'api/szxm/rygl/attenter/addHoliday'; //增加请假
export const getHolidayList = (pageSize, currentPageNum) =>
  `api/szxm/rygl/attenter/getHolidayList/${pageSize}/${currentPageNum}`; //查询请假列表
export const updateHoliday = 'api/szxm/rygl/attenter/updateHoliday'; //修改请假信息
export const deleteHoliday = 'api/szxm/rygl/attenter/deleteHoliday'; //删除请假信息
export const getHoliday = id => `api/szxm/rygl/attenter/getHoliday/${id}`; //查询单个请假对象信息
export const getHolidayDay = 'api/szxm/rygl/attenter/getHolidayDay'; //获得请假天数
export const getKqRecordReport = (pageSize, currentPageNum) =>
  `api/szxm/rygl/attenter/getKqRecordReport/${pageSize}/${currentPageNum}`; //考勤报表查询
//证书信息管理
export const getCertGlList = (pageSize, currentPageNum) =>
  `api/szxm/rygl/specialWorker/getCertGlList/${pageSize}/${currentPageNum}`; //查询证书管理
export const addCertGl = 'api/szxm/rygl/specialWorker/addCertGl'; //增加证书管理记录
export const getCertGl = id => `api/szxm/rygl/specialWorker/getCertGl/${id}`; //查询单个证书管理信息
export const updateCertGl = 'api/szxm/rygl/specialWorker/updateCertGl'; //更新证书管理
export const deleteCertGl = 'api/szxm/rygl/specialWorker/deleteCertGl'; //删除证书管理
////特殊工种-证书
export const getSpecialWorkCertList = specialWorkerId =>
  `api/szxm/rygl/specialWorker/${specialWorkerId}/getSpecialWorkCertList`; //查询特殊工种证书
export const addSpecialWorkCert = 'api/szxm/rygl/specialWorker/addSpecialWorkCert'; //增加特殊工种证书
export const getCertGlListSelect = 'api/szxm/rygl/specialWorker/getCertGlList'; //查询证书管理下拉内容
export const updateSpecialWorkCert = 'api/szxm/rygl/specialWorker/updateSpecialWorkCert'; //更新特殊工种证书
export const deleteSpecialWorkCert = 'api/szxm/rygl/specialWorker/deleteSpecialWorkCert'; //删除特殊工种证书
export const priInfoBindFile = 'api/szxm/rygl/projInfo/bindFile'; //文件业务绑定接口
export const dowWarnHouseTemp = 'api/szxm/rygl/projInfo/dowWarnHouseTemp'; //仓库模板导出（格式为XSLX文件）
export const uploadWarnHouseFile = 'api/szxm/rygl/projInfo/uploadWarnHouseFile'; //仓库导入
export const dowTsPlatTemp = 'api/szxm/rygl/projInfo/dowTsPlatTemp'; //调试平台模板导出（格式为XSLX文件）
export const uploadTsPlatFile = 'api/szxm/rygl/projInfo/uploadTsPlatFile'; //调试平台导入
//分包作业队
export const getFbzydList = (projInfoId, pageSize, currentPageNum) =>
  `api/szxm/rygl/projInfo/${projInfoId}/getFbzydList/${pageSize}/${currentPageNum}`; //查询分包作业队列表
export const addFbzyd = 'api/szxm/rygl/projInfo/addFbzyd'; //增加分包作业队信息
export const updateFbzyd = 'api/szxm/rygl/projInfo/updateFbzyd'; //修改分包作业队信息
export const deleteFbzyd = 'api/szxm/rygl/projInfo/deleteFbzyd'; //删除分包作业队信息
export const dowFbzydTemp = 'api/szxm/rygl/projInfo/dowFbzydTemp'; //分包作业队模板导出（格式为XSLX文件）
export const uploadFbzydFile = 'api/szxm/rygl/projInfo/uploadFbzydFile'; //分包作业队导入
export const getPeopleInfos = 'api/szxm/rygl/projInfo/getPeopleInfos'; //查询人员信息（不分页）
export const addOutPeoEntryDe = 'api/szxm/rygl/peopleEntry/addOutPeoEntryDe'; //增加退场人员
//文件
export const deleteDocFile = 'api/doc/file/delete'; //删除文件
// 日拍工单流程
export const queryFlowDailySheetList = `/api/szxm/jdgl/dispatch/queryFlowDailySheetList`;
// 0910
export const queryFlowStopReworkList =(applyType)=> `/api/szxm/jdgl/stopRework/${applyType}/queryFlowStopReworkList`;
//流程
export const getFlowPeopleEntryList = 'api/szxm/rygl/peopleEntry/getFlowPeopleEntryList'; //查询人员进退场(流程用)
export const getFlowPeopleChangeList = 'api/szxm/rygl/peopleChange/getFlowPeopleChangeList'; //查询人员变更(流程用)
export const getFlowSpecialWorkerList = 'api/szxm/rygl/specialWorker/getFlowSpecialWorkerList'; //查询人员特殊工种(流程用)
export const getFlowHolidayList = 'api/szxm/rygl/attenter/getFlowHolidayList'; //查询请假列表(流程用)
export const queryFlowDeviceCheckList = 'api/szxm/sbgl/check/queryFlowDeviceCheckList'; //设备报验（流程）
export const queryFlowDeviceHoistingList = 'api/szxm/sbgl/hoisting/queryFlowDeviceHoistingList'; //设备吊装（流程）
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
export const deleteQuaInsp = () => `/api/szxm/zlgl/quaInsp/deleteQuaInsp`;
export const updateQuaInsp = () => `/api/szxm/zlgl/quaInsp/updateQuaInsp`;
// 特种设备验收
export const queryDeviceForensicsList = (pageSize,currentPageNum)=>
`/api/szxm/zlgl/deviceForensics/queryDeviceForensicsList/${pageSize}/${currentPageNum}`; //查询特种设备验收数据
export const queryFlowDeviceForensicsList =  `/api/szxm/zlgl/deviceForensics/queryFlowDeviceForensicsList` //搜索流程特种设备验收数据
export const queryDeviceForensicsById = (id)=>`/api/szxm/zlgl/deviceForensics/queryDeviceForensicsById/${id}` //查询单个特种设备验收数据
export const addDeviceForensics = ()=>`/api/szxm/zlgl/deviceForensics/addDeviceForensics` //增加特种设备验收
export const updateDeviceForensics = ()=>`/api/szxm/zlgl/deviceForensics/updateDeviceForensics` //修改特种设备验收
export const deleteDeviceForensics= ()=>`/api/szxm/zlgl/deviceForensics/deleteDeviceForensics` //删除特种设备验收
// 设备报验
export const queryDeviceCheckList = (pageSize, currentPageNum) =>
  `/api/szxm/sbgl/check/queryDeviceCheckList/${pageSize}/${currentPageNum}`; // 搜索设备报验数据列表
export const queryDeviceCheckInfo = id => `/api/szxm/sbgl/check/queryDeviceCheckInfo/${id}`; // 查询单个设备报验基础信息
export const addDeviceCheck = () => `/api/szxm/sbgl/check/addDeviceCheck`; // 增加设备报验数据中
export const updateDeviceCheck = () => `/api/szxm/sbgl/check/updateDeviceCheck`; // 修改设备报验数据
export const delDeviceCheck = () => `/api/szxm/sbgl/check/delDeviceCheck`; // 删除设备报验数据
export const queryDeviceDetailList = (pageSize, currentPageNum, type) =>
  `/api/szxm/sbgl/${type}/queryDeviceDetailList/${pageSize}/${currentPageNum}`; // 搜索设备明细列表
export const addDeviceDetail = () => `/api/szxm/sbgl/check/addDeviceDetail`; // 增加设备明细
export const updateDeviceDetail = () => `/api/szxm/sbgl/check/updateDeviceDetail`; // 修改设备明细
export const delDeviceDetail = type => `/api/szxm/sbgl/${type}/delDeviceDetail`; // 删除设备明细
export const dowDeviceDetailTemp = () => `/api/szxm/sbgl/check/dowDeviceDetailTemp`;
export const uploadDeviceDetailFile = (deviceCheckId, projectId, sectionId) =>
  `/api/szxm/sbgl/check/uploadDeviceDetailFile?deviceCheckId=${deviceCheckId}&projectId${projectId}&sectionId${sectionId}`;
// 台账管理
export const queryDeviceRecordList = (pageSize, currentPageNum) =>
  `/api/szxm/sbgl/record/queryDeviceRecordList/${pageSize}/${currentPageNum}`; // 搜索设备台账数据接口列表
export const delDeviceRecord = () => `/api/szxm/sbgl/record/delDeviceRecord`; // 删除设备台账
export const querySpecialStaffList = recordId =>
  `/api/szxm/sbgl/record/querySpecialStaffList/${recordId}`; // 查询特殊人员信息
export const queryDeviceRecordInfo = id => `/api/szxm/sbgl/record/queryDeviceRecordInfo/${id}`; // 查询单个设备台账基础信息
export const addDeviceSpecialStaff = () => `/api/szxm/sbgl/record/addDeviceSpecialStaff`; // 增加特殊人员信息
export const updateDeviceSpecialStaff = () => `/api/szxm/sbgl/record/updateDeviceSpecialStaff`; // 修改特殊人员数据
export const delDeviceSpecialStaff = () => `/api/szxm/sbgl/record/delDeviceSpecialStaff`; // 删除特殊人员信息
// 吊装管理
export const queryDeviceHoistingList = (pageSize, currentPageNum) =>
  `/api/szxm/sbgl/hoisting/queryDeviceHoistingList/${pageSize}/${currentPageNum}`; // 查询设备吊装数据
export const queryDeviceHoistingInfo = id =>
  `/api/szxm/sbgl/hoisting/queryDeviceHoistingInfo/${id}`; // 查询单个设备吊装基础信息
export const addDeviceHoisting = () => `/api/szxm/sbgl/hoisting/addDeviceHoisting`; // 增加设备吊装数据
export const updateDeviceHoisting = () => `/api/szxm/sbgl/hoisting/updateDeviceHoisting`; // 修改设备吊装数据
export const delDeviceHoisting = () => `/api/szxm/sbgl/hoisting/delDeviceHoisting`; // 删除设备吊装数据

export const addQuaInsp = () => `/api/szxm/zlgl/quaInsp/addQuaInsp`;
// 质量体系api
export const queryQuaSystem = () => `/api/szxm/zlgl/quaSystem/selectQuaSystemList`; //查询质量体系
export const queryQuaSystemAdd = () => `/api/szxm/zlgl/quaSystem/addQuaSystem`; //增加质量单元
export const queryQuaSystemPut = () => `/api/szxm/zlgl/quaSystem/updateQuaSystem`; //修改质量单元
export const queryQuaSystemDelete = () => `/api/szxm/zlgl/quaSystem/deleteQuaSystem`; //删除质量单元
export const downQuaSystem = () => `/api/szxm/zlgl/quaSystem/downQuaSystem`; //导出模板
export const uploadQuaSystemFile = () => `/api/szxm/zlgl/quaSystem/uploadQuaSystemFile`; //导入

// 进度管理--派工单模块
export const queryDailySheetList = (pageSize, currentPageNum) =>
  `/api/szxm/jdgl/dispatch/queryDailySheetList/${pageSize}/${currentPageNum}`;
export const queryDailySheet = id => `/api/szxm/jdgl/dispatch/queryDailySheet/${id}`;
export const addDailySheet = () => `/api/szxm/jdgl/dispatch/addDailySheet`;
export const updateDailySheet = () => `/api/szxm/jdgl/dispatch/updateDailySheet`;
export const delDailySheet = () => `/api/szxm/jdgl/dispatch/delDailySheet`;
export const queryDetailSheetList = (dailySheetId, pageSize, currentPageNum) =>
  `/api/szxm/jdgl/dispatch/queryDetailSheetList/${dailySheetId}/${pageSize}/${currentPageNum}`;
export const queryDetailSheet = id => `/api/szxm/jdgl/dispatch/queryDetailSheet/${id}`;
export const addDetailSheet = () => `/api/szxm/jdgl/dispatch/addDetailSheet`;
export const updateDetailSheet = () => `/api/szxm/jdgl/dispatch/updateDetailSheet`;
export const delDetailSheet = `/api/szxm/jdgl/dispatch/delDetailSheet`;

// 进度管理--停复工管理模块
export const queryStopReworkList = (applyType, pageSize, currentPageNum) =>
  `/api/szxm/jdgl/stopRework/queryStopReworkList/${applyType}/${pageSize}/${currentPageNum}`; // 搜索停复工令和申请数据列表
export const queryStopRework = id => `/api/szxm/jdgl/stopRework/queryStopRework/${id}`; // 查询单个停复工令和申请基础信息
export const addStopRework = () => `/api/szxm/jdgl/stopRework/addStopRework`; // 添加停复工令或者申请
export const updateStopRework = () => `/api/szxm/jdgl/stopRework/updateStopRework`; // 修改停复工令或者申请
export const delStopRework = () => `/api/szxm/jdgl/stopRework/delStopRework`; // 删除停复工令或者申请
// 隐蔽工程
export const queryQuaConce = (pageSize, currentPageNum) =>
  `/api/szxm/zlgl/quaConce/queryQuaConce/${pageSize}/${currentPageNum}`; // 搜索
export const addQuaConce = () => `/api/szxm/zlgl/quaConce/addQuaConce`; // 增加
export const updateQuaConce = () => `/api/szxm/zlgl/quaConce/updateQuaConce`; //修改
export const deleteQuaConce = () => `/api/szxm/zlgl/quaConce/deleteQuaConce`; // 删除
export const station = projectId => `api/szxm/plan/station/search/${projectId}/list`; // 站点
export const queryFlowQuaInsp = `/api/szxm/zlgl/quaConce/queryFlowQuaConce`; // 流程
//安全管理-施工考评
export const getInfo = id => `/api/sys/section/info/${id}`; // 施工单位
export const queryConstructEvaluationList = (pageSize, currentPageNum) =>
  `/api/szxm/aqgl/constructEvaluation/queryConstructEvaluationList/${pageSize}/${currentPageNum}`;
export const queryConstructEvaluation = id =>
  `/api/szxm/aqgl/constructEvaluation/queryConstructEvaluation/${id}`; //查询施工考评数据
export const addConstructEvaluation = () =>
  `/api/szxm/aqgl/constructEvaluation/addConstructEvaluation`; //增加施工考评数据
export const updateConstructEvaluation = `/api/szxm/aqgl/constructEvaluation/updateConstructEvaluation`; //修改施工考评数据
export const delConstructEvaluation = `/api/szxm/aqgl/constructEvaluation/delConstructEvaluation`; //删除施工考评数据
export const queryEvaluateCheckList = (testId, checkType, pageSize, currentPageNum) =>
  `/api/szxm/aqgl/constructEvaluation/queryEvaluateCheckList/${testId}/${checkType}/${pageSize}/${currentPageNum}`; //查询考评检查关联表信息
export const updateEvaluateCheck = () => `/api/szxm/aqgl/constructEvaluation/updateEvaluateCheck`; //修改考评检查关联表信息
export const exportGetConstructEvaluation = `/api/szxm/aqgl/constructEvaluation/getConstructEvaluation/export`;
export const queryFlowConstructEvaluationList = `api/szxm/aqgl/constructEvaluation/queryFlowConstructEvaluationList`; //施工考评流程
// 分包审批 CURD
export const querySubcontrApprovalList = (page, size) =>
  `api/szxm/aqgl/subcontrApproval/querySubcontrApprovalList/${size}/${page}`;
export const addSubcontrApproval = () => `api/szxm/aqgl/subcontrApproval/addSubcontrApproval`;
export const updateSubcontrApproval = () => `api/szxm/aqgl/subcontrApproval/updateSubcontrApproval`;
export const delSubcontrApproval = () => `api/szxm/aqgl/subcontrApproval/delSubcontrApproval`;
export const queryFlowSubcontrApprovalList = `/api/szxm/aqgl/subcontrApproval/queryFlowSubcontrApprovalList`;
// 外部培训 CURD
export const queryTrainDisclosureList = (pageSize, currentPageNum) =>
  `/api/szxm/aqgl/trainDisclosure/queryTrainDisclosureList/${pageSize}/${currentPageNum}`;
export const getqueryTrainDisclosureInfo = (id)=>  `/api/szxm/aqgl/trainDisclosure/queryTrainDisclosure/${id}` //查询单个
export const addTrainDisclosure = () => `/api/szxm/aqgl/trainDisclosure/addTrainDisclosure`;
export const updateTrainDisclosure = () => `/api/szxm/aqgl/trainDisclosure/updateTrainDisclosure`;
export const delTrainDisclosure = () => `/api/szxm/aqgl/trainDisclosure/delTrainDisclosure`;
// 内部培训
export const departmentTree = `/api/sys/org/select/tree`; // 获取部门列表
export const queryOrgPeopleList = `/api/szxm/aqgl/trainDisclosure/queryOrgPeopleList`; //获取内部人员信息
export const queryGrDep = `/api/szxm/aqgl/trainDisclosure/queryAllDep`;
export const addTrainStaffReportList = `/api/szxm/aqgl/trainDisclosure/addTrainStaffReportList`;
// 学时
export const queryTrainTimeStatisticsList = (pageSize, currentPageNum) =>
  `/api/szxm/aqgl/trainDisclosure/queryTrainTimeStatisticsList/${pageSize}/${currentPageNum}`;
export const getLearnHoursStatistics = `/api/szxm/aqgl/trainDisclosure/getLearnHoursStatistics/export`;
export const queryPeopleStatisticsList = (pageSize, currentPageNum) =>
  `/api/szxm/aqgl/trainDisclosure/queryPeopleStatisticsList/${pageSize}/${currentPageNum}`;
// 学习人员 CURD
export const queryRyglPeopleList = id => `/api/szxm/aqgl/trainDisclosure/queryRyglPeopleList/${id}`;
export const queryRyglPeopleList2 = (trainUnitId,trainId) => `api/szxm/aqgl/trainDisclosure/queryRyglPeopleList/${trainUnitId}/${trainId}`
export const queryTrainStaffList = (trainId, intExtStaff, pageSize, currentPageNum) =>
  `/api/szxm/aqgl/trainDisclosure/queryTrainStaffList/${trainId}/${intExtStaff}/${pageSize}/${currentPageNum}`;
// `/api/szxm/aqgl/trainDisclosure/queryTrainStaffList/${trainId}/${pageSize}/${currentPageNum}`;
export const addTrainStaff = () => `/api/szxm/aqgl/trainDisclosure/addTrainStaffList`;
export const updateTrainStaff = () => `/api/szxm/aqgl/trainDisclosure/updateTrainStaff`;
export const delTrainStaff = () => `/api/szxm/aqgl/trainDisclosure/delTrainStaff`;
// 安全检查
export const querySecurityCheckList = (currentPageNum, pageSize) =>
  `/api/szxm/aqgl/securityCheck/querySecurityCheckList/${pageSize}/${currentPageNum}`; // 查询安全检查数据列表
export const querySecurityCheck = id => `/api/szxm/aqgl/securityCheck/querySecurityCheck/${id}`; // 查询安全检查信息
export const addSecurityCheck = () => `/api/szxm/aqgl/securityCheck/addSecurityCheck`; // 增加安全检查信息
export const updateSecurityCheck = () => `/api/szxm/aqgl/securityCheck/updateSecurityCheck`; // 修改安全检查信息
export const delSecurityCheck = () => `/api/szxm/aqgl/securityCheck/delSecurityCheck`; // 删除安全检查信息
export const queryCheckTeamList = (testId, checkType, pageSize, currentPageNum) =>
  `/api/szxm/aqgl/constructEvaluation/queryEvaluateCheckList/${testId}/${checkType}/${pageSize}/${currentPageNum}`; // 根据检查主键Id查询检查小组数据信息
export const delCheckTeam = () => `/api/szxm/aqgl/constructEvaluation/updateEvaluateCheck`; // 修改考评检查关联表信息及主表数据的相关逻辑更新
export const queryZgzrrInfo = `/api/szxm/aqgl/securityCheck/queryZgzrrInfo`; // 获取责任人
export const queryFlowSecurityCheckList = `api/szxm/aqgl/securityCheck/queryFlowSecurityCheckList`; //内部安全检查流程
// 检查小组
export const addCheckTeam = `/api/szxm/aqgl/securityCheck/addCheckTeam`;
export const queryTeamList = (checkId, pageSize, currentPageNum) =>
  `/api/szxm/aqgl/securityCheck/queryCheckTeamList/${checkId}/${pageSize}/${currentPageNum}`;
export const deleteTeam = `/api/szxm/aqgl/securityCheck/delCheckTeam`;
// 外部检查 CURD
export const addOutUnitSecurityCheck = `/api/szxm/aqgl/securityCheck/addOutUnitSecurityCheck`;
export const queryOutUnitSecurityCheckList = (currentPageNum, pageSize) =>
  `/api/szxm/aqgl/securityCheck/queryOutUnitSecurityCheckList/${pageSize}/${currentPageNum}`;
export const updateOutUnitSecurityCheck = `/api/szxm/aqgl/securityCheck/updateOutUnitSecurityCheck`;
export const delOutUnitSecurityCheck = `/api/szxm/aqgl/securityCheck/delOutUnitSecurityCheck`;
//文档
// export const docProjectSzxm = (folderId, bizType, flag, pageSize, pageNum, sectionIds) => `api/szxm/doc/project/${folderId}/${bizType}/${flag}/${pageSize}/${pageNum}/${sectionIds}/list`;  //文档
export const docProjectSzxm = (projectId, folderId, bizType, flag, pageSize, pageNum, sectionIds) =>
  `api/szxm/doc/project/${projectId}/${folderId}/${bizType}/${flag}/${pageSize}/${pageNum}/${sectionIds}/list`; //文档
export const docProjectReleaseList = (projectId, folderId, sectionIds) =>
  `api/szxm/doc/project/${projectId}/${folderId}/${sectionIds}/release/list`; //发布列表
export const docGivingList = (folderId, bizType, flag, projectId, sectionIds) =>
  `api/szxm/doc/project/${folderId}/${bizType}/${flag}/${projectId}/${sectionIds}/giving/list`; //分发列表
export const docAddSzxm = `api/szxm/doc/project/add`; //文件上传
export const docFolderSzxm = (projectId, menuId) =>
  `api/szxm/doc/project/folder/${projectId}/${menuId}/select/tree`; //文件页签文件夹
// 物料
//合同导入
export const getContractBySegCode = 'api/szxm/wlgl/classification/getContractBySegCode'; ////szxm/wlgl/classification/getContractBySegCode
export const getContractListByCode = 'api/szxm/wlgl/classification/getContractListByCode'; //根据合同code获取物料列表
export const importWlflFromContract = 'api/szxm/wlgl/classification/importWlflFromContract'; //批量导入合同物料清单
export const classificationList = (pageSize, currentPageNum) =>
  `api/szxm/wlgl/classification/list/${pageSize}/${currentPageNum}`;

export const addClassification = 'api/szxm/wlgl/classification/add'; //物料分类-增加
export const delClassification = 'api/szxm/wlgl/classification/delete'; //物料分类-删除
export const updateClassification = 'api/szxm/wlgl/classification/update'; //物料分类-修改
export const getInfoClassification = id => `api/szxm/wlgl/classification/${id}`; //物料分类-查询单个
export const dowClassification = 'api/szxm/wlgl/classification/downwlflTemp'; //物料分类-导出模版
export const inspectionList = (pageSize, currentPageNum) =>
  `api/szxm/wlgl/inspection/list/${pageSize}/${currentPageNum}`; //物料检测-查询
export const addInspection = 'api/szxm/wlgl/inspection/add'; //物料检测-增加
export const delInspection = 'api/szxm/wlgl/inspection/delete'; //物料检测-删除
export const getInfoInspection = id => `api/szxm/wlgl/inspection/${id}`; //查询单个检测信息
export const getMaterialList = (pageSize, currentPageNum, inspectionId) =>
  `api/szxm/wlgl/inspection/${inspectionId}/getMaterialList/${pageSize}/${currentPageNum}`; //检测清单
export const addInspectionRel = 'api/szxm/wlgl/inspectionRel/add'; //增加-检测明细
export const delInspectionRel = 'api/szxm/wlgl/inspectionRel/delete'; //删除检测明细
export const inspectionProgressList = inspectionId =>
  `api/szxm/wlgl/inspectionProgress/${inspectionId}/list`; //查询检测进展信息
export const addInspectionProgress = 'api/szxm/wlgl/inspectionProgress/add'; //增加检测进展信息
export const delInspectionProgress = 'api/szxm/wlgl/inspectionProgress/delete'; //删除检测进展信息
export const updateInspectionProgress = 'api/szxm/wlgl/inspectionProgress/update'; //修改检测进展信息
export const storageList = (pageSize, currentPageNum) =>
  `api/szxm/wlgl/storage/list/${pageSize}/${currentPageNum}`; //查询入库信息
export const addStorage = 'api/szxm/wlgl/storage/add'; //入库-增加
export const delStorage = 'api/szxm/wlgl/storage/delete'; //入库-删除
export const updateStorage = 'api/szxm/wlgl/storage/update'; //入库信息 -修改
export const storageRelList = (pageSize, currentPageNum, storageCode) =>
  `api/szxm/wlgl/storage/${storageCode}/getStorageList/${pageSize}/${currentPageNum}`; //入库明细--列表
export const updateStorageRel = 'api/szxm/wlgl/storageRel/update'; //入库明细数量-修改
export const addStorageRel = 'api/szxm/wlgl/storageRel/add'; //入库明细--增加
export const updateInInventory = 'api/szxm/wlgl/inventory/update4Storage'; //入库时更新台账
export const updateTimeTask = 'api/szxm/timeTask/updateTimeTask'; //定时器-修改a
export const getOrgName = 'api/sys/org/info'; //获取组织信息
export const getRole = (orgId, userId) => `api/sys/role/${orgId}/${userId}/info`; //获取用户
export const classificationListNoPage = 'api/szxm/wlgl/classification/list'; //查询物料分类信息--无分页

export const inspectionListNoPage = 'api/szxm/wlgl/inspection/list'; //查询检测信息--无分页
export const inventoryList = (pageSize, currentPageNum) =>
  `api/szxm/wlgl/inventory/list/${pageSize}/${currentPageNum}`; //查询库存信息
export const outstoreList = (pageSize, currentPageNum) =>
  `api/szxm/wlgl/outstore/list/${pageSize}/${currentPageNum}`; //出库--列表
export const addOutstore = 'api/szxm/wlgl/outstore/add'; //出库-增加
export const delOutstore = 'api/szxm/wlgl/outstore/delete'; //出库-删除
export const updateOutstore = 'api/szxm/wlgl/outstore/update'; //出库-更新
export const updateHolidayStatus = 'api/szxm/rygl/attenter/updateHolidayStatus'; //修改请假状态信息 为审批通过
export const updateInspection = 'api/szxm/wlgl/inspection/update'; //检测-更新
export const getOutstoreList = (pageSize, currentPageNum, outstoreCode) =>
  `api/szxm/wlgl/outstore/${outstoreCode}/getOutstoreList/${pageSize}/${currentPageNum}`; //出库明细查询
export const addOutstoreRel = 'api/szxm/wlgl/OutstoreRel/add'; //出库明细-增加
export const delOutstoreRel = 'api/szxm/wlgl/OutstoreRel/delete'; //出库明细-删除
export const classificationFlow = 'api/szxm/wlgl/classification/getFlowClassificationList'; //物料分类--流程
export const updateInOutventory = 'api/szxm/wlgl/inventory/update4Outstore';
export const getSectionKqRecord = (pageSize, currentPageNum) =>
  `api/szxm/rygl/attenter/getSectionKqRecord/${pageSize}/${currentPageNum}`; //考勤明细查询
export const getWarnHouseListNoPage = 'api/szxm/rygl/projInfo/getWarnHouseListByProjId'; //仓库-无分页
export const classificationImprotFile = 'api/szxm/wlgl/classification/uploadwlflFile'; //物料分类导入
export const addSpecialWorkCertFile = 'api/szxm/rygl/specialWorker/uploadSpecialWorkCert'; //增加特殊工种证书
export const getCulist = 'api/szxm/wlgl/outstore/getCulist'; //施工单位
export const inventoryListNoPage = 'api/szxm/wlgl/inventory/list/'; //台账-不分页
export const getMaterialRecordReport = 'api/szxm/wlgl/inventory/getMaterialRecordReport/export';
export const updateOutstoreRel = 'api/szxm/wlgl/OutstoreRel/update'; //出库明细 --修改
// /质量文件
export const getFolderByMenuName = (projectId, menuName) =>
  `api/szxm/doc/project/folder/${projectId}/${menuName}/getFolderByMenuName`; //质量安全-上传文件
export const getFolderByMenuCode = (projectId,menuCode) => `api/szxm/doc/project/folder/${projectId}/${menuCode}/getFolderByMenuCode`
export const getFolderByMenuId =(menuId)=> `api/szxm/doc/corp/folder/${menuId}/tree` //质量知识库
  
//安全-隐患管理
export const queryTroubleList = (pageSize, currentPageNum) =>
  `api/szxm/aqgl/trouble/queryTroubleList/${pageSize}/${currentPageNum}`; //查询隐患管理
export const addTrouble = 'api/szxm/aqgl/trouble/addTrouble'; //增加隐患管理
export const deleteTrouble = 'api/szxm/aqgl/trouble/deleteTrouble'; //删除隐患管理
export const queryTroubleInfo = id => `api/szxm/aqgl/trouble/queryTrouble/${id}`; //查询单个隐患管理
export const updateTrouble = 'api/szxm/aqgl/trouble/updateTrouble'; //修改隐患管理

//安全-关键节点
export const keyPointAcceptList = (pageSize, currentPageNum) =>
  `api/szxm/aqgl/keyPointAccept/list/${pageSize}/${currentPageNum}`; //关键节点-列表
export const addKeyPointAccept = 'api/szxm/aqgl/keyPointAccept/add'; //关键节点-增加
export const keyPointAcceptInfo = id => `api/szxm/aqgl/keyPointAccept/${id}`; //关键节点-单个
export const updatekeyPointAccept = 'api/szxm/aqgl/keyPointAccept/update'; //关键节点-修改
export const delkeyPointAccept = 'api/szxm/aqgl/keyPointAccept/delete'; //关键节点-删除
export const keyPointAcceptListNoPage = 'api/szxm/aqgl/keyPointAccept/list'; //关键节点-列表无分页
export const getFlowKeyPointAcceptList = 'api/szxm/aqgl/keyPointAccept/getFlowKeyPointAcceptList'; //关键节点-流程用
export const riskRegistList = (pageSize, currentPageNum) =>
  `api/szxm/aqgl/riskRegist/list/${pageSize}/${currentPageNum}`; //风险登记-列表
export const addRiskRegist = 'api/szxm/aqgl/riskRegist/add'; //风险登记-增加
export const delRiskRegist = 'api/szxm/aqgl/riskRegist/delete'; //风险登记-删除
export const riskRegistInfo = id => `api/szxm/aqgl/riskRegist/${id}`; //风险登记-查询单个
export const updateRiskRegist = 'api/szxm/aqgl/riskRegist/update'; //风险登记-修改
export const riskIndentifyList = (pageSize, currentPageNum) =>
  `api/szxm/aqgl/riskIndentify/list/${pageSize}/${currentPageNum}`; //风险识别--查询
export const addRiskIndentify = 'api/szxm/aqgl/riskIndentify/add'; //风险识别-增加
export const delRiskIndentify = 'api/szxm/aqgl/riskIndentify/delete'; //风险识别-删除
export const riskIndentifyInfo = id => `api/szxm/aqgl/riskIndentify/${id}`; //风险识别-单个查询
export const updateRiskIndentify = 'api/szxm/aqgl/riskIndentify/update'; //修改风险识别
export const riskRegistListNoPage = 'api/szxm/aqgl/riskRegist/list'; //风险登记-列表无分页
export const getFlowRiskRegistList = 'api/szxm/aqgl/riskRegist/getFlowRiskRegistList'; //风险登记-流程
// 安全考核
export const querySecurityExaminationModuleList = `/api/szxm/aqgl/securityExamination/querySecurityExaminationModuleList`; // 获取考核模版
export const addSecurityExaminationModule = `/api/szxm/aqgl/securityExamination/addSecurityExaminationModule`; // 新增
export const delSecurityExaminationModule = `/api/szxm/aqgl/securityExamination/delSecurityExaminationModule`; // 删除
export const querySecurityExaminationModule = id =>
  `/api/szxm/aqgl/securityExamination/querySecurityExaminationModule/${id}`; //查询单个
export const updateSecurityExaminationModule = `/api/szxm/aqgl/securityExamination/updateSecurityExaminationModule`; // 修改
export const getFlowSecurityExaminationList = `api/szxm/aqgl/securityExamination/getFlowSecurityExaminationList`; //安全考核流程
// 考核模版详情
export const querySecurityExaminationModuleDetailList = moduleId =>
  `/api/szxm/aqgl/securityExamination/querySecurityExaminationModuleDetailList/${moduleId}`; // GET
export const addSecurityExaminationModuleDetail = `/api/szxm/aqgl/securityExamination/addSecurityExaminationModuleDetail`; //POST
export const delSecurityExaminationModuleDetail = `/api/szxm/aqgl/securityExamination/delSecurityExaminationModuleDetail`; // delete
export const updateSecurityExaminationModuleDetail = `/api/szxm/aqgl/securityExamination/updateSecurityExaminationModuleDetail`; // update
export const dowSecurityExaminationModuleDetail = `/api/szxm/aqgl/securityExamination/dowSecurityExaminationModuleDetail`; // 导出
// 考核人员
export const querySecurityExaminationModuleStaffList = moduleId =>
  `/api/szxm/aqgl/securityExamination/querySecurityExaminationModuleStaffList/${moduleId}`; // 查询
export const addSecurityExaminationModuleStaff = `/api/szxm/aqgl/securityExamination/addSecurityExaminationModuleStaff`; //  post
export const delSecurityExaminationModuleStaff = `/api/szxm/aqgl/securityExamination/delSecurityExaminationModuleStaff`; //delete
// 安全考核
export const querySecurityExaminationList = (pageSize, currentPageNum) =>
  `/api/szxm/aqgl/securityExamination/querySecurityExaminationList/${pageSize}/${currentPageNum}`;
export const queryAssessmenter = `/api/szxm/aqgl/securityExamination/queryAssessmenter`; // 查询考核人员
export const addSecurityExaminationBatch = `/api/szxm/aqgl/securityExamination/addSecurityExaminationBatch`; //post
export const delSecurityExamination = `/api/szxm/aqgl/securityExamination/delSecurityExamination`; // delete
// 考核表
export const querySecurityExaminationDetailList = aqkhId =>
  `/api/szxm/aqgl/securityExamination/querySecurityExaminationDetailList/${aqkhId}`; // 查询
export const updateSecurityExaminationDetail = `/api/szxm/aqgl/securityExamination/updateSecurityExaminationDetail`; // 修改
export const updateConfirm = `/api/szxm/aqgl/securityExamination/updateConfirm`; //确定
//专项方案
export const queryDangerPlan = (pageSize, currentPageNum) =>
  `api/szxm/aqgl/dangerPlan/queryDangerPlan/${pageSize}/${currentPageNum}`; //查询专项方案
export const queryFlowDangerPlan = 'api/szxm/aqgl/dangerPlan/queryFlowDangerPlan'; //查询专项方案 流程用
export const addDangerPlan = 'api/szxm/aqgl/dangerPlan/addDangerPlan'; //增加专项方案
export const getDangerPlanInfo = id => `api/szxm/aqgl/dangerPlan/getDangerPlan/${id}`; //查询单个专项方案
export const updateDangerPlan = 'api/szxm/aqgl/dangerPlan/updateDangerPlan'; // 修改专项方案
export const deleteDangerPlan = 'api/szxm/aqgl/dangerPlan/deleteDangerPlan'; //删除专项方案
export const queryDangerProject = (pageSize, currentPageNum) =>
  `api/szxm/aqgl/dangerProject/queryDangerProject/${pageSize}/${currentPageNum}`; //查询危大工程验收
export const queryFlowDangerProject = 'api/szxm/aqgl/dangerProject/queryFlowDangerProject'; //查询危大工程验收 流程用
export const getDangerProjectInfo = id => `api/szxm/aqgl/dangerProject/getDangerProject/${id}`; //查询单个危大工程验收
export const addDangerProject = 'api/szxm/aqgl/dangerProject/addDangerProject'; //增加危大工程验收
export const updateDangerProject = 'api/szxm/aqgl/dangerProject/updateDangerProject'; //修改危大工程验收
export const deleteDangerProject = 'api/szxm/aqgl/dangerProject/deleteDangerProject'; //删除危大工程验收
// 押金退换
export const addMortgageRefund = `/api/szxm/aqgl/mortgageRefund/addMortgageRefund`; // post
export const queryMortgageRefundList = (pageSize, currentPageNum) =>
  `/api/szxm/aqgl/mortgageRefund/queryMortgageRefundList/${pageSize}/${currentPageNum}`;
export const delMortgageRefund = `/api/szxm/aqgl/mortgageRefund/delMortgageRefund`; // delete
export const updateMortgageRefund = `/api/szxm/aqgl/mortgageRefund/updateMortgageRefund`;
export const getFlowMortgageRefundList = `api/szxm/aqgl/mortgageRefund/getFlowMortgageRefundList`; //查询风险抵押金流程
// 页签
export const queryMonthMortgageList = (dyjSqId, pageSize, currentPageNum) =>
  `/api/szxm/aqgl/mortgageRefund/queryMonthMortgageList/${dyjSqId}/${pageSize}/${currentPageNum}`; //get
export const updateMonthMortgage = `/api/szxm/aqgl/mortgageRefund/updateMonthMortgage`; //put
export const queryQuarterMortgageList = (dyjSqId, pageSize, currentPageNum) =>
  `/api/szxm/aqgl/mortgageRefund/queryQuarterMortgageList/${dyjSqId}/${pageSize}/${currentPageNum}`;
export const updateQuarterMortgage = `/api/szxm/aqgl/mortgageRefund/updateQuarterMortgage`;
export const updateZbsj = `/api/szxm/aqgl/mortgageRefund/updateZbsj`;
//文件上报-月报
export const queryMonthReport = (pageSize, currentPageNum) =>
  `api/szxm/aqgl/monthReport/queryMonthReport/${pageSize}/${currentPageNum}`; //查询安全月报
export const getFlowMonthReportList = 'api/szxm/aqgl/monthReport/getFlowMonthReportList'; //查询安全月报 流程用
export const queryMonthReportInfo = id => `api/szxm/aqgl/monthReport/queryMonthReport/${id}`; //查询单个安全月报
export const addMonthReport = 'api/szxm/aqgl/monthReport/addMonthReport'; //增加安全月报
export const deleteMonthReport = 'api/szxm/aqgl/monthReport/deleteMonthReport'; //删除安全月报
//安全日报
export const queryRcReport = (pageSize, currentPageNum) =>
  `api/szxm/aqgl/rcRcport/queryRcReport/${pageSize}/${currentPageNum}`; //查询日常报表
export const selectChoseOrg = 'api/szxm/aqgl/rcRcport/selectChoseOrg'; //责任单位下拉选择
export const selectChoseRole = 'api/szxm/aqgl/rcRcport/selectChoseRole'; //责任角色下拉选择
export const addRcReport = 'api/szxm/aqgl/rcRcport/addRcReport'; //增加日常报表
export const deleteRcReport = 'api/szxm/aqgl/rcRcport/deleteRcReport'; //删除日常报表
export const queryRcReportInfo = id => `api/szxm/aqgl/rcRcport/queryRcReport/${id}`; //查询单个
export const updateRcReport = 'api/szxm/aqgl/rcRcport/updateRcReport'; //更新日常报表
export const publishRcReport = 'api/szxm/aqgl/rcRcport/publishRcReport'; //发布日常报表
export const closeRcReport = 'api/szxm/aqgl/rcRcport/closeRcReport'; //关闭日常报表
export const cbRcReport = 'api/szxm/aqgl/rcRcport/cbRcReport'; //催报日常报表
export const getRcDetailReport = (pageSize, currentPageNum, rcReportId) =>
  `api/szxm/aqgl/rcRcport/${rcReportId}/getRcDetailReport/${pageSize}/${currentPageNum}`; //查询日常报表上报详情
export const bindRcDetailFile = 'api/szxm/aqgl/rcRcport/bindRcDetailFile'; //上报详情 文件 业务绑定
export const getCountRcDetailReport = (pageSize, currentPageNum) =>
  `api/szxm/aqgl/rcRcport/getCountRcDetailReport/${pageSize}/${currentPageNum}`; //上报统计报表
export const exportDetailReport = 'api/szxm/aqgl/rcRcport/getCountRcDetailReport/export'; //上报统计报表导出（格式为XSLX文件）

export const queryFlowTrainDisclosureList = ()=>`api/szxm/aqgl/trainDisclosure/queryFlowTrainDisclosureList` //安全外部培训发起审批
//安全外部培训
export const queryOutTrainTimeStatisticsList = (pageSize,currentPageNum)=>`api/szxm/aqgl/trainDisclosure/queryOutTrainTimeStatisticsList/${pageSize}/${currentPageNum}` //外部培训查询
export const queryPeopleOutTrainTimeStatisticsList = (pageSize,currentPageNum)=> `api/szxm/aqgl/trainDisclosure/queryPeopleOutTrainTimeStatisticsList/${pageSize}/${currentPageNum}` //查询单个
export const getOutLearnHoursStatistics = 'api/szxm/aqgl/trainDisclosure/getOutLearnHoursStatistics/export' //导出
export const cbMonThReport = 'api/szxm/aqgl/monthReport/cbMonThReport' //安全月报催报
//问题模块
export const queryQuestionList = (pageSize,currentPageNum)=> `api/szxm/ques/queryQuestionList/${pageSize}/${currentPageNum}`
export const addQuestion =  'api/szxm/ques/addQuestion'//新增问题
export const getQuestion = (id)=>`api/szxm/ques/getQuestion/${id}` //查询单个问题
export const updateQuestion = 'api/szxm/ques/updateQuestion' //修改问题
export const deleteQuestion = 'api/szxm/ques/deleteQuestion' //删除问题
export const publishQuestion = `api/szxm/ques/publishQuestion` //发布问题
export const handleQuestion = 'api/szxm/ques/handleQuestion' //处理问题
export const forwardQuestion = `api/szxm/ques/forwardQuestion` //转发问题
export const hangUpQuestion = (questionId)=> `api/szxm/ques/hangUpQuestion/${questionId}` //挂起问题
export const cancelHangUpQuestion = (questionId)=> `api/szxm/ques/cancelHangUpQuestion/${questionId}` //取消挂起问题
export const verifyQuestion = 'api/szxm/ques/verifyQuestion' //审核问题
//人员请加职务
export const getHolidayRyzw = (sectionId)=>`api/szxm/rygl/attenter/getHolidayRyzw/${sectionId}` 

//审批预览
export const getPeopleChangeWord = 'api/szxm/rygl/peopleChange/getPeopleChangeWord';//人员变更
export const getHolidayWord =(id)=> `api/szxm/rygl/attenter/getHolidayWord/${id} ` //请假
export const dyDangerPlanWord = 'api/szxm/aqgl/dangerPlan/dyDangerPlan' //危大工程
export const dySecurityCheckWord = 'api/szxm/aqgl/securityCheck/dySecurityCheck' //安全检查
export const dyDeviceCheck = 'api/szxm/sbgl/check/dyDeviceCheck' //设备报验
//问题责任主体
export const getOrg = 'api/sys/org/ques/select/tree' //组织机构下
export const getProOrg =(projectId)=> `api/sys/org/ques/${projectId}/select/tree`
//合同集成获取token
export const getTokenKey = 'api/sys/gcToken/getTokenKey'

export const publishDailySheet = 'api/szxm/jdgl/dispatch/publishDailySheet' //发布用的批量更新接口
export const getDailySheetKqRecord =(id)=> `api/szxm/jdgl/dispatch/getDailySheetKqRecord/${id}` //派工单考勤
export const checkLoginOpen = '/api/szxm/checkLoginOpen' //现场视频
export const queryYqQuestionList =(pageSize,currentPageNum)=> `/api/szxm/ques/queryYqQuestionList/${pageSize}/${currentPageNum}`
//开工申请
export const getWorkApplyList= (pageSize,currentPageNum)=>`api/szxm/jhgl/workApply/queryWorkApplyList/${pageSize}/${currentPageNum}` //查询开工申请数据
export const queryFlowWorkApplyList = `api/szxm/jhgl/workApply/queryFlowWorkApplyList`  //查询开工申请流程用
export const queryWorkApply = (id)=>`api/szxm/jhgl/workApply/queryWorkApply/${id}` //根据主键id查询开工申请信息
export const addWorkApply = `api/szxm/jhgl/workApply/addWorkApply`  //增加开工申请数据
export const updateWorkApply = `api/szxm/jhgl/workApply/updateWorkApply`  //修改开工申请
export const delWorkApply = `api/szxm/jhgl/workApply/delWorkApply`  //删除开工申请
export const dyWorkApply = `api/szxm/jhgl/workApply/dyWorkApply`  //根据主键id查询开工申请信息然后打印数据

// 客观项模板
export const selectMainItemObjectTemplates =  `api/szxm/system/objectTemplate/selectMainItemObjectTemplates` //客观项模板列表
export const updObjectTemplate = 'api/szxm/system/objectTemplate/updObjectTemplate' //更新客观模板列表
export const deleteObjectTemplate = 'api/szxm/system/objectTemplate/deleteObjectTemplate' //删除客观模板列表
export const selectDetailItemObjectTemplates =(checkItemId)=>`api/szxm/system/objectTemplate/selectDetailItemObjectTemplates/${checkItemId}`//明细列表
//主观项模板
export const selectSubjectTemplate = 'api/szxm/system/subjectTemplate/selectSubjectTemplate' //主观项模板列表
export const addSubjectTemplate = 'api/szxm/system/subjectTemplate/addSubjectTemplate'//主观项模板--新增
export const subjectTemplateGroup = 'api/sys/menu/subjectTemplateGroup' //菜单
export const getMenuCode =(menuCode)=> `/api/sys/menu/subjectTemplateMenu/${menuCode}` //菜单
export const updSubjectTemplate = 'api/szxm/system/subjectTemplate/updSubjectTemplate' //主观项模板--修改
export const deleteSubjectTemplate = 'api/szxm/system/subjectTemplate/deleteSubjectTemplate' //主观项模板--删除
export const isInSubjectTemplate =(moduleCode)=> `api/szxm/system/subjectTemplate/isInSubjectTemplate/${moduleCode}` //主观文件是否需考评
export const addSubjectScore ='api/szxm/system/subjectScore/addSubjectScore' //主观评分--新增
export const selectSubjectScore=(pageSize,currentPageNum)=> `api/szxm/system/subjectScore/selectSubjectScore/${pageSize}/${currentPageNum}` //查询主观(带总分)
export const reations=(bizId,bizType)=> `api/szxm/doc/reations/${bizId}/${bizType}/list` //考核记录-主观
export const updateSubjectScore = 'api/szxm/system/subjectScore/updateSubjectScore'  //考核记录--更新分数
export const deleteSubjectScoreByFileId = 'api/szxm/system/subjectScore/deleteSubjectScoreByFileId'//删除文件-删除分数

//考核记录
export const getSysScores=(pageSize,currentPageNum) => `api/szxm/system/score/getSysScores/${pageSize}/${currentPageNum}` //考核记录
  
export const getSysObjectScores = 'api/szxm/system/score/getSysObjectScores'//考核记录-客观
export const selectSubjectItemScore= `api/szxm/system/subjectScore/selectSubjectItemScore` //考核记录-主观
export const getFlowSysScores= 'api/szxm/system/score/getFlowSysScores' //流程
export const getAllSysScores= 'api/szxm/system/score/getAllSysScores' //流程

export const deleteSysObjectScore= 'api/szxm/system/score/deleteSysObjectScore' //考核记录--删除
//物料导出
export const getSecurityExamination= 'api/szxm/aqgl/securityExamination/getSecurityExamination/export'
// 疫情
export const uploadPeopleBackFile= 'api/szxm/jdgl/peopleBack/uploadPeopleBackFile' //返乡人员上报
export const uploadDailyReportFile= 'api/szxm/jdgl/dailyReport/uploadDailyReportFile' //每日上报
export const peopleBackList=(pageSize,currentPageNum)=>`api/szxm/jdgl/peopleBack/list/${pageSize}/${currentPageNum}` //人员
export const dailyReportList=(pageSize,currentPageNum)=> `api/szxm/jdgl/dailyReport/list/${pageSize}/${currentPageNum}`//每日疫情
export const peopleBackDel = 'api/szxm/jdgl/peopleBack/delete' //删除返苏人员信息
export const dailyReportDel = 'api/szxm/jdgl/dailyReport/delete' //删除每日上报
// 疫情视图
export const peopleBackStatistics = 'api/szxm/jdgl/peopleBack/statistics' //人员
export const dailyReportStatistics = 'api/szxm/jdgl/dailyReport/statistics'//每日上报
export const queryStatisticalStopRework = 'api/szxm/jdgl/stopRework/queryStatisticalStopRework' //复工统计
export const getProjInfoByOrgName = 'api/szxm/rygl/projInfo/getProjInfoByOrgName '

//客运日况
export const queryTrafficMainList = (pageSize, currentPageNum) => `api/dc1/traffic/queryTrafficMainList/${pageSize}/${currentPageNum}`  //查询主列表
export const queryFlowTrafficMainList = 'api/dc1/traffic/queryFlowTrafficMainList'  //流程查询主数据
export const getFlowTrafficMainList = 'api/dc1/traffic/getFlowTrafficMainList'  //根据id查询流程数据
export const delTrafficMain = 'api/dc1/traffic/delTrafficMain'  //删除客运日况主数据
export const uploadTrafficMainFile = 'api/dc1/traffic/uploadTrafficMainFile'  //导入客运日况
export const queryIsHaveTrafficMain = 'api/dc1/traffic/queryIsHaveTrafficMain'  //导入校验
export const queryTrafficChildrenList = 'api/dc1/traffic/queryTrafficChildrenList'  //查询客运日况详情
export const updateTrafficChildrenList = 'api/dc1/traffic/updateTrafficChildrenList'  //更新客运日况详情
export const approvedTraffic = 'api/dc1/traffic/approvedTraffic' //发布
//时刻表管理
export const getTrainScheduleListPage = (pageSize,currentPageNum)=>`api/dc2/xcrk/trainSchedule/list/${pageSize}/${currentPageNum}`  //分页查询时刻表
export const getTrainScheduleList = 'api/dc2/xcrk/trainSchedule/list'  //不分页查询时刻表
export const getTrainScheduleById = (id)=>`api/dc2/xcrk/trainSchedule/${id}`  //id查询时刻表
export const trainScheduleAdd = 'api/dc2/xcrk/trainSchedule/add'  //新增时刻表
export const trainScheduleDelete = 'api/dc2/xcrk/trainSchedule/delete'  //删除时刻表
export const checkAddScheduleCode = 'api/dc2/xcrk/trainSchedule/checkAddScheduleCode'  //校验时刻表名称
//行车日况
export const getTrainDailListPage= (pageSize,currentPageNum) =>`api/dc2/xcrk/trainDaily/list/${pageSize}/${currentPageNum}`  //分页查询
export const getTrainDailList= 'api/dc2/xcrk/trainDaily/list'  //不分页查询
export const getTrainDailyById= (id)=>`api/dc2/xcrk/trainDaily/${id}`  //不分页查询
export const checkTrainCreatTime= 'api/dc2/xcrk/trainDaily/checkCreatTime'  //校验创建日期
export const trainDailAdd= 'api/dc2/xcrk/trainDaily/add'  //新增
export const trainDailUpdate= 'api/dc2/xcrk/trainDaily/update'  //修改
export const trainDailDelete= 'api/dc2/xcrk/trainDaily/delete'  //删除
export const trainDailApprove= 'api/dc2/xcrk/trainDaily/approvedTrainDaily'//发布
//能耗日况
export const getFlowDailyPageList= (pageSize,currentPageNum) => `api/dc3/nhrk/energyDaily/flowDailyPageList/${pageSize}/${currentPageNum}`  //分页查询主列表
export const getFlowDailyList = 'api/dc3/nhrk/energyDaily/flowDailyList'  //不分页查询
export const getDailyList= 'api/dc3/nhrk/energyDaily/list' //流程用不分页查询
export const downEnergyDetailTemplate= (lineNum) => `api/dc3/nhrk/energyDaily/downEnergyDetailTemplate/${lineNum}` //导出模板
export const uploadEnergyDetailInfo= (line) => `api/dc3/nhrk/energyDaily/uploadEnergyDetailInfo/${line}` //导入
export const energyDailyDelete = 'api/dc3/nhrk/energyDaily/delete'  //删除
export const energyDailyById= (id) => `api/dc3/nhrk/energyDaily/${id}` //根据id查询主列表
export const getDailyDetailPageList = (dailyId,pageSize,currentPageNum) => `api/dc3/nhrk/energyDetail/dailyDetail/${dailyId}/${pageSize}/${currentPageNum}`  //分页查询详情
export const energyDailyUpdate = 'api/dc3/nhrk/energyDetail/update'  //修改
export const energyDetailById = (id) => `api/dc3/nhrk/energyDetail/${id}`  //根据id查询详情页
export const energyDailyApproved ='api/dc3/nhrk/energyDaily/approvedEnergyDaily'//发布
//基础数据 运营设置
export const getTrainTime = 'api/base/set/time/train/info' //查询
export const setTrainTime = 'api/base/set/time/update/train' //更新
//首页数据概览
export const homePageCollectDataVo = 'api/dc2/sy/homePageCollectDataVo/list'
//施工日况
export const addConstructionDaily = 'api/dc4/sgrk/constructionDaily/add'; //施工日况-增加
export const checkAddConstructionDaily = 'api/dc4/sgrk/constructionDaily/checkAddConstructionDaily';//施工日况-增加校验
export const updateConstructionDaily = 'api/dc4/sgrk/constructionDaily/update';
export const delConstructionDaily = 'api/dc4/sgrk/constructionDaily/delete';
export const constructionDailyList = (pageSize, currentPageNum) => `api/dc4/sgrk/constructionDaily/list/${pageSize}/${currentPageNum}`;
export const constructionDailyDetail = (id) =>`api/dc4/sgrk/constructionDaily/${id}`;
export const constructionDailyListNoPage = 'api/dc4/sgrk/constructionDaily/list';
export const approvedConstructionDaily = 'api/dc4/sgrk/constructionDaily/approvedConstructionDaily'
export const synConstructionDaily= 'api/dc4/sgrk/constructionDaily/syn/list'  //同步施工日狂列表
//日报管理
export const generateCCDailyWorkReportFile = 'api/processing/odr/report/generateCCDailyWorkReportFile';
export const generateDailyWorkReportFile = 'api/processing/odr/report/generateDailyWorkReportFile';
export const queryDailyReportList = (pageSize, currentPageNum) => `api/processing/odr/report/queryDailyReportList/${pageSize}/${currentPageNum}`;
export const deleteReport = 'api/processing/odr/report/deleteReport';
export const queryDailyReportListNoPage = 'api/processing/odr/report/queryFlowDailyReportList';
export const getFlowDailyReportList = 'api/processing/odr/report/getFlowDailyReportList' //流程待办
export const queryFineDailyReportList = (pageSize, currentPageNum) => `api/processing/fine/report/queryDailyReportList/${pageSize}/${currentPageNum}`;//帆软报表列表查询
export const deleteFineReport = 'api/processing/fine/report/deleteFineReport';//帆软报表删除
export const addFineDailyReport = 'api/processing/fine/report/addFineDailyReport';//帆软报表新增
export const getFlowFineDailyReportListNoPage = 'api/processing/fine/report/getFlowFineDailyReportList';//帆软报表列表不分页
export const getFlowFineDailyReports = 'api/processing/fine/report/getFlowFineDailyReports';//帆软报表流程待办
//故障日况
export const faultDailyPageList= (pageSize,currentPageNum) => `api/dc5/gzrk/faultDaily/list/${pageSize}/${currentPageNum}`
export const faultDailyAdd = 'api/dc5/gzrk/faultDaily/add' //新增
export const faultDailyDel = 'api/dc5/gzrk/faultDaily/delete' //删除
export const approvedFaultDaily = 'api/dc5/gzrk/faultDaily/approvedFaultDaily'
export const faultDailyUpdate = 'api/dc5/gzrk/faultDaily/update'//修改
export const faultDailyProblemAdd = 'api/dc5/gzrk/faultDailyProblem/add' //问题新增
export const faultDailyProblemDel = 'api/dc5/gzrk/faultDailyProblem/delete' //问题删除
export const faultDailyProblemUpdate = 'api/dc5/gzrk/faultDailyProblem/update' //问题修改
export const faultDailyProblemPageList= (pageSize,currentPageNum)  => `api/dc5/gzrk/faultDailyProblem/list/${pageSize}/${currentPageNum}` //问题列表
export const faultDailyProblemDealAdd = 'api/dc5/gzrk/faultDailyProblemDeal/add' //新增
export const faultDailyProblemDealDel = 'api/dc5/gzrk/faultDailyProblemDeal/delete' //删除
export const faultDailyProblemDealUpdate = 'api/dc5/gzrk/faultDailyProblemDeal/update'//修改
export const faultDailyProblemDealPageList = (pageSize,currentPageNum)  => `api/dc5/gzrk/faultDailyProblemDeal/list/${pageSize}/${currentPageNum}` //列表
export const faultDailyExport = 'api/dc5/gzrk/faultDaily/export' //导出
export const getFlowFaultDailyList = 'api/dc5/gzrk/faultDaily/getFlowFaultDailyList' //流程待办
export const getFlowFaultDailyNoPageList =  'api/dc5/gzrk/faultDaily/list'


//补充情况说明
export const dailyRepresentationList = (pageSize,currentPageNum)  => `api/dc2/bcsm/DailyRepresentation/list/${pageSize}/${currentPageNum}` //列表
export const addDailyRepresentation = `api/dc2/bcsm/DailyRepresentation/add`
export const updateDailyRepresentation = `api/dc2/bcsm/DailyRepresentation/update`
export const deleteDailyRepresentation = `api/dc2/bcsm/DailyRepresentation/delete`

//版本管理
export const addDailyChangeVersion = `api/dc2/bbgl/DailyChangeVersion/add`

//线路管理
export const getLineFoundationList = 'api/hrb-sys/odr/foundation/queryLineFoundationList' //获取线路主数据
export const addLineFoundationList = 'api/hrb-sys/odr/foundation/addLineFoundationList' //新增线路主数据
export const delLineFoundationList = 'api/hrb-sys/odr/foundation/delLineFoundationList' //删除线路主数据
export const queryStationDistanceFoundationList = 'api/hrb-sys/odr/foundation/queryStationDistanceFoundationList' //查询站点间距
export const updateStationFoundationList = 'api/hrb-sys/odr/foundation/updateStationFoundationList' //修改正线站点排序
export const updateStationDistanceFoundationList = 'api/hrb-sys/odr/foundation/updateStationDistanceFoundationList' //修改站点间距
export const checkLineFoundationIsHave = 'api/hrb-sys/odr/foundation/checkLineFoundationIsHave' //校验线路重复

//站点管理
  //>>1号线模板
export const getStationList = 'api/hrb-sys/odr/foundation/getStationList' //获取正线站点主数据
export const addStationFoundationList = 'api/hrb-sys/odr/foundation/addStationFoundationList' //新增
export const queryStationFoundationList = 'api/hrb-sys/odr/foundation/queryStationFoundationList' //查询主数据
export const delStationFoundationList = 'api/hrb-sys/odr/foundation/delStationFoundationList' //删除
export const checkStationFoundationIsHave = 'api/hrb-sys/odr/foundation/checkStationFoundationIsHave' //新增校验
  //>>3号线模板
export const getStationRouteByPage = (pageSize,currentPageNum)=> `api/hrb-sys/odr/StationRoute/list/${pageSize}/${currentPageNum}`  //分页查询
export const getStationRouteById = (id)=> `api/hrb-sys/odr/StationRoute/${id}` //根据id查询
export const addStationRoute = 'api/hrb-sys/odr/StationRoute/add' //新增
export const deleteStationRoute = 'api/hrb-sys/odr/StationRoute/delete' //删除

//时刻表
export const queryStationListByParam = 'api/hrb-sys/odr/foundation/queryStationListByParam' //查询站点
export const queryStationToStationMileage = 'api/hrb-sys/odr/foundation/queryStationToStationMileage'//查询里程
export const updateTrainSchedule = 'api/dc2/xcrk/trainSchedule/update' //修改时刻表
export const checkIsHave = 'api/dc2/xcrk/trainSchedule/checkIsHave'

//列车信息
export const queryTrainFoundationList = (pageSize,currentPageNum)  => `api/hrb-sys/odr/foundation/queryTrainFoundationList/${pageSize}/${currentPageNum}` //列表带分页查询
export const addTrainFoundation = 'api/hrb-sys/odr/foundation/addTrainFoundation'//新增
export const delTrainFoundationList = 'api/hrb-sys/odr/foundation/delTrainFoundationList'//删除
export const updateTrainFoundation = 'api/hrb-sys/odr/foundation/updateTrainFoundation'//修改
export const checkTrainFoundationIsHave = 'api/hrb-sys/odr/foundation/checkTrainFoundationIsHave'//列车编号校验
export const queryTrainList = 'api/hrb-sys/odr/foundation/queryTrainFoundationList'//不带分页查询


//短信-模板管理
export const getSmsTemplateList = (pageSize,currentPageNum) =>`api/dc2/sms/template/list/${pageSize}/${currentPageNum}` //查询短信模板列表
export const addSmsTemplate = 'api/dc2/sms/template/insert' //新增短信模板
export const delSmsTemplate = 'api/dc2/sms/template/del' //删除短信模板

//短信-群组管理
export const getSmsGroupList = (pageSize,currentPageNum) => `api/dc2/message/list/${pageSize}/${currentPageNum}` //查询群组
export const getSmsGroupDetailList = (pageSize,currentPageNum) => `api/dc2/message/getGrouppersonlistPage/${pageSize}/${currentPageNum}` //查询群组详情
export const uploadSmsGroup = (groupName) => `api/dc2/message/uploadFile/${groupName}` //导入群组
export const smsGroupUpdate = (id,groupName) => `api/dc2/message/updateGroupFile/${id}/${groupName}` //修改导入群组
export const expSmsGroupTemplate = "api/dc2/message/getGroupManage/export"  //群组成员模板下载
export const expSmsGroupDetail = (groupId) => `api/dc2/message/getGroupManagePerson/export/${groupId}`//当前群组成员下载
export const delSmsGroup = "api/dc2/message/deleteGroupManage" //删除群组
export const updateSmsGroupStatus = "api/dc2/message/update" //修改群组状态
export const getSmsGroupListNoPage = "api/dc2/message/list"//查询群组非分页
export const getSmsGroupDetailListNoPage = "api/dc2/message/getGrouppersonlist" //查询人员非分页

//短信-短信发送
export const smsSend = "api/dc2/sms/task/insert"  //短信发送

export const getSmsHistoryList = (pageSize,currentPageNum) => `api/dc2/sms/getSmsHistoryList/${pageSize}/${currentPageNum}`//短信历史查询
export const delHistoryList = 'api/dc2/sms/task/del'//删除短信历史
export const exportHistoryList = 'api/dc2/sms/getSmsHistoryInfo/export'//导出短信历史
export const getSmsHistoryDetailsList = (pageSize,currentPageNum) => `api/dc2/sms/getSmsHistoryDetailsList/${pageSize}/${currentPageNum}` //查询发送明细
export const cancelTimingSms = (status) => `api/dc2/sms/task/updateStatus/${status}`