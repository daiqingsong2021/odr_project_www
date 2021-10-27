// 系统管理之ipt管理
export const iptTree = 'api/sys/ipt/tree' //系统管理-ipt管理-获取列表树形
export const iptTreeSearch = "api/sys/ipt/search" //搜索
export const iptInfo = iptId => `api/sys/ipt/${iptId}/info` //系统管理-ipt管理-获取ipt信息
export const iptDelete = 'api/sys/ipt/delete' //系统管理-ipt管理-右键删除
export const iptAdd = 'api/sys/ipt/add' //系统管理-ipt管理-右键添加
export const iptUpdate = 'api/sys/ipt/update' //系统管理-ipt管理-右边基本信息报存
export const iptgetUser = (iptId, pageSize, currentPageNum) => `api/sys/user/select/${iptId}/iptusers/${pageSize}/${currentPageNum}` //系统管ipt管理-右边用户列表
export const selectiptUsers = (pageSize, currentPageNum) => `api/sys/user/select/iptusers/${pageSize}/${currentPageNum}` //系统管理之ipt-搜索ipt用户列表
export const userAdd = iptId => `api/sys/ipt/${iptId}/user/add` //ipt-人员管理分配保存接口
export const userAddRoles = iptId => `api/sys/ipt/${iptId}/user/roles/add`
export const deleteIptUser = iptId => `api/sys/ipt/${iptId}/user/delete`  //删除IPT用户
// 项目立项
export const prepaList = (pageSize, currentPageNum) => `api/plan/prepa/list/${pageSize}/${currentPageNum}` //策划管理-项目立项-列表
export const prepaSeek = (pageSize, currentPageNum, paCodeOrName) => `api/plan/prepa/list/${pageSize}/${currentPageNum}/${paCodeOrName}`//策划管理-项目立项-搜索
export const prepaBas = (id) => `api/plan/prepa/${id}` //策划管理-项目立项-基础信息
export const planPrepa = 'api/plan/prepa' //策划管理-项目立项-新增(修改)项目
export const epsTree = 'api/plan/eps/select/tree' //策划管理-项目立项-新增项目-所属项目群
export const orgTree = 'api/sys/org/select/tree' //策划管理-项目立项-新增项目-责任主体
export const orgPer = (id) => `api/sys/user/${id}/select/list` //策划管理-项目立项-新增项目-责任人
export const planDel = (id) => `api/plan/prepa/${id}`//策划管理-项目立项-删除
export const prepaContactsList = (bizType, bizId, pageSize, currentPageNum) => `api/plan/contacts/list/${bizType}/${bizId}/${pageSize}/${currentPageNum}`//策划管理-项目立项-联系人list
export const prepaContactsAdd = 'api/plan/contacts'//策划管理-项目立项-联系人-增加(修改)联系人
export const prepaContactsById = (id) => `api/plan/contacts/${id}`//策划管理-项目立项-联系人-获取联系人信息
export const prepaContactsDel = 'api/plan/contacts/delete'//策划管理-项目立项-联系人-删除
export const prepaRelease = (id) => `api/plan/prepa/${id}/release`//策划管理-项目立项-发布
export const prepaReleaseList = 'api/plan/prepa/release/list'//立项发布审批列表
export const prepaTree = (bizId, bizType = 'project') => `api/sys/projectteam/${bizType}/${bizId}/tree`//策划管理-项目立项-项目团队-列表
export const prepaProjectteamAdd = 'api/sys/projectteam'//策划管理-项目立项-项目团队-新增
export const prepaProjectteamUpdata = (teamId) => `api/sys/projectteam/${teamId}/info`//策划管理-项目立项-项目团队-修改获取
export const prepaProjectteamDel = 'api/sys/projectteam/delete'//策划管理-项目立项-项目团队-删除
export const prepaProjectteamUserTreeAdd = (id) => `api/sys/projectteam/${id}/user/assign`//策划管理-项目立项-项目团队-分配获取
export const prepaProjectteamUserList = (id) => `api/sys/projectteam/${id}/user/list`//策划管理-项目立项-项目团队-用户列表
export const prepaProjectteamUserUpdate = (teamId, userId) => `api/sys/projectteam/${teamId}/user/${userId}/update`//策划管理-项目立项-项目团队-用户列表-角色修改
export const prepaProjectteamUserDel = 'api/sys/projectteam/user/delete'//策划管理-项目立项-项目团队-用户-删除
export const prepaProjectteamIpt = 'api/sys/ipt/search'//策划管理-项目立项-项目团队-ipt导入list(搜索)
export const prepaProjectteamOrg = 'api/sys/org/search'//策划管理-项目立项-项目团队-组织结构导入list(搜索)
export const prepaProjectteamImportAdd = (dataSource, bizType, bizId, parentId) => `api/sys/projectteam/${dataSource}/${bizType}/${bizId}/${parentId}/import` //策划管理-项目立项-项目团队-ipt导入(组织结构导入)保存
export const prepaProjectteamProjectList = 'api/plan/project/tree' //策划管理-项目立项-项目团队-其他项目团队导入list(搜索)
export const prepaProjectteamProjectAdd = (sourceBizType, sourceBizId, targetBizType, targetBizId) => `api/sys/projectteam/${sourceBizType}/${sourceBizId}/${targetBizType}/${targetBizId}/copy`//策划管理-项目立项-项目团队-其他项目团队导入保存
export const prepaWfList = (ids) => `api/plan/prepa/ids/${ids}/list` //根据立项id获取立项表单
export const processCancel = `api/wf/process/task/cancel`; // 撤销

//项目群
export const epsTreeList = 'api/plan/eps/tree'//策划管理-项目群list
export const epsAdd = 'api/plan/eps'//策划管理-项目群-新增
export const epsDel = (id) => `api/plan/eps/${id}`//策划管理-项目群-删除
export const epsInfo = (id) => `api/plan/eps/${id}`//策划管理-项目群-获取信息
export const epsAlter = 'api/plan/eps'//策划管理-项目群-修改

//协作团队
export const cprtmList = (bizId, bizType) => `api/plan/cprtm/${bizId}/${bizType}/list`//协作团队list
export const cprtmAdd = 'api/plan/cprtm/assign'//协作团队分配
export const cprtmDel = 'api/plan/cprtm/delete'//协作团队删除
// -->项目交付物

//@delvId delvId @pageSize 分页大小 @currentPageNum 当前页数 @查询条件 codeOrname
export const getPlanDelvListByCond = (delvId, pageSize = 10, currentPageNum = 1, codeOrname = '') => `api/plan/delv/${delvId}/task/list/${pageSize}/${currentPageNum}/${codeOrname}`   //获取项目交付物相关的任务列表 - 查询条件
//@delvId delvId @pageSize 分页大小 @currentPageNum 当前页数
export const getPlanDelvListByConds = (delvId, pageSize = 10, currentPageNum = 1) => `api/plan/delv/${delvId}/task/${pageSize}/${currentPageNum}/list`   //获取项目交付物相关的任务列表
export const addPlanPbs = `api/plan/pbs/add`   //增加PBS
export const updatePlanPbs = `api/plan/pbs/update`   //修改PBS
export const getPlanPbsById = id => `api/plan/pbs/${id}`   //获取PBS
export const addPlanDelv = `api/plan/delv/add`   //增加交付物
export const updatePlanDelv = `api/plan/delv/update`   //修改交付物
export const deletePlanDelv = delvId => `api/plan/delv/${delvId}/delete`   //删除交付列表包括（PBS，交付物）
export const getPlanDelvInfo = id => `api/plan/delv/${id}`   //获取交付物
export const getPlanDelvTreeList = projectId => `api/plan/delv/${projectId}/tree`   //获取交付物树形结构
export const getPlanDelvTreeListByDevIds = devIds => `api/plan/delv/ids/${devIds}/tree`   //根据交付物ID获取交付物树形结构
export const getPlanDelvFeedbackList = feedbackId => `api/plan/delv/assign/feedback/${feedbackId}/list`   //获取进展反馈交付清单列表
export const getPlanDelvAssignTaskList = taskId => `api/plan/delv/assign/task/${taskId}/list`   //获取交付清单列表
export const getPlanDelvAssignList = (projectId, taskId) => `api/plan/delv/${projectId}/${taskId }/assign/list`   //获取交付清单分配列表
export const getPlanDelvAssignFileList = delvId => `api/plan/delv/assign/${delvId}/file/list`   //获取交付清单的文件信息
export const addPlanDelvAssign = `api/plan/delv/assign/add`   //增加交付清单
export const assignComplete = `api/plan/delv/assign/complete`  //交付清单完成设置
export const planDelvTaskAssign = taskId => `api/plan/delv/task/${taskId}/assign`   //分配交付清单
export const updatePlanDelvAssign = `api/plan/delv/assign/update`   //修改交付清单
export const getPlanDelvAssign = id => `api/plan/delv/assign/${id}/info` //获取交付物
export const deletePlanDelvAssign = `api/plan/delv/assign/delete`   //删除交付清单
export const getDelvEditTree = projectId => `api/plan/delv/edit/${projectId}/tree`   //获取编制中交付物树形结构
export const getDelvReleaseTree = projectId => `api/plan/delv/release/${projectId}/tree` //获取已发布交付物树形结构
export const updateDelvpublic = "api/plan/delv/release"   //交付物发布
export const updateCancleDelvpublic = "api/plan/delv/cancleReleaaseDelv" //取消交付物发布
export const getDelvsByPbsId = pbsId => `api/plan/delv/${pbsId}/release/editauth`   //获取交付物编制权限
export const importDelvTmpl = (pbsId,projectId) => `api/plan/delv/${pbsId}/${projectId}/import`   //导入交付物模板
//项目信息
export const getproTileInfo = (pageSize, currentPageNum) => `api/plan/project/list/${pageSize}/${currentPageNum}` //获取项目列表 平铺
export const getproTree = "api/plan/project/tree"   //获取项目列表  树形
export const getproInfo = id => `api/plan/project/${id}`    //获取项目基本信息
export const deleteprolist = id => `api/plan/project/${id}/delete` //删除项目
export const updateproInfo = "api/plan/project"       //更新项目信息 put
export const addproject = "api/plan/project"         //新增项目信息
export const getvariable = id => `api/plan/project/variable/${id}` //获取项目变量
export const getCurrency = "api/base/currency/list"    //获取货币列表
export const updateproVariable = "api/plan/project/variable" //更新项目变量
export const currencySetCurrencyBase = id => `api/base/currency/${id}/setCurrencyBase`   //设为基准货币
export const getDefaultCalendar = "api/base/calendar/default/calendar/info"  //获取新增项目信息默认日历
export const getdefineIdListByProjectId = projectId => `api/plan/define/${projectId}/defineIdList` //通过项目ID获取计划列表
export const getDefineListByUserAuthAndProjectId = projectId => `api/plan/define/${projectId}/auth/list` //通过项目ID获取用户权限内的计划定义列表
export const planProAuthTree = `api/plan/project/user/auth/tree`   //根据用户查询有权限的项目列表
export const projectUserTaskAuthSelectTree = `api/plan/project/user/havetask/auth/tree`   //根据用户查询有权限的项目列表(包含任务权限)

//基础数据
export const dictTypeList = 'api/base/dictType/list'
export const baseDigitDir = (boCode) => `api/base/dictType/${boCode}/list`
export const getToken = 'api/auth/jwt/token' //获取token     post
export const getssoToken = 'api/auth/jwt/ssoToken' //获取dddddtoken     post
export const getUserInfo = 'api/sys/login/user/info' //登陆获取用户信息   get
export const addUserInfo = 'api/sys/user/add' //新增用户信息   get
export const getUserInfoList = (pageSize, currentPageNum) => `api/sys/user/list/${pageSize}/${currentPageNum}` //搜索用户列表
export const getUserInfoById = (userId) => `api/sys/user/${userId}/info` //获取用户信息   get
//--字典码值--
export const getDictTypeCodeList = dictTypeCode => `api/base/dict/${dictTypeCode}/treeList`   //字典码值列表
export const deleteDictTypeCode = `api/base/dict/delete`   //删除字典码值
export const addDictTypeCode = `api/base/dict/add`   //新增字典码值
export const getDictTypeCodeInfoById = id => `api/base/dict/${id}/info`   //字典码值基本信息
export const updateDictTypeCode = `api/base/dict/update`   //修改字典码值
//--> 数据字典
export const getDigitDirBoList = 'api/base/digitDirBo/1/list'   //获取业务对象列表
export const geteListByBoCod = boCode => `api/base/dictType/${boCode}/list`   //根据业务对象获取数据字典列表
export const addDigitDirBo = 'api/base/dictType/add'   //添加数据字典
export const deleteDigitDirBo = 'api/base/dictType/delete'   //删除数据字典
export const getInfoByBoId = id => `api/base/dictType/${id}/info`   //根据数据字典id获取详细信息
export const updateDigitDirBo = `api/base/dictType/update`   //修改数据字典
// -->交付物模板
export const getTmpldelvTreeList = "api/base/tmpldelv/tree"    //交付物模板tree
export const getTmpldelvTree = tmpldelvId => `api/base/tmpldelv/${tmpldelvId}/tree`   //交付物模板设置tree
export const getTmpldelvList = (currentPageNum, pageSize) => `api/base/tmpldelv/list/${currentPageNum}/${pageSize}`   //交付物列表
export const deleteTmpldelvList = id => `api/base/tmpldelv/${id}`   //删除交付物模板\PBS\交付物
export const addTmpldelvList = `api/base/tmpldelv/add`   //新增交付物
export const updateTmpldelvList = `api/base/tmpldelv/update`   //修改交付物
export const deleteTmpldelv = "api/base/tmpldelv/delete"     //删除交付物模板
export const getTmpldelvInfoById = id => `api/base/tmpldelv/${id}/info`   //交付物基本信息
export const getTmpldelvSetupInfo = id => `api/base/tmpldelv/${id}/setupinfo`   //交付物设置
export const addTmpldelvPbs = `api/base/tmpldelv/pbs/add`  //新增交付物PBS
export const addTmpldelvDelv = `api/base/tmpldelv/delv/add`  //新增下级交付物
export const updateTmpldelvPbs = "api/base/tmpldelv/pbs/update" //更新交付物模板PBS
export const updateTmpldelvDelv = "api/base/tmpldelv/delv/update" //更新交付物模板交付物
export const deleteTmpldelvPbs = 'api/base/tmpldelv/pbs/delete'  //删除交付物模板PBS
export const deleteTmpldelvDelv = "api/base/tmpldelv/delv/delete"  //删除交付物模板交付物
export const getTmpldelvPbs = id => `api/base/tmpldelv/${id}/pbs/info`  //交付物模板PBS基本信息
export const getTmpldelvDelv = id => `api/base/tmpldelv/${id}/delv/info`  //交付物模板PBS基本信息
//计划模板
export const getTmpltaskTree = "api/base/tmpltask/tree"           //计划模板列表
export const addtmpltask = "api/base/tmpltask/add"                //新增计划模板
export const deleteTmpltask = tmplId => `api/base/tmpltask/${tmplId}/delete`          //删除计划模板
export const getTmpltaskInfo = id => `api/base/tmpltask/${id}/info`     //计划模板信息
export const updateTmpltaskInfo = "api/base/tmpltask/update"       //更新计划模板
export const addTmpltaskWbs = "api/base/tmpltask/wbs/add"         //新增计划模板WBS
export const getTmpltaskWbsInfo = id => `api/base/tmpltask/wbs/${id}/info` //计划模板Wbs信息
export const updateTmpltaskWbsInfo = "api/base/tmpltask/wbs/update" //更新计划模板WBS
export const deleteTmpltaskWbs = id => `api/base/tmpltask/wbs/${id}/delete`    //删除计划模板WBS
export const addTmpltaskTask = "api/base/tmpltask/task/add"         //新增计划模板task
export const deleteTmpltaskTask = id => `api/base/tmpltask/task/${id}/delete` //删除计划模板task
export const getTmpltaskTaskInfo = id => `api/base/tmpltask/task/${id}/info`         //计划模板Task信息
export const updateTmpltaskTask = "api/base/tmpltask/task/update"     //更新计划模板task
export const getTmpltaskPredRelation = taskId => `api/base/tmpltask/${taskId}/relation/pred/list` //紧前任务列表
export const getTmpltaskFollowRelation = taskId => `api/base/tmpltask/${taskId}/relation/follow/list`//后续任务列表
export const getTmpltaskList = tmplId => `api/base/tmpltask/${tmplId}/tree` //计划模板列表
export const tmpltaskAssignIPred = (taskId, predTaskId) => `api/base/tmpltask/${taskId}/relation/assign/pred/${predTaskId}` //分配紧前任务
export const tmpltaskAssignIFollow = (taskId, followTaskId) => `api/base/tmpltask/${taskId}/relation/assign/follow/${followTaskId}` //分配紧前任务
export const deleteTmpltaskRelation = "api/base/tmpltask/relation/delete"  //删除逻辑关系
export const updateTmpltaskRelation = "api/base/tmpltask/relation/update"  //修改逻辑关系
export const getTmpltaskDelvlist = taskId => `api/base/tmpltask/${taskId}/delv/list`  //查询交付清单列表
export const addTmpltaskAssign = taskId => `api/base/tmpltask/${taskId}/delv/assign`  //分配交付物
export const deleteTmpltaskDelv = "api/base/tmpltask/delv/delete"              //删除交付清单信息
export const tmplPlanSelect = 'api/base/tmpl/plan/selectList'//变量设置更改提交
export const addtmpltaskbydefineid = 'api/plan/task/tmpl/add'//变量设置更改提交

//>>分类码
export const getClassifyWf = "api/base/classify/bo/list"  //分类码业务对象集合
export const getClassifyByBoCode = (boCode, bizId) => `api/base/classify/${boCode}/${bizId}/list` //获取 分类码列表   get
export const getClassifylist = (boCode) => `api/base/classify/${boCode}/list` //获取 分类码列表   get
export const addClassify = "api/base/classify/add"      //新增分类码/码值
export const deleteClassify = "api/base/classify/delete" //删除分类码/码值
export const addClassifyValue = "api/base/classify/value/add"  //新增分类码码值
export const getClassifyOrValueById = (id) => `api/base/classify/${id}/info ` //根据分类码/码值主键查找分类码/码值
export const updateClassifyOrValue = "api/base/classify/update"  // 修改分类码/码值
export const getClassifyTags = (boCode, bizId) => `api/base/classify/assign/${boCode}/${bizId}/list` //根据业务ID查找分类码页签数据列表
export const distributeClassify = "api/base/classify/assign"    //分配分类码
export const deleteclassifyassign = "api/base/classify/assign/delete" //删除分配的分配码
export const getclassifybyId = classifyId => `api/base/classify/${classifyId}/value/tree`  //获取分类码码值树形列表
export const updateclassify = "api/base/classify/assign/update"                //更新分配的分配码码值

//自定义
export const getCustomFormList= tableName=>`api/base/custom/${tableName}/list` //自定义字段列表
export const getCustomFiledInfo=(tableName,fieldName)=> `api/base/custom/${tableName}/${fieldName}/info` //获取自定义字段详情
export const updatecustomForm = "api/base/custom/save" //保存自定义字段
export const getCustomInfo = (tableName,bizId) => `api/base/custom/value/${tableName }/${bizId}/info` //获取自定义界面信息
export const saveCustomValue = "api/base/custom/value/save" // 保存自定义信息

//系统管理
export const menuTree = 'api/sys/menu/tree' //系统管理-菜单管理
export const menuAdd = 'api/sys/menu/add' //系统管理-菜单管理-新增
export const menuGetById = id => `api/sys/menu/${id}/info` //系统管理-菜单管理-获取菜单信息
export const menuGetByMenuCode = menuCode => `api/sys/menu/code/${menuCode}/info` //系统管理-菜单管理-根据菜单代码获取菜单信息
export const menuUpdate = 'api/sys/menu/update' //系统管理-菜单管理-修改菜单
export const menuDelete = 'api/sys/menu/delete' //系统管理-菜单管理-删除菜单
export const roleTree = 'api/sys/org/tree' //系统管理-组织机构-全部树形数据
export const roleInfo = (orgId) => `api/sys/org/${orgId}/info` //系统管理-组织机构-机构信息
export const roleUpdate = 'api/sys/org/update' //系统管理-组织机构-修改机构信息
export const addRole = 'api/sys/org/add' //系统管理-组织机构-新增组织
export const deleteRole = 'api/sys/org/delete' //系统管理-组织机构-删除组织
export const menuSearch = 'api/sys/menu/search'//系统管理-菜单管理-搜索
export const orgSearch = 'api/sys/org/search' //系统管理-组织机构-搜索

export const roleLevel = 'api/base/dict/sys.org.level/select/tree ' //系统管理-组织机构-获取机构等级
export const userList = (orgId, pageSize, currentPageNum) => `api/sys/user/select/${orgId}/orgusers/${pageSize}/${currentPageNum}` //系统管理-组织机构-用户列表
export const addUser = 'api/sys/user/add' //系统管理-组织机构-新增用户
export const updateUserInfo = 'api/sys/user/update' //系统管理-组织机构-新增用户
export const roleList = 'api/sys/role/list' //系统管理-角色列表
export const userInfo = (userId) => `api/sys/user/${userId}/info` //系统管理-用户信息
export const deleteUser = 'api/sys/user/delete' //系统管理-删除用户
export const validatePassword = "api/sys/user/validate/password" //修改密码
export const userIdprojectinfo = userId => `api/sys/user/${userId}/project/info` //获取用户信息
//系统管理-菜单管理
export const funcFuncs = (id) => `api/sys/func/${id}/funcs`//系统管理-菜单管理-权限配置表
export const funcAdd = 'api/sys/func/add'//系统管理-菜单管理-权限配置表-新增
export const funcDel = 'api/sys/func/delete'//系统管理-菜单管理-权限配置表-删除
export const funcInfo = (id) => `api/sys/func/${id}/funcinfo`//系统管理-菜单管理-权限配置表-修改查询
export const funcUpdate = 'api/sys/func/updatefunc' //系统管理-菜单管理-权限配置表-修改提交
export const i18ns = (menuId) => `api/sys/i18n/${menuId}/list`//系统管理-菜单管理-国际化列表
export const i18nInfo = (id) => `api/sys/i18n/${id}/info`//系统管理-菜单管理-国际化列表
export const i18nAdd = `api/sys/i18n/add`//系统管理-菜单管理-国际化-新增
export const i18nDel = `api/sys/i18n/delete`//系统管理-菜单管理-国际化-删除
export const getUserByOrgId = orgId => `api/sys/user/${orgId}/select/list` //get 根据OrgId查找User
//系统管理之三元管理

export const tmmAuditlist = (pageSize, currentPageNum) => `api/sys/tmm/audit/list/${pageSize}/${currentPageNum}` //系统管理之三元管理--操作日志
export const tmmOpen = (isopen) => `api/sys/tmm/${isopen}` //三元管理之管理权限开启
export const tmmList = (pageSize, currentPageNum) => `api/sys/tmm/ipaccess/list/${pageSize}/${currentPageNum}` //三元管理之获取ip访问列表
export const tmmAdd = 'api/sys/tmm/ipaccess/add' //三元管理之增加ip访问
export const tmmUpdate = 'api/sys/tmm/ipaccess/update' //三元管理之编辑ip访问
export const tmmDelete = 'api/sys/tmm/ipaccess/delete' //三元管理之删除ip访问设置
export const tmmInfo = 'api/sys/tmm/pwdrule/info' //三元管理之获取密码设置
export const tmmRuleset = 'api/sys/tmm/pwdrule/update' //三元管理之密码规则设置
export const getLevelList = (pageSize, currentPageNum) => `api/sys/user/${pageSize}/${currentPageNum}/level/list`
export const getOrgTree = "api/sys/org/orgName/select/tree" //获取所属组织
export const updateLevel = "api/sys/user/level/update"   //修改密级
export const findAcmlog = (pageSize, currentPageNum) => `api/hbase/acmlog/audit/list/${pageSize}/${currentPageNum}`  //查询日志
export const dailyChangeVersionList = (pageSize, currentPageNum) => `api/dc2/bbgl/DailyChangeVersion/list/${pageSize}/${currentPageNum}`
//系统管理-流程定义
export const wfAssignList = 'api/wf/assign/list'//列表
export const wfAssignAdd = 'api/wf/assign/add'//列表
export const wfAssignUpdate = 'api/wf/assign/update'//列表
export const wfAssignDel = 'api/wf/assign/del'//删除
export const getActivityModelsNewModel = 'api/wf/models/new/model' //新建流程模版
export const assignBussiNewModel = 'api/wf/assign/bussi/new/model' //分配流程模版
export const releaseBussiNewModel = modelId => `api/wf/assign/release/${modelId}/model`  //发布流程模版
export const deleteBussiNewModel = modelId => `api/wf/assign/delete/${modelId}/model`  //删除流程模版
export const getWorkflowModels = typeCode => `api/wf/assign/${typeCode}/models`  //删除流程模版


//系统管理-流程业务定义
export const wfBizTypeList = 'api/wf/biz/type/list'//列表
export const wfBizTypeAdd = 'api/wf/biz/type/add'//新增
export const wfBizTypeInfo = (id) => `api/wf/biz/type/${id}/info`//基本信息
export const wfBizTypeUpdate = 'api/wf/biz/type/update'//修改
export const wfBizTypeDel = (id) => `api/wf/biz/type/${id}/delete`//删除
//基础数据-编码规则
export const businessAdd = 'api/base/coderulebo/add' //基础数据-
export const baseCoderuleboList = 'api/base/coderulebo/list'//编码规则-业务对象列表
export const addCoderulebo = "api/base/coderulebo/add"  //新增业务对象
export const updateCoderulebo = "api/base/coderulebo/update" //更新业务对象
export const deleteCoderulebo = id => `api/base/coderulebo/${id}` //删除业务对象
export const getCoderuleboInfo = id => `api/base/coderulebo/${id}/info` //获取业务对象
export const ruleAdd = 'api/base/coderule/add' //基础数据-编码规则-新增规则
export const ruleList = (boId) => `api/base/coderule/${boId}/list` //基础数据-编码规则-规则列表
export const deleteRule = "api/base/coderule/delete" //删除规则
export const checkRule = ruleId => `api/base/coderule/${ruleId}/check` //校验规则
export const checkTableName = "api/base/coderule/tables"   //查询表名
export const findTableFileds = tableName => `api/base/coderule/${tableName}/fields` //查询表的field
export const getcoderuleInfo = id => `api/base/coderule/${id}/info`     //规则基本信息
export const updatecoderuleInfo = "api/base/coderule/update"     //更新规则信息
export const coderulecell = (ruleId, position) => `api/base/coderulecell/${ruleId}/${position}/info` //规则元素基本信息
export const addCoderulecell = "api/base/coderulecell/add"  //新增规则元素
export const updateCoderulecell = "api/base/coderulecell/update" //更新规则元素信息
export const getcoderuletype = boId => `api/base/coderuletype/${boId}/list` //维护规则类型列表
export const addcoderuletype = "api/base/coderuletype/add"  //新增维护规则
export const getdigitDirBo = botype => `api/base/digitDirBo/${botype}/list` //重定向到字典下拉
export const getcoderuletypeinfo = id => `api/base/coderuletype/${id}/info` //获取维护规则类型信息
export const updateCoderuletype = "api/base/coderuletype/update"    //更新维护规则信息
export const deleteCoderuletype = `api/base/coderuletype/delete`    //删除维护规则信息-逗号隔开删除多条
export const getcoderuletypeList=(boId,ruleType)=> `api/base/coderuletype/${boId}/${ruleType}/select` //获取值
export const deleteCoderulecell ="api/base/coderulecell/delete" //删除规则元素信息
//基础数据-日历设置
export const calendarList = 'api/base/calendar/list'//基础数据-日历设置-日历设置列表
export const calendarDef = (id) => `api/base/calendar/${id}/default`//基础数据-日历设置-设置默认日历
export const calendarDel = 'api/base/calendar/delete'//基础数据-日历设置-删除日历设置信息
export const calendarAdd = 'api/base/calendar/add'//基础数据-日历设置-新增日历设置
export const calendarInfo = (id) => `api/base/calendar/${id}/info`//基础数据-日历设置-日历基本信息
export const calendarDefInfo = 'api/base/calendar/default/info'//基础数据-日历设置-日历默认基本信息
export const calendarUpdate = 'api/base/calendar/update'//基础数据-日历设置-修改日历基本信息
export const calendarCopy = (id) => `api/base/calendar/${id}/copy`//基础数据-日历设置-复制
export const calendarweekdaysupdate = "api/base/calendar/weekdays/update"  //修改日历标准周期
export const calendarExceptionsUpdate = 'api/base/calendar/exceptions/update' //例外修改
export const cancleCalendarExceptions = (id, time) => `api/base/calendar/exceptions/${id}/${time}/cancle` //取消例外
//基础数据-货币设置
export const currencyList = 'api/base/currency/list' //货币列表查询
export const currencyAdd = 'api/base/currency/add' //货币新增
export const currencyDelete = 'api/base/currency/delete' //货币删除
export const currencySeach = 'api/base/currency/list' //货币查找
export const currencyInfo = id => `api/base/currency/${id}/info` //货币基本信息
export const defaultCurrencyInfo = `api/base/currency/defaultCurrency` //默认货币基本信息
export const currencyUpdata = 'api/base/currency/update' //更新货币基本信息


//计划管理-计划定义
export const getEditPlanDefineAuth = (projectId) => `api/plan/define/${projectId}/defineAuth`//判断用户是否有新增计划权限
export const defineTree = (projectIds) => `api/plan/define/${projectIds}/tree`//计划定义列表
export const defineOrgTree = (projectId) => `api/sys/org/${projectId}/select/tree`//责任主体
export const defineOrgUserList = (orgId) => `api/sys/user/${orgId}/select/list`//责任人
export const defineAdd = 'api/plan/define/add'//新增
export const defineInfo = (id) => `api/plan/define/${id}/info`//获取计划定义
export const defineDel = (ids) => `api/plan/define/${ids}/delete`//删除
export const defineUpdate = 'api/plan/define/update' //修改计划定义
export const defineBaselineList = (defineId) => `api/plan/define/${defineId}/baseline/list`//获取进度基线
export const defineBaselineActive = (defineId, id) => `api/plan/baseline/${defineId}/${id}/active`//执行基线
export const defineBaselineAdd = 'api/plan/baseline/add'//新增进度基线
export const defineBaselineDel = 'api/plan/baseline/delete'//删除基线
export const defineBaselineInfo = (id) => `api/plan/baseline/${id}/info`//修改页面获取信息
export const defineBaselineUpdate = 'api/plan/baseline/update'//修改进度基线
export const getFieldBaseLineCompare = (defineId) => `api/plan/baseline/${defineId}/compare/list`//获取基线下拉框
export const getPlanBaseLineCompareList = (defineId,firstBl,secondBl) => `api/plan/baseline/task/${defineId}/${firstBl}/${secondBl}/compare`//获取基线对比页面数据
export const getPlanBaseLineCompareInfo = (taskId,firstBl,secondBl) => `api/plan/baseline/task/${taskId}/${firstBl}/${secondBl}/compare/info`//获取基线对比页面数据
export const defineVariableInfo = (id) => `api/plan/define/variable/${id}/info`//变量设置获取信息
export const defineVariableUpdate = 'api/plan/define/variable/update'//变量设置更改提交

// --> 角色管理
// export const roleList = 'api/sys/role/list'                         //系统管理-角色管理-列表
export const roleAdd = 'api/sys/role/add'                           //系统管理-角色管理-新增
export const roleDelete = 'api/sys/role/delete'                     //系统管理-角色管理-删除
export const searchRole = 'api/sys/role/search'                      //搜索角色
export const getRoleUserList = (roleId, pageSize, currentPageNum) => `api/sys/user/select/${roleId}/roleusers/${pageSize}/${currentPageNum}` //角色管理-右边用户列表
export const deleteUserRoles = 'api/sys/auth/user/role/delete'        //删除用户角色关系
export const assignUserRoles = 'api/sys/auth/assign/user/role'        //分配用户角色关系
export const roleUpdate2 = 'api/sys/role/update'                     //系统管理-角色管理-修改
export const getRoleInfoById = id => `api/sys/role/${id}/info`       //系统管理-角色管理-根据id获取用户信息
export const getAuthListByRoleId = roleId => `api/sys/auth/${roleId}/list` //根据roleId获取权限列表
export const updateRoleAuth = roleId => `api/sys/auth/${roleId}/update/auth` //修改roleAuth的信息
export const roleSearchList = (pageSize, currentPageNum) => `api/sys/role/search/${pageSize}/${currentPageNum}`
//交付物模板
export const gettmpldelv = (currentPageNum, pageSize) => `api/base/tmpldelv/tree/${currentPageNum}/${pageSize}` //交付物列表
// --> 全局设置
export const updateSetProject = `api/base/set/project/update`   //保存更新全局设置
export const updateSetDoc = `api/base/set/doc/update`   //修改文档全局设置
export const updateSetTime = `api/base/set/time/update`   //修改时间设置
export const getProjectInfo = `api/base/set/project/info`   //项目全局设置信息
export const getDocInfo = `api/base/set/doc/info`   //文档全局设置信息
export const getTimeInfo = `api/base/set/time/info`   //时间全局设置信息
export const setBolist = `api/base/set/bo/list`   //业务编码

//--> 字典表
export const getBaseSelectTree = typeCode => `api/base/dict/${typeCode}/select/tree`   //保存更新全局设置

//文档管理-临时文档
export const docTempList = (pageSize, currentPageNum) => `api/doc/temp/${pageSize}/${currentPageNum}/list`//列表
export const docTempFile = (ids) => `api/doc/temp/completefile/${ids}/list`//完善信息list
export const docTempDel = 'api/doc/temp/delete'//完善信息删除

export const docCorpSel = 'api/doc/corp/folder/select/tree'//企业文件夹
export const docProjectSel = (projectId) => `api/doc/project/folder/${projectId}/select/tree`//项目文件夹
export const docPlanProject = 'api/plan/project/user/auth/select/tree'//选择项目
export const docOrgSel = (id) => `api/sys/org/${id}/select/tree`//部门
export const docMainOrg = (userId) => `api/sys/org/${userId}/mainorg`//获取主部门
export const docTempAdd = 'api/doc/temp/completefile/add'//完善信息
//文档管理-企业文档
export const docCompFolderList = 'api/doc/corp/folder/tree'//文件夹list
export const docWfCompList = (ids) => `api/doc/corp/wf/ids/${ids}/list` //wf企业文档列表
export const docCompList = (folderId, pageSize, pageNum) => `api/doc/corp/${folderId}/${pageSize}/${pageNum}/list`//企业文档列表
export const docFolderUpdate = 'api/doc/corp/folder/update'//企业文档文件夹名称修改
export const docFolderAdd = 'api/doc/corp/folder/add'//企业文档文件夹新增
export const docFolderDel = (folderId) => `api/doc/corp/folder/${folderId}/delete`//企业文档文件夹删除
export const docReleaseList = 'api/doc/corp/release/list'//企业文档文档发布列表
export const docReleaseListByFolderId = (folderId) =>  `api/doc/corp/${folderId}/release/list`//企业文档文档发布列表
export const docCorpAdd = 'api/doc/corp/add' //企业文档上传
export const docCorpInfo = (docId) => `api/doc/corp/${docId}/info` //企业文档基本信息
export const docCorpRelease = 'api/doc/corp/release'//企业文档文档发布
export const docCompDel = 'api/doc/corp/delete'//企业文档列表删除
export const docCompUpdate = 'api/doc/corp/update'//企业文档基本信息修改
export const docCompPromote = 'api/doc/corp/promote'//企业文档升版
export const docFileInfo = (fileId) => `api/doc/file/${fileId}/info`//文件下载
export const docFileEdit = (id) => `/file/${id}/edit` //文件在线编辑
export const docCompHistoryList = (docId) => `api/doc/corp/history/${docId}/list`//企业文档历史版本列表

//项目文档
export const docProjectFolderTree = (projectId) => `api/doc/project/folder/${projectId}/tree`//文件夹列表
export const docProjectFolderAdd = 'api/doc/project/folder/add'//文件夹新建
export const docProjectFolderUpdate = 'api/doc/project/folder/update'//文件夹修改
export const docProjectFolderDel = (folderId) => `api/doc/project/folder/${folderId}/delete`//文件夹删除
export const docWfProjectList = (ids) => `api/doc/project/wf/ids/${ids}/list`//wf文档列表
export const docGivingList=(folderId,bizType,flag,projectIds)=> `api/doc/project/${folderId}/${bizType}/${flag}/${projectIds}/giving/list` //分发列表
export const docProjectList = (folderId,bizType,flag, pageSize, pageNum) => `api/doc/project/${folderId}/${bizType}/${flag}/${pageSize}/${pageNum}/list`//文档列表
export const docProjectReleaseList =projectId=> `api/doc/project/${projectId}/release/list`//发布列表
export const docProjectRelease = 'api/doc/project/release'//发布
export const docProjectCalcRelease = 'api/doc/project/calcrelease'//取消发布
export const docProjectTask = (projectId) => `api/plan/task/${projectId}/check/tree`//上传页面选择任务弹窗页面接口
export const docProjectAdd = 'api/doc/project/add'//上传接口
export const docEpsAdd = 'api/doc/eps/add'//项目群上传接口
export const docProjectInfo = (docId) => `api/doc/project/${docId}/info`//获取文档数据
export const docProjectPromote = 'api/doc/project/promote'//升版
export const docProjectUpdate = 'api/doc/project/update'//文档修改
export const docEpsUpdate = 'api/doc/eps/update'//项目群文档修改
export const docProjectDel = 'api/doc/project/delete'//文档删除
export const userAll = 'api/sys/user/all'//接受人
export const docOutgivings = 'api/doc/outgivings'//按人分发
export const docOutgivingsByGroup = 'api/doc/outgivings/group'//按组分发
export const docEmail = 'api/doc/email'//邮件
export const deletefile =  `api/doc/file/delete`//删除文件
export const queryDocUserGroup = `api/doc/usergroup/list`//获取分发组列表
export const getUserGroupInfo = (id) => `api/doc/usergroup/${id}/info`//获取分发组详情
export const addDocUserGroup = `api/doc/usergroup/add`//新增分发组
export const updateDocUserGroup = `api/doc/usergroup/update`//修改分发组
export const deleteDocUserGroup = (id) => `api/doc/usergroup/${id}/delete`//删除分发组
export const queryDocUserGroupAssign = (groupId) => `api/doc/usergroup/assign/${groupId}/list`//获取分发组列表
export const addDocUserGroupAssign = (groupId) => `api/doc/usergroup/${groupId}/assign`//分配分发组成员
export const updateDocUserGroupAssign = `api/doc/usergroup/assign/update`//分配分发组成员
export const deleteDocUserGroupAssign = `api/doc/usergroup/assign/delete`//分配分发组成员

//文档模板
export const tmpdocListSearch = (currentPageNum, pageSize, key) => `api/base/tmpldoc/list/${currentPageNum}/${pageSize}/${key}`//列表(含搜索)
export const tmpdocList = (currentPageNum, pageSize) => `api/base/tmpldoc/list/${currentPageNum}/${pageSize}`//列表

export const tmpdocAdd = 'api/base/tmpldoc/add'//新增
export const tmpdocInfo = (id) => `api/base/tmpldoc/${id}/info`//文档模板信息
export const tmpdocUpdate = 'api/base/tmpldoc/update'//更新文档模板
export const tmpdocDel = 'api/base/tmpldoc/delete'//删除

export const docReationsList = (bizId, bizType) => `api/doc/reations/${bizId}/${bizType}/list`//获取文档信息

export const docReleaseReationsList = (bizId, bizType,status) => `api/doc/reations/${bizId}/${bizType}/${status}/list`//获取文档信息
//收藏夹
export const docFavoriteTree = 'api/doc/favorite/folder/tree'//收藏夹列表
export const docFavoriteUpdate = 'api/doc/favorite/folder/update'//收藏夹修改
export const docFavoriteAdd = 'api/doc/favorite/folder/add'//新增收藏夹
export const docFavoriteDel = (favoriteId) => `api/doc/favorite/folder/${favoriteId}/delete`//删除收藏夹
export const docFavoriteList = (favoriteId, pageSize, pageNum) => `api/doc/favorite/folder/${favoriteId}/${pageSize}/${pageNum}/doc/list`//收藏夹列表
export const docFavoriteDoc = (docId, favoriteId) => `api/doc/favorite/${docId}/${favoriteId}/add`//文档收藏

export const docFavoriteCancelCollection = `api/doc/favorite/delete`//取消收藏

//回收站
export const docRecyclebinList = (pageSize, currentPageNum) => `api/doc/recyclebin/${pageSize}/${currentPageNum}/list`//回收站列表
export const docRecyclebinRestore = 'api/doc/recyclebin/restore'//还原
export const docRecyclebinDel = 'api/doc/recyclebin/delete'//删除
export const docRecyclebinInfo = (id) => `api/doc/recyclebin/${id}/info`//详情


//资源管理
export const getRsrcrole = "api/rsrc/rsrcrole/treeList"       //获取资源角色
export const addrsrcrole = "api/rsrc/rsrcrole/add"     //新增资源角色
export const deletersrcrole = id => `api/rsrc/rsrcrole/delete/${id}` //删除资源角色
export const getrsrcroleInfo = id => `api/rsrc/rsrcrole/${id}/info`  //获取资源角色详情
export const updatersrcrole = "api/rsrc/rsrcrole/update"   //修改资源角色
export const getUserRsrc = "api/rsrc/user/tree"       //获取人力资源列表
export const getuserRsrcInfo = id => `api/rsrc/user/${id}/info`  //获取人力资源详情
export const updateUserRsrcInfo = "api/rsrc/user/update"    //更新人力资源基本信息
export const importUserRsrc = (addnewusers, updateexists, deleteinexistent) => `api/rsrc/user/importUserRsrc/${addnewusers}/${updateexists}/${deleteinexistent}` //导入资源用户
export const AddUserRsrc = "api/rsrc/user/add"         //新增人力资源
export const deleteUserRsrc = "api/rsrc/user/delete"    //删除人力资源
export const geteuipRsrc = "api/rsrc/equip/list"     //获取设备资源
export const addeuipRsrc = "api/rsrc/equip/add"      //新增设备资源
export const deleteEuipRsrc = "api/rsrc/equip/delete" //删除设备资源
export const addEquipType = "api/rsrc/equip/addEquipType" //新增设备资源类别
export const deleteEquipType = ids => `api/rsrc/equip/deleteEquipType/${ids}`  //删除设备资源类别
export const getequipInfo = id => `api/rsrc/equip/${id}/info`   //获取数据设备资源信息
export const updateEquip = "api/rsrc/equip/update"     //修改修改设备资源
export const getequipTypeInfo = id => `api/rsrc/equip/${id}/equipTypeInfo` //获取数据设备资源类型信息
export const updateEquipType = "api/rsrc/equip/updateEquipType"    //修改设备资源类别
export const rsrcAssign = (rsrcId, rsrcType) => `api/rsrc/rsrcAssign/${rsrcId}/${rsrcType}/list` //查询资源角色
export const addrsrcAssign = "api/rsrc/rsrcAssign/assign"   //分配角色
export const deletersrcAssign = "api/rsrc/rsrcAssign/delete" //删除分配角色
//材料资源
export const getmaterial = "api/rsrc/material/list" //获取材料资源
export const addmaterial = "api/rsrc/material/add"    //新增材料资源
export const getmaterialInfo = id => `api/rsrc/material/${id}/info` //获取数据材料资源信息
export const updatematerialInfo = "api/rsrc/material/update"   //更新数据材料资源信息
export const deletematerial = "api/rsrc/material/delete"  //删除材料

//资源分析
export const getAnalysisStatus = (rsrcId, rsrcType, year, month) => `api/rsrc/analysis/${rsrcId}/${rsrcType}/${year}/${month}/status` //查询资源使用状态
export const getAnalysisList = (rsrcId, rsrcType, date) => `api/rsrc/analysis/${rsrcId}/${rsrcType}/${date}/task/list`               //资源分析列表

//资源消耗
export const getTaskrsrcList = (taskId, feedbackId) => `api/plan/task/rsrc/consumption/${taskId}/${feedbackId}/list` //获取资源消耗列表
export const updateRsrcConsumption = "api/plan/task/rsrc/consumption/update"           //修改资源消耗
export const getRsrcConsumptionInfo=(id,feedbackId)=>`api/plan/task/rsrc/consumption/${id}/${feedbackId}/info`  //资源消耗详情
//计划反馈
export const getfeedbackTree = defineIds => `api/plan/feedback/${defineIds}/tree` //获取反馈页面树
export const getfeedbackList = defineIds => `api/plan/feedback/${defineIds}/list`    //获取反馈页面列表
export const getfeedbackInfo = defineIds => `api/plan/feedback/${defineIds}/release/tree` //获取反馈批准页面树
export const getfeedbacktaskInfo = taskId => `api/plan/feedback/task/${taskId}/info`  //反馈页签
export const getProcessfeedbacktaskInfo = feedbackId => `api/plan/feedback/process/task/${feedbackId}/info`  //反馈流程页签
export const addplanfeedback = "api/plan/feedback/add"                                     //增加进展日志
export const getfeedbackreleasetree = defineIds => `api/plan/feedback/${defineIds}/release/tree`  //获取反馈批准页面树
export const updatefeedbackrelease = "api/plan/feedback/release"    //反馈表批准
export const getfeedbacklist = taskId => `api/plan/feedback/task/${taskId}/list`   //获取进展日志
export const deletefeedback = id => `api/plan/feedback/${id}/delete`   //删除进展日志
export const feedbackcancleRelease = taskId => `api/plan/feedback/${taskId}/cancleRelease` //根据任务id取消反馈批准
export const getFeedbackTreeByIds = ids => `api/plan/feedback/ids/${ids}/tree` //根据反馈ID获取进展反馈列表树形集合
export const getFeedbackWorkflowByIds = id => `api/plan/feedback/workflow/${id}/list`   //根据反馈id获取反馈集合


//公共api
export const getdictTree = bocode => `api/base/dict/${bocode}/select/tree` //获取字典下拉菜单
export const getuserauthtree = "api/plan/define/user/auth/tree"          //打开计划–获取用户权限内的计划定义集合，包括（queryDefineTreeByUser参与任务的的计划定义集合）
export const getFileHelp = "api/doc/file/help"   //帮助文档
export const downHelp = fileName => `api/doc/file/down/help/${fileName}`      //下载帮助文档
export const deleteMenuFavorites = "api/sys/menu/favorites/delete"        //取消菜单收藏
export const addMenuFavorites = "api/sys/menu/favorites/add"              //收藏菜单
export const getSysBaseMenu = "api/sys/menu/base"                          //获取系统菜单
export const getMenuFavoritesList = "api/sys/menu/favorites/list"          //获取收藏菜单列表
export const getOrgUserTree = "api/sys/org/user/tree" // 获取组织/用户列表
export const addFavorites = "api/sys/favorites/add" //增加收藏
export const restFavorites = "api/sys/favorites/rest" //重置收藏
export const listRestFavorites = "api/sys/favorites/list/rest" //批量重置收藏
export const deleteFavorites = (bizType, bizs) => `api/sys/favorites/${bizType}/${bizs}/delete` //删除收藏
export const getFavoritesList = (bizType) => `api/sys/favorites/${bizType}/list` //查询收藏
export const getLastOpenInfo =(type)=> `api/plan/project/last/open/${type}/info` //查询用户上次打开的计划或者项目

//项目问题
export const getquestionList = (projectId, taskId) => `api/comu/question/${projectId}/${taskId}/lists` //获取项目问题列表
export const addquestion = "api/comu/question/add" //新增项目问题
export const updatequestion = "api/comu/question/update" //修改项目问题
export const deletequestion = "api/comu/question/delete" //删除项目问题
export const getmeetingupdateinfo = id => `api/comu/question/${id}/info` //查询项目问题详情
export const questionrelease = "api/comu/question/release"   //发布
export const questioncancelRelease = "api/comu/question/cancel/release"  //取消发布
export const getProjectquesition = (projectId, taskId) => `api/comu/question/${projectId}/${taskId}/list`  //问题管理(计划反馈)
//控制台-消息
export const messageWrite = 'api/sys/message/write'//发送
export const messageDraftsAdd = 'api/sys/message/drafts/add'//保存为草稿箱
export const messageRecvSearch = (pageSize, currentPageNum, title) => `api/sys/message/recv/${pageSize}/${currentPageNum}/${title}`//获取收件箱列表(含搜索)
export const messageRecv = (pageSize, currentPageNum) => `api/sys/message/recv/${pageSize}/${currentPageNum}`//获取收件箱列表
export const messageCollect = (messageId, mailType) => `api/sys/message/${messageId}/${mailType}/collect`//收藏
export const messageCancleCollect = (messageId, mailType) => `api/sys/message/${messageId}/${mailType}/cancleCollect`
export const messageSendSearch = (pageSize, currentPageNum, title) => `api/sys/message/send/${pageSize}/${currentPageNum}/${title}`//获取发件箱列表(含搜索)
export const messageSend = (pageSize, currentPageNum) => `api/sys/message/send/${pageSize}/${currentPageNum}`//获取发件箱列表
export const messageSendDel = 'api/sys/message/send/delete' //发件箱删除
export const messageRecvDel = 'api/sys/message/recv/delete'//收件箱删除
export const messageCollectSearch = (pageSize, currentPageNum, title) => `api/sys/message/collect/${pageSize}/${currentPageNum}/${title}`//获取重要消息列表(含搜索)
export const messageCollectList = (pageSize, currentPageNum) => `api/sys/message/collect/${pageSize}/${currentPageNum}` //获取重要消息列表
export const messageDraftsSearch = (pageSize, currentPageNum, title) => `api/sys/message/drafts/${pageSize}/${currentPageNum}/${title}`//获取草稿箱列表(含搜索)
export const messageDrafts = (pageSize, currentPageNum) => `api/sys/message/drafts/${pageSize}/${currentPageNum}`//获取草稿箱列表
export const messageDeletedSearch = (pageSize, currentPageNum, title) => `api/sys/message/deleted/${pageSize}/${currentPageNum}/${title}`//获取已删除消息列表(含搜索)
export const messageDeleted = (pageSize, currentPageNum) => `api/sys/message/deleted/${pageSize}/${currentPageNum}`//获取已删除消息列表
export const messageView = (messageId) => `api/sys/message/${messageId}/view`//获取邮件信息
export const messageRead = 'api/sys/message/read'//设置为已读
export const messageDel = 'api/sys/message/delete'//清除已删除
export const messageDraftsDel = 'api/sys/message/drafts/delete'//删除草稿箱
export const messageFileList = 'api/doc/file/info/list'//查看消息里的附件
export const messageNum = 'api/sys/message/num'//统计消息数
export const getLastMessageList = 'api/sys/message/mine/newest/list'//我的消息右上角下拉框

export const messageCancleDel = 'api/sys/message/cancleDel'//还原已删除
//视图
export const updateView="api/sys/view/save" //保存视图
export const saveAsView="api/sys/view/saveas" //另存(新增)为视图
export const deleteView="api/sys/view/delete" //删除视图
export const viewIdGlobal=viewId =>`api/sys/view/${viewId}/global` //个人视图变为全局视图
export const updateViewName=(viewId,viewName)=>`api/sys/view/${viewId}/${viewName}/update/name` //修改视图名称
export const setDefaultView=(viewId,bizType)=>`api/sys/view/${viewId}/${bizType}/default`  //设为默认视图
export const getViewTree=bizType=>`api/sys/view/${bizType}/tree` //获取视图树形
export const getViewInfo=viewId=>`api/sys/view/${viewId}/info` //获取视图信息
export const getViewList=bizType=>`api/sys/view/${bizType}/list`  //视图加载列表
/// 计划编制
export const getPreparedTreeList = `api/plan/task/tree` //获取计划编制树形列表
export const addPlanWbs = `api/plan/wbs/add` //增加WBS
export const batchaddwbs="api/plan/wbs/batch/add" //批量新增WBS
export const updatePlanWbs = `api/plan/wbs/update` //修改WBS
export const getWbsInfoById = wbsId => `api/plan/wbs/${wbsId}/info` //获取WBS信息
export const addPlanTask = `api/plan/task/add` //增加任务
export const updatePlanTask = `api/plan/task/update` //修改任务
export const deletePlanTask = taskId => `api/plan/task/${taskId}/delete` //删除任务
export const getTaskInfoById = taskId => `api/plan/task/${taskId}/info` // 获取任务信息
export const getPlanTaskRelationTree = taskId => `api/plan/task/${taskId}/relation/tree` //获取Task计划关联列表
export const releasePlanTask = projectId => `api/plan/task/${projectId}/release` //发布计划
export const cancelReleasePlanTask = projectId => `api/plan/task/${projectId}/cancelRelease` //取消发布计划
export const confirmPlanTask = projectId => `api/plan/task/${projectId}/confirm` //确认计划
export const cancelConfirmPlanTask = projectId => `api/plan/task/${projectId}/cancelConfirm` // 取消确认计划
export const releasePlanTaskTree = projectId => `api/plan/task/${projectId}/release/tree` // 发布计划树
export const cancelReleasePlanTaskTree = projectId => `api/plan/task/${projectId}/cancelRelease/tree` // 取消发布计划树
export const confirmPlanTaskTree = projectId => `api/plan/task/${projectId}/confirm/tree` // 确认计划树
export const cancelConfirmPlanTaskTree = projectId => `api/plan/task/${projectId}/cancelConfirm/tree` // 取消确认计划树
export const releasePlanTaskTreeByDefineIds = defineIds => `api/plan/task/define/${defineIds}/release/tree` // 发布计划树
export const cancelReleasePlanTaskTreeByDefineIds = defineIds => `api/plan/task/define/${defineIds}/cancelRelease/tree` // 取消发布计划树
export const confirmPlanTaskTreeByDefineIds = defineIds => `api/plan/task/define/${defineIds}/confirm/tree` // 确认计划树
export const cancelConfirmPlanTaskTreeByDefineIds = defineIds => `api/plan/task/define/${defineIds}/cancelConfirm/tree` // 取消确认计划树
export const getPlanTaskAssginTree = defineId => `api/plan/task/${defineId}/relation/assgin/tree` // 分配计划树
export const doPlanTaskAssgin = taskId => `api/plan/task/${taskId}/relation/assign` // 计划关联
export const updatePlanTaskAssgin = taskId => `api/plan/task/${taskId}/relation/update` // 计划关联修改
export const deletePlanTaskAssgin = `api/plan/task/relation/delete` // 删除计划关联
export const getPlanTaskPredList = taskId => `api/plan/task/${taskId}/pred/list` // 获取紧前任务列表
export const getPlanTaskFollowList = taskId => `api/plan/task/${taskId}/follow/list` // 获取后续任务列表
export const getPlanTaskPredAssginTree = defineId => `api/plan/task/${defineId}/pred/assgin/tree` // 逻辑关系分配任务树
export const addPlanTaskPred = (taskId, predTaskId) => `api/plan/task/${taskId}/${predTaskId}/pred/add` // 增加逻辑关系分配(前置任务)
export const updatePlanTaskPred = `api/plan/task/pred/update` // 修改逻辑关系
export const deletePlanTaskPred = `api/plan/task/pred/delete` // 删除逻辑关系分配
export const getPlanTaskrsrcList = taskId => `api/plan/task/rsrc/${taskId}/list` // 获取任务分配资源
export const getPlanTaskrsrcUserAssignTree = taskId => `api/plan/taskrsrc/user/assign/${taskId}/tree` // 人力资源分配树
export const getPlanTaskrsrcEquipAssignTree = taskId => `api/plan/taskrsrc/equip/assign/${taskId}/tree` // 设备资源分配树
export const addPlanTaskrsrc = `api/plan/task/rsrc/add` // 分配资源
export const updatePlanTaskrsrc = `api/plan/task/rsrc/update` // 修改资源分配
export const deletePlanTaskrsrc = `api/plan/task/rsrc/delete` // 删除资源分配
export const getPlanBaselineInfo = (taskId, defineId) => `api/plan/baseline/task/${taskId}/${defineId}/info` // 获取Task基线计划
export const getPlanEvmsBaselineInfo = (taskId, defineId) => `api/plan/baseline/evms/task/${taskId}/${defineId}/info` // 获取Task基线计划
export const getPlanTaskChangeList = taskId => `api/plan/task/${taskId}/change/list` // post 获取计划变更列表
export const getTaskEditAuth = (defineId = 0, taskId = 0) => `api/plan/task/${defineId}/${taskId}/edit/auth` // 获取Task的编辑权限
export const planCalculate = "api/plan/task/calc/calculate" //进度计算
export const planSimulationCalculate = "api/plan/task/calc/simulation/calculate" //模拟进度计算
export const getAddInitData = (defineId, parentId) => `api/plan/task/${defineId}/${parentId}/add/init/info` //计划编制新增默认值
export const caculateWorkHour = `api/plan/task/caculate/workHour` //计算工期
export const getTaskTreeByIds = ids => `api/plan/task/ids/${ids}/tree` // 根据ID集合获取树形
export const isHasTaskByDefineId = defineId => `api/plan/task/${defineId}/hastask` // 判断该条计划下是否有任务或wbs
export const exportAllPlan = `api/plan/task/export/plan` // 判断该条计划下是否有任务或wbs
export const getComcateLogList=taskId=>`api/plan/communicationrecord/question/task/${taskId}/list` //获取查询问题
export const addQuestionList=`api/plan/communicationrecord/question/add` //新增问题
export const updateQuestionList=`api/plan/communicationrecord/question/update` //修改问题
export const deleteQuestionList=id=>`api/plan/communicationrecord/question/${id}/delete`//删除问题
export const getQuestionInfo=id=>`api/plan/communicationrecord/question/${id}` //问题信息
export const getquesttionReplyList=questionId=>`api/plan/communicationrecord/question//${questionId}/questionreply/list` //获取问题回复
export const getquesttionReplyInfo=id=>`api/plan/communicationrecord/questionreply/${id}` //获取问题回复信息
export const deletequesttionReply=id=>`api/plan/communicationrecord/questionreply/${id}/delete` //删除问题回复
export const addquesttionReply=`api/plan/communicationrecord/questionreply/add` //增加问题回复
export const updatequesttionReply=`api/plan/communicationrecord/questionreply/update` //修改问题回复
export const getCommunicationrRcordList="api/plan/communicationrecord/list" //获取沟通记录
export const importPlanTemplate = (defineId, templateId) => `api/plan/task/${defineId}/template/${templateId}/import` //导入计划模板
export const getTaskRsrcInfo=id=>`api/plan/task/rsrc/${id}/info` //获取资源计划详情
export const getAssignTaskTree=defineIds=>`api/plan/task/define/${defineIds}/assign/tree`  //根据分类码获取任务
export const getAssignTaskList=`api/base/classify/assign/task` //获取已分配的任务
export const getAssignedList=(classifyId,classifyTypeId,boCode)=>`api/plan/task/${classifyId}/${classifyTypeId}/${boCode}/assigned/list`  //获取已分配的的任务列表
export const deleteAssignedTask="api/base/classify/assigned/task/delete" //删除已分配的任务
export const getGroupPlanColumns = (projectId,year) => `api/plan/task/group/plan/columns/${projectId}/${year}`; //获取计划统计报表的专业名称列数
export const getGroupPlanList = (projectId,year) => `api/plan/task/group/plan/table/${projectId}/${year}`; //获取计划统计报表的专业名称列数
export const exportGroupPlanExcel =  "api/plan/task/export/month/plan" //导出
// 计划变更
// 计划变更
export const getPlanChangeList = taskId => `api/plan/task/${taskId}/change/list` //post 计划编制-变更页签
export const getPlanChangeTreeList = `api/plan/task/change/tree` //get 获取变更树
export const getPlanWbsChangeInfo = (type, wbsId) => `api/plan/wbs/change/${type}/${wbsId}/info` //get 获取WBS变更信息
export const addPlanWbsChange = `api/plan/wbs/change/add` //post 增加WBS变更
export const updatePlanWbsChange = `api/plan/wbs/change/update` //put wbs变更页签保存
export const deletePlanWbsChange = wbsId => `api/plan/wbs/change/${wbsId}/delete` //delete 删除WBS变更
export const cancelPlanTaskChange = (taskId, type) => `api/plan/task/change/${taskId}/${type}/cancel` //put 撤销变更
export const getPlanTaskChangeReleaseTree = `api/plan/task/change/release/tree` // post 获取变更审批树
export const releasePlanTaskChange = `api/plan/task/change/release` //put 批准变更
export const getPlanTaskChangeRecord = taskId => `api/plan/task/change/${taskId}/record` //get 获取变更记事
export const getPlanTaskChangeWfList = procInstId => `api/plan/task/change/wf/${procInstId}/list` //get 流程处理（变更）
export const getPlanTaskChangeInfo = (type, taskId) => `api/plan/task/change/${type}/${taskId}/info` //get 获取task变更信息
export const getPlanTaskChangePredList = (bizId, bizType) => `api/plan/task/change/pred/${bizId}/${bizType}/list` //get 获取变更的紧前任务列表
export const getPlanTaskChangeFllowList = (bizId, bizType) => `api/plan/task/change/fllow/${bizId}/${bizType}/list` //get 获取变更的后续任务列表
export const addPlanTaskChange = `api/plan/task/change/add` //post 增加task变更
export const updatePlanTaskChange = `api/plan/task/change/update` //put 修改task变更
export const updatePlanStartChange = `api/plan/start/change/update` //put 开始里程碑页签保存
export const updatePlanEndChange = `api/plan/end/change/update` //put 完成里程碑页签保存
export const deletePlanTaskChange = taskId => `api/plan/task/change/${taskId}/delete` //delete 删除task变更
export const addPlanChgtaskrsrc = `api/plan/chgtaskrsrc/add` //post 增加变更资源
export const updatePlanChgtaskrsrc = `api/plan/chgtaskrsrc/update` //put 修改变更的资源分配
export const deletePlanChgtaskrsrc = chgtaskrsrcId => `api/plan/chgtaskrsrc/${chgtaskrsrcId}/delete` //delete 删除变更的资源
export const addPlanChgtaskpred = `api/plan/task/change/pred/add` //post 增加变更逻辑关系分配
export const updatePlanChgtaskpred = `api/plan/task/change/pred/update`//put 修改变更逻辑关系分配
export const getPlanChgtaskAssignTree = (defineId, taskId, type) => `api/plan/task/change/${defineId}/${taskId}/${type}/assign/tree` //get 根据计划定义id获取逻辑变更分配树
export const deletePlanChgtaskpred = (logicId) => `api/plan/task/change/pred/${logicId}/delete` //delete 删除变更逻辑关系分配
export const getPlanChgdelvAllList = (bizobj, bizId) => `api/plan/chgdelv/${bizobj}/${bizId}/list/all` //get 获取交付清单变更列表
export const addPlanChgdelv = `api/plan/chgdelv/add` //post 增加交付清单变更
export const updatePlanChgdelv = `api/plan/chgdelv/update` //put修改交付清单变更
export const deletePlanChgdelv = chgdelvId => `api/plan/chgdelv/${chgdelvId}/delete` //delete 删除交付清单变更
export const canclePlanTaskChangePred = logicChangeId => `api/plan/task/change/pred/${logicChangeId}/cancle` //撤销逻辑变更
export const taskChangeSaveAsApply = `api/plan/task/change/saveas/apply` //为变更数据增加并绑定变更单
export const getTaskChangeTreeByApplyId = applyId => `api/plan/task/change/${applyId}/tree` //为变更数据增加并绑定变更单
export const getApplyIdsByTaskId = (taskId, type) => `api/plan/task/change/${taskId}/${type}/applyId`//根据任务id获取所有的变更表单id
export const getTaskChangeEditAuth = (taskId = 0) => `api/plan/task/change/${taskId}/edit/auth` // 获取Task的编辑权限

//--> 沟通管理
export const meetingList = (projectId, pageSize, currentPageNum) => `api/comu/meeting/${projectId}/${pageSize}/${currentPageNum}/list` //get 沟通管理-会议管理列表
export const meetingWfList = (ids) => `api/comu/meeting//wf/ids/${ids}/list` //get 沟通管理-流程处理
export const meetingAdd = `api/comu/meeting/add` // post 沟通管理-新增会议
export const meetingRelease = 'api/comu/meeting/release' //put 沟通管理-发布审批
export const meetingDelete = `api/comu/meeting/delete`  // delete 沟通管理-删除会议信息
export const meetingInfo = id => `api/comu/meeting/${id}/info` // get 沟通管理-会议基本信息
export const meetingUpdate = `api/comu/meeting/update` //put 沟通管理-更新会议基本信息
export const meetingActionList = meetingId => `api/comu/meeting/action/${meetingId}/list` // get 沟通管理-会议行动项
export const meetingActionAdd = `api/comu/meeting/action/add`  // post 沟通管理-增加会议行动项
export const meetingActionUpdate = `api/comu/meeting/action/update`  // put 沟通管理-修改项目会议行动项
export const meetingActionDelete = `api/comu/meeting/action/delete` // delete 沟通管理-删除会议行动项
export const meetingActionFeeDback = taskId => `api/comu/meeting/action/${taskId}/feedback` //get 查看进展日志
export const getReleaseMeetingList = projectId => `api/comu/meeting/${projectId}/release/list`  //发布列表
export const getCancelMeetingList = projectId => `api/comu/meeting/${projectId}/cancel/release/list`  //取消发布列表
export const updateReleaseMeetingList = "api/comu/meeting/release"  //发布会议
export const updateCancelMeetingList = "api/comu/meeting/cancel/release"  //取消发布
export const meetingActionInfo = id => `api/comu/meeting/action/${id}/info` // get 沟通管理-会议基本信息

export const questionList = (projectId, pageSize, currentPageNum) => `api/comu/question/${projectId}/${pageSize}/${currentPageNum}/list`  //get 沟通管理-获取问题列表
export const questionlists = (taskId) => `api/comu/question/task/${taskId}/lists` // get 问题管理-
export const questionWfList = (ids) => `api/comu/question/wf/ids/${ids}/list` // get 流程处理（问题流程）
export const questionAdd = `api/comu/question/add`  // post 问题管理-增加项目问题
export const questionDelete = `api/comu/question/delete`  // delete 问题管理-删除
export const questionRelease = `api/comu/question/release` // put 问题管理-发布
export const questionCancelRelease = `api/comu/question/cancel/release` // put 问题管理-取消发布项目问题
export const questionSolve = `api/comu/question/solve` //put 问题管理 -解决
export const questionClose = `api/comu/question/close` // put 问题管理-关闭
export const questionInfo = id => `api/comu/question/${id}/info`  // get 沟通管理-基本信息
export const questionReleaseList = projectId => `api/comu/question/${projectId}/release/list`  // get 问题管理-发布列表

export const fileList = (id, type) => `api/doc/file/reations/${id}/${type}/list`//获取文件信息


export const questionCancelReleaselist = projectId => `api/comu/question/${projectId}/cancel/release/list`  // get 问题管理-取消发布列表
export const questionCloselist = projectId => `api/comu/question/${projectId}/close/list` //get 问题管理 - 关闭列表
export const questionSolvelist = projectId => `api/comu/question/${projectId}/solve/list` //get 问题管理-解决列表
export const questionUpdate = `api/comu/question/update` // put 问题管理-修改问题
export const questionHandleList = questionId => `api/comu/question/handle/${questionId}/list` // get 问题管理-处理记录
export const questionHandleAdd = `api/comu/question/handle/add` // post 问题管理-新增
export const questionHandleDelete = `api/comu/question/handle/delete`  // delete 问题管理-删除
export const questionHandleInfo = id => `api/comu/question/handle/${id}/info` // get 问题处理-基本信息
export const questionHandleUpdate = `api/comu/question/handle/update` // put 问题处理-修改

export const orgSelectTree = projectId => `api/sys/org/${projectId}/select/tree` //根据项目id获取组织

//流程
export const processList = (bizType) => `api/wf/process/${bizType}/list`
export const getProcessLogList = procInstId => `api/wf/log/${procInstId}/list` //查询日志
export const getMeetingWf = (procInstId, pageSize, currentPageNum) => `api/comu/meeting/wf/${procInstId}/${pageSize}/${currentPageNum}/list`
export const processStart = `api/wf/process/start` // 发起流程
export const getStartNextParticipant = (bizType, procDefKey) => `api/wf/process/start/next/${bizType}/${procDefKey}/candidate/tree` // 发起流程的后继参与者列表
export const getBizTypeByProcInstId = procInstId => `api/wf/biz/type/procinst/${procInstId}/info` // 根据流程实例ID获取流程类型信息
export const getProcessInstByProcInstId = procInstId => `api/wf/process/inst/${procInstId}/info` // 根据流程实例ID获取流程信息
export const processTaskClaim = `api/wf/process/task/claim` // 流程认领，并且返回权限按钮
export const getAgreeNextParticipant = taskId => `api/wf/process/next/${taskId}/candidate/tree` // 同意流程的后继参与者列表
export const processTaskComplete = `api/wf/process/task/complete` // 同意
export const getRejectActivity = taskId => `api/wf/process/activity/${taskId}/reject` // 驳回列表
export const processReject = `api/wf/process/task/reject` // 驳回
export const processTerminate = `api/wf/process/terminate` // 终止
export const getFormDataListByProcInstId = procInstId => `api/wf/form/data/${procInstId}/list` // 根据流程实例ID读取业务数据集合
export const getTaskIdByProcInstId = procInstId => `api/act/activiti/process/${procInstId}/taskId` //根據流程實例id和當前用戶id獲取當前用戶所處流程的節點id
export const getDelegateLsit="api/wf/delegate/list" //流程代理
export const addDelegate="api/wf/delegate/add" //添加流程代理
export const getDelegateInfo=id=>`api/wf/delegate/${id}/info` //流程代理详情
export const updateDelegate= "api/wf/delegate/update" //更新流程代理
export const deleteDelegate="api/wf/delegate/delete" //删除流程代理
export const getdelegateIdList=delegateId=> `api/wf/delegate/${delegateId}/list` //流程代理分配列表
export const updatedelegateProcLsit= "api/wf/delegate/proc/list"  //分配流程代理
export const getAssigneProcList=delegateId=> `api/wf/delegate/assigned/proc/${delegateId}/list` //已分配代理流程列表
export const deleteAssignedDelegate =ids=>`api/wf/delegate/${ids}/delete` //删除已分配代理流程
//
export const getMyQuestionList1 = (pageSize, currentPageNum) => `api/comu/question/my/${pageSize}/${currentPageNum}/list`   //我的问题
export const getMyQuestionList2 = (pageSize, currentPageNum) => `api/comu/question/my/${pageSize}/${currentPageNum}/user/list`   //我负责的问题
export const getMyQuestionList3 = (pageSize, currentPageNum) => `api/comu/question/my/${pageSize}/${currentPageNum}/creator/list`   //我创建的问题
export const getMyactionList = (pageSize, currentPageNum) => `api/comu/meeting/action/my/${pageSize}/${currentPageNum}/list`
export const getMyTask = (pageSize, currentPageNum) => `api/plan/task/${pageSize}/${currentPageNum}/home/mytask`//我的任务(首页)
export const getMywarningOverdueList = (pageSize, currentPageNum) => `api/plan/task/${pageSize}/${currentPageNum}/home/mywarning/overdue`//我的预警（超期未完成)
export const getMywarningBeginList = (pageSize, currentPageNum) => `api/plan/task/${pageSize}/${currentPageNum}/home/mywarning/begin`  //我的预警（即将开始）
export const getMywarningCompleteList = (pageSize, currentPageNum) => `api/plan/task/${pageSize}/${currentPageNum}/home/mywarning/complete`  //我的预警（即将完成)
export const getMyMessageList = (pageSize, currentPageNum) => `api/sys/message/home/${pageSize}/${currentPageNum}/list`  //我的预警（即将完成)
export const getMyUnfinishTaskList = (pageSize, currentPageNum) => `api/wf/unfinish/task/${pageSize}/${currentPageNum}/list`  //我的待办
export const getMyFinishTaskList = (pageSize, currentPageNum) => `api/wf/finish/task/${pageSize}/${currentPageNum}/list`  //我的已办
export const getMyMineTaskList = (pageSize, currentPageNum) => `api/wf/mine/task/${pageSize}/${currentPageNum}/list`  //我发起的
export const getUnfinishTask = "api/wf/unfinish/task/message"   //获取我的待办（首页）
export const getRsrcUserAssignTree = (planStartTime, planEndTime) => `api/rsrc/user/assign/${planStartTime}/${planEndTime}/tree` //人力资源分配树
export const getRsrcEquipAssignTree = (planStartTime, planEndTime) => `api/rsrc/equip/assign/${planStartTime}/${planEndTime}/tree`  //设备资源分配树
export const getRsrcMaterialAssignTree = (planStartTime,planEndTime) => `api/rsrc/material/assign/${planStartTime}/${planEndTime}/tree`  //材料资源分配树
export const getdetaillist= (rsrcId,rsrcType,planStartTime,planEndTime)=>`api/rsrc/analysis/${rsrcId}/${rsrcType}/${planStartTime}/${planEndTime}/list`  //资源占用的任务列表
export const getPbsSelectTree = projectId => `api/plan/pbs/${projectId}/select/tree`  //获取pbs下拉列表

export const getRsrcEquipTree = projectId => `api/rsrc/equip/tree`  //设备资源列表
export const addDocFileRelations = (bizId, bizType) => `api/doc/file/relations/${bizId}/${bizType}/add`  // 新增交付清单
export const updateDocFileRelations = (bizId, bizType) => `api/doc/file/relations/${bizId}/${bizType}/update` // 修改交付清单

export const getTaskRelationTree = taskId => `api/plan/task/${taskId}/relation/tree` // 获取计划关联列表页面
export const updateTaskRelationTree = `api/plan/task/relation/update` // 获取计划关联列表页面

export const getPlanDefineListByProjectId = projectId => `api/plan/define/${projectId}/list` // 打开计划–获取用户权限内的计划定义集合，包括（queryDefineTreeByUser参与任务的的计划定义集合）
//统计分析
export const dashboardEpsTree = '/api/plan/eps/dashboard/select/tree' //统计分析专用 项目群接口
export const projectOverview = '/api/dashboard/eps/count/list'    //项目总览
export const completionListPie = '/api/dashboard/proj/completion/list'  //项目完成率
export const progressList = '/api/dashboard/proj/progress/list' //项目进展
export const questionData = '/api/dashboard/question/list'       //项目问题
export const questionTableData = (currentPageNum, pageSize, type) => `/api/dashboard/question/${currentPageNum}/${pageSize}/${type}/detail/list`  //项目问题详情
export const milestoneList = '/api/dashboard/proj/milestone/list' // 项目里程碑
export const meetingAnalyse = '/api/dashboard/meeting/statistics/analyse'   //会议行动项
export const meetingTableList = (currentPageNum, pageSize) => `/api/dashboard/meeting/${currentPageNum}/${pageSize}/statistics/analyse/datail` //会议行动项 详情
export const plandrtnList = '/api/dashboard/proj/plandrtn/list' //工时
export const projProgressInfo = projectId => `/api/dashboard/proj/progress/${projectId}/info` //项目进展项目完成率
export const projYearCount = projectId => `/api/dashboard/proj/progress/${projectId}/count` //年度任务信息
export const projgressList = projectId => `/api/dashboard/proj/progress/${projectId}/list`    //计划清单
export const milestoneProjList = projectId => `/api/dashboard/proj/milestone/${projectId}/list`        //里程碑列表
export const milestoneCount = projectId => `/api/dashboard//proj/milestone/${projectId}/count`        //里程碑统计
export const summaryAll = "api/plan/project/summary/all" //汇总任务完成个数至项目
export const criticalList=projectId=>`api/plan/task/${projectId}/critical/list`     //关键路径
//挣值分析
export const getEarnedvalueTree = "api/dashboard/earnedvalue/tree"
export const getEcharsLine = projectId => `api/dashboard/${projectId}/earnedvalue/chart`       //挣值曲面图查看
//合同管理-合同变更
export const contractchangeList = '/api/cntc/' //合同列表查询
export const updatecontractList= changeId=>`/api/cntc/contract/change/${changeId}` //修改合同变更某一列
export const contractChangeAdd = '/api/cntc/contract/change/add' //合同新增
export const contractchangedown = (id,type) => `api/cntc/${id}/${type}/contract/list` //合同下拉框
export const contractChangedelete = '/api/cntc/contract/change/delete' //合同删除
export const contractChangeApproval = '/api/cntc/contract/change/approval' //合同审批
export const contractChangeCancelapproval = '/api/cntc/contract/change/cancelapproval' //合同取消审批
export const contractChangeInfo = '/api/cntc/contract/change/update' //合同基本信息
export const contractchangeSum = id => `api/cntc/contract/change/${id}/info` //合同变更汇总
export const contractchangeClist = id => `api/cntc/contract/changeitem/${id}/list` //合同变更清单
export const contractChangelistAdd = '/api/cntc/contract/changeitem/add' //合同清单新增
// export const contractchangeClistdelete = id => `api/cntc/contract/changeitem/${id}/delete` //合同变更清单删除
export const getContractAppvoralOrCancel=(projectId,type,status)=>`/api/cntc/${projectId}/${type}/contract/change/${status}/list`
export const getContractchangeItemInfo=id=>`/api/cntc/contract/changeitem/update/${id}/info` //合同变更清单详情
export const contractchangeItemUpdate = `/api/cntc/contract/changeitem/update`//合同变更清单修改
export const contractchangeClistdelete = `api/cntc/contract/changeitem/delete` //合同变更清单删除
export const contractItemImportlist = (id,changeId) => `/api/cntc/contract/${id}/${changeId}/item/list` //导入合同清单列表
export const contractchangeImportContractList = changeId =>`api/cntc/contract/changeitem/${changeId}/import`//导入合同清单项

//合同管理-合同
export const cashierUrl="/contract/pingan/payclient"
export const cashierSendUrl="http://211.159.140.200:8776" //收银台
// export const cashierSendUrl="http://47.92.71.117:8776" //收银台
export const contractProject = '/api/cntc/project/list'
export const contractList =(projectId,classify,pageSize,currentPage)=> `/api/cntc/${projectId}/${classify}/contract/list/${pageSize}/${currentPage}` //合同列表查询
export const allContractList =(classify,pageSize,currentPage)=> `/api/cntc/${classify}/contract/list/${pageSize}/${currentPage}` //合同列表查询
export const contractPayProportion = (cntcId,payMoney) => `/api/cntc/contract/${cntcId}/${payMoney}/PayProportion ` //计算支付比例
export const contractPayMoney = (cntcId,payProportion) => `/api/cntc/contract/${cntcId}/${payProportion}/payMoney ` //获取支付金额
export const contractPayOverPayMoney = (cntcId,payMoney) => `/api/cntc/contract/${cntcId}/${payMoney}/OverPayMoney ` //判断支付金额是否超出合同
export const contractPayLessThanPayItemMoney = (payItemId,payMoney) => `/api/cntc/contract/${payItemId}/${payMoney}/LessThanPayItemMoney ` //判断支付金额是否少于上次支付金额
export const contractAdd = '/api/cntc/contract/add' //合同新增
export const getDefaultOrg= "/api/cntc/contract/loginorg" //获取默认单位
export const contractDelete =(id) => `/api/cntc/contract/${id}/delete` //合同删除
export const contractUnit =(id) => `/api/sys/org/${id}/select/tree` //获取单位
export const contractUnitpp = (id) => `/api/sys/user/${id}/select/list`//获取单位人员
export const contractApproval = '/api/cntc/contract/approval' //合同审批
export const contractLaborApproval="/api/cntc/contract/labor/approval" //劳务合同审批
export const  getContractApprovalList=(classify)=>`/api/cntc/${classify}/contract/approval/list`//合同审批列表
export const contractCancelapproval = '/api/cntc/contract/cancelapproval' //取消审批
export const getContractCancelapprovalList=(classify)=>`/api/cntc/${classify}/contract/cancel/approval/list`//取消审批列表
export const contractOpen = '/api/cntc/contract/open' //打开合同
export const getContractOpenList=(classify)=>`/api/cntc/${classify}/contract/open/list `//打开合同列表
export const contractClose = '/api/cntc/contract/close' //关闭合同
export const getContractCloseList=(classify)=>`/api/cntc/${classify}/contract/close/list `//关闭合同列表
export const contractInfo = id => `/api/cntc/contract/${id}/info` //基本信息
export const contractRevise = '/api/cntc/contract/update' //修改合同
export const contractChangeitem = '/api/cntc/contract' //变更清单
export const getcontractChangeitemList=cntcId=>`api/cntc/${cntcId}/contract/change/approved/list`//获取变更清单页签
export const contractItemlist = (id) => `/api/cntc/contract/${id}/item/list` //合同清单项
export const contractItemAdd = '/api/cntc/contract/item/add' //合同清单-增加
export const getContractItemInfo=id=>`/api/cntc/contract/item/update/${id}/info` //合同清单详情
export const contractItemupdate="/api/cntc/contract/item/update" //合同清单修改
export const contractItemdelete = '/api/cntc/contract/item/delete' //合同清单-删除
export const getcontractincomeList=id=>`/api/cntc/contract/${id}/income/list`   //收入信息列表
export const addcontractincomeInfo= "/api/cntc/contract/income/add" //新增收入信息
export const updatecontractincomeInfo="/api/cntc/contract/income/update"//修改收入信息
export const getcontractincomeInfo= id=>`/api/cntc/contract/income/${id}/info`  //得到收入信息详情
export const deletecontractincomeInfo="api/cntc/contract/income/delete"   //删除收入信息
export const contractPaylist = id => `/api/cntc/contract/${id}/pay/list` //支付信息
export const contractPayadd = '/api/cntc/contract/pay/add' //支付-增加
export const contractPayupdate = '/api/cntc/contract/pay/update' //支付-修改
export const getContractPayInfo=id=>`/api/cntc/contract/pay/${id}/info` //支付详情
export const contractPaydelete = '/api/cntc/contract/pay/delete' //支付删除
export const getcontractpaymoney= payItemId=>`/api/cntc/contract/payInfo/${payItemId}` //获取支付金额
export const contractPayclient = '/api/cntc/contract/pingan/payclient/verify' //确认支付
export const contractOfflinePay = '/api/cntc/contract/pingan/payclient/offlinepay' //线下支付
export const contractPaytransaction = id => `/api/cntc/contract/pay/${id}/transaction/list` //支付交易记录
export const contractLaborlist =(cntcId,pageSize,currentPage)=> `/api/cntc/contract/${cntcId}/account/list/${pageSize}/${currentPage}` //获取工资支付列表
export const contractLaborlist2 =(cntcId,rollId,pageSize,currentPage)=> `/api/cntc/contract/${cntcId}/account/${rollId}/list/${pageSize}/${currentPage}` //获取工资支付列表
export const contractPayrollSelectList =(cntcId) => `/api/cntc/payroll/select/${cntcId}/list`//工资单下拉列表
export const getNewPayroll =(cntcId) => `/api/cntc/payroll/newest/${cntcId}/payroll`//工资单下拉列表
export const getPayrollList =(cntcId,pageSize,currentPage) => `/api/cntc/payroll/select/${cntcId}/list/${pageSize}/${currentPage}`//工资单列表带分页
export const getcontractworkerInfo =(id,pageSize,currentPage)=> `/api/cntc/contract/${id}/workerInfo/list/${pageSize}/${currentPage}` //获取劳务清单列表
export const contractLaborlistyz = '/api/cntc/contract/account/verify' //增加劳务人员验证
export const contractLaborOfflineyz = '/api/cntc/contract/account/offline/verify' //增加劳务人员-线下验证
export const contractBank = '/api/cntc/bank/webbank/list' //开户行
export const contractLaboradd = '/api/cntc/contract/account/add' //劳务增加
export const contractLaborOfflineadd = '/api/cntc/contract/account/offline/add' //劳务增加-线下
export const contractLaborchange = '/api/cntc/contract/account/update' //劳务修改
export const contractLaborexport = '/api/cntc/contract/account/export' //导出工人信息excel模板
export const contractLaborListexport = id => `/contract/${id}/account/export` //导出劳务清单
export const contractLaborpayexport = '/api/cntc/contract/account/payable/export' //导出工资信息excel模板
export const contractLaborsalaryexport = '/api/cntc/contract/account/salary/export' //导出实发工资excel模板（实际发放工资）
export const contractLaborsalaryimport = id =>  `/api/cntc/contract/${id}/account/salary/import` //导入实发工资excel模板（实际发放工资）
export const contractLaborimport = id => `/api/cntc/contract/${id}/account/import` //导入工人信息
export const contractLaborpayimport = id => `/api/cntc/contract/${id}/account/payable/import` //导入工资信息
export const contractLabordelete ="/api/cntc/contract/account/delete" //删除劳务
export const contractLabortransaction = id => `/api/cntc/contract/account/${id}/transaction/list` //劳务交易记录
export const contractLaborpayable = id => `/api/cntc/contract/${id}/account/payable/list` //获取支付工人列表（支付）(已验证的劳务人员)
export const contractLaborofflineList = id => `/api/cntc/contract/${id}/account/offline/list` //获取支付工人列表（线下支付）
export const contractLaborverify =(id,pageSize,currentPage)=> `/api/cntc/contract/${id}/account/verify/list/${pageSize}/${currentPage}` //获取支付工人列表(已验证的劳务人员)
export const contractLaborpaygz = '/api/cntc/contract/pingan/withdraw' //劳务支付工资
export const contractLaborpayOffline = '/api/cntc/contract/pingan/paywages/offline' //劳务支付工资-线下支付
export const contractBankname = '/api/cntc/bank/bankname' //银行名称
export const contractBankkind = '/api/cntc/bank/idtype/list' //证件类型
export const contractYanzxx  = id =>  `/api/cntc/contract/${id}/account/info`//单位账户验证-合同信息
export const contractBankprovince = '/api/cntc/bank/province/list'//支户行省
export const contractBankcity = id => `/api/cntc/bank/province/${id}/city/list`//支户行市
export const contractBanklist = '/api/cntc/bank/branch/list' //支户行
export const contractBankYanz = '/api/cntc/bank/account/company/verify' //单位验证
export const contractBankYanzSave = '/api/cntc/bank/account/company/verify/confirm' //单位验证保存
// export const contractLaboraddbc = id =>`/api/cntc/contract/${id}/account/payable/list` //劳务增加保存
// //项目地图
// export const projectMapUserInfo = 'api/cntc/map/user/info' //打开地图获取用户信息

// export const contractLaboraddbc = id =>`/api/cntc/contract/${id}/account/payable/list` //劳务增加保存
//项目地图
export const projectMapUserInfo = 'api/cntc/map/user/info' //打开地图获取用户信息
//会员对账
export const memberAccountInfo = 'api/cntc/zxy/member/account/info' //会员对账用户账户信息


export const getStationByProjectId = (projectId) => `api/szxm/plan/station/search/${projectId}/list` //获取站点主页面列表
export const addStation = `api/szxm/plan/station/add` //新增站点
export const deleteStation = `api/szxm/plan/station/delete`//删除站点
export const getSectionDetailsBySectionId = (id) => `api/szxm/plan/station/details/${id}/info`//获取站点单条数据基本信息
export const updateStation = `api/szxm/plan/station/update`//修改站点
export const saveView="api/sys/view/saveas" //另存(新增)为视图

//项目团队 监理标配置api
export const getJlSectionList = (sectionId,pageSize,currentPageNum) => `api/sys/projectteam/${sectionId}/getJlSectionList/${pageSize}/${currentPageNum}` //获取主列表
export const getXyJlSectionList = (sectionId) => `api/sys/projectteam/${sectionId}/getXyJlSectionList`  //获取分配列表
export const addJlSection = `api/sys/projectteam/addJlSection`  //新增
export const deleteJlSection = `api/sys/projectteam/deleteJlSection` //删除