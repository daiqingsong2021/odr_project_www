import ReactDOM from 'react-dom'
import * as dataUtil from '../../../utils/dataUtils'
import * as ganttUtil from '../../../utils/ganttUtil'
import "../../../asserts/styles.less"

/**
 @author haifeng
 @description 表格组件二次封装 (可拖拽)
 @param dnd {Boolean} table 是否使用拖拽功能 默认fasle
 @param bordered {Boolean} 是否展示外边框和列边框、默认false
 @param columns  {array} 表格列的配置描述
 @param dataSource {array} 数据数组
 @param pagination {Boolean} 分页器 不传则不显示
 @param onRow {Function(record, index)}  设置行属性
 @param useCheckBox (Boolean) 表格行是否可选择， 默认false
 @param scroll {{ x: number | true, y: number }} 设置横向或纵向滚动，也可用于指定滚动区域的宽和高，可以设置为像素值，百分比
 @param size (default | middle | small) 表格大小， 默认 small
 @param total {number}  分页时 总条数 如使用分页该字段必须传值
 @param onChangePage {function(当前页，每页条数)} 分页操作时，回调请求
 @param onChangeCheckBox {function (选中的ID集合，当前行)} 复选框操作回调
 @param checkboxStatus {string} 复选框禁用字段设置，根据行数据 字段 定义
 @param loading //table loading状态 默认不显示
 */
export default  class GanttTable extends React.Component {

  constructor(props) {

    super(props);

    this.tableKey = new Date().getTime()+"_";

    this.state = {
      tableKey : this.tableKey,
      headStatus: false,                                                        //显示隐藏列状态
      headColumnsStatus: false,
      headItem: this.props.columns,
      x: 0, y: 0, contentX: 0, contentY: 0,
      dnd: this.props.dnd ? true : false,                                       //是否使用拖拽功能 默认false
      bordered: this.props.bordered ? true : false,                             //是否展示外边框和列边框、默认false
      activeIndex: null,                                                        //table 选中行key标记，用于设置className
      record: null,                                                             //table 选中行数据
      columns: null,                  //table 表头
      dataSource: null,                                                         //table 数据
      dataInitSource: [],
      pagination: this.props.pagination ? true : false,                         //分页器 不传则不显示
      scroll: scroll ? scroll : false,                    //设置横向或纵向滚动，也可用于指定滚动区域的宽和高，可以设置为像素值，百分比
      size: this.props.size ? this.props.size : 'small',                        //表格大小， 默认 small
      total: this.props.total ? this.props.total : 0,                           //分页时 总条数 如使用分页该字段必须传值
      pageSize: this.props.pageSize ? this.props.pageSize : 20,                 //每页显示条数，默认20条
      current: this.props.current ? this.props.current : 1,                     //当前页，默认第1页
      moveInfo: null,                                                           //被移动数据
      indentSize: this.props.indentSize ? this.props.indentSize : 10,           //展示树形数据时，每层缩进的宽度，以 px 为单位,默认 10px
      selectedRowKeys: [],                                                      //复选框选中集合ID
      columnsKeys: [],
      expandedRowKeys: [],                                                       //展开行
      expanderLevel: this.props.expanderLevel ? this.props.expanderLevel : 0,        //展开层级，默认第2层
      contentMenu: [],
      headerMenu: this.props.headerMenu || [],
      editable : true
    };
  }



  componentDidMount() {

    if (this.props.onRef) {
      this.props.onRef(this);
    }
    this.initGantt();
    //监听全局点击事件
    document.addEventListener('click', this.close)

    let list = this.state.contentMenu
    if (this.props.contentMenu) {
      list = [...this.props.contentMenu]
    }

    if (this.props.initLoadData != false) {
      this.getData();
    }
  }

  initGantt = () =>{

    this.gantt = new CreateGantt();

    // 设置甘特图基本属性
    this.setGanttInfo();
    // 设置列
    this.setColumns(this.props);
    // 设置右键功能
    this.setGanttMenu();
    // 设置单元格格式化
    this.setDrawCell();
    // 设置双击行事件
    this.setDbClick();
    // 设置选中行事件
    this.setSelect();
    // 修复逻辑线对不上的问题
    // this.updateLineTop();
  }

  setGanttMenu = () =>{
    let thisTable = this;
    let GanttMenu = function () {
      GanttMenu.superclass.constructor.call(this);
    }
    let menuEditMap = {};
    mini.extend(GanttMenu, mini.Menu, {
      _create: function () {
        GanttMenu.superclass._create.call(this);

        let {contentMenu} = thisTable.props;
        let menuItems = [];

        if (thisTable.props.pagination || thisTable.props.istile) {
          menuItems.push({ text: '刷新', fun: 'refresh',name : 'refresh',  type: 'menuitem', iconCls: 'icon-shuaxin', isPublic: true })
        } else {
          //如果是树形
          menuItems.push(
            { text: '刷新', fun: 'refresh', name : 'refresh', type: 'menuitem', iconCls: 'icon-shuaxin', isPublic: true },
            { text: '展开全部', fun: 'openAll', name : 'openAll',  type: 'menuitem', iconCls: 'icon-zhankai1', isPublic: true }
          )
        }

        if(contentMenu){
          contentMenu.forEach((item,index)=>{
            let {type,name,fun,buttom,icon,isPublic,edit} = item;
            if(type === "separator"){
              menuItems.push('-');
            }else{
              menuItems.push({type : "menuitem",fun, name : fun, text : name ,iconCls : icon, edit : edit  });
            }
          })
        }
        this.setItems(menuItems);
        let menuobj = this;
        if(menuItems){
          menuItems.forEach((item,index)=>{
            if(typeof item != "string"){
              let {name,fun} = item;
              if(name){
                let m = mini.getbyName(name, menuobj);
                if(m){
                  m.on("click", menuobj.contentMenuClick, menuobj);
                }
              }
            }
          })
        }
      },
      /**
       @method table 右键事件
       @description  行右键操作时，根据是否是共有方法判断，非共有方法一律抛出
       @param data {object} 操作条
       */
      contentMenuClick : function (e){

        let data = e.sender;
        if (data.isPublic) {
          if (data.fun == 'refresh') {
            thisTable.getData();
          }
          if (data.fun == 'openAll') {
            let item = thisTable.gantt.getSelected();
            thisTable.expand(item,2);
          }
        } else {
          if(thisTable.props.rightClick){
            let item = thisTable.gantt.getSelected();
            thisTable.props.rightClick(data,item);
          }
        }
      }
    });

    let menu = new GanttMenu();
    menu.on("beforeopen", function (e) {
      let gantt = this.owner;
      let task = gantt.getSelected();
      if (e.htmlEvent.target.className.indexOf("headercell") !== -1) {
        e.cancel = true;
        return;
      }
      if (!task) {
        e.cancel = true;
        return;
      }
    });
    this.gantt.setContextMenu(menu);
  }

  expand = (reacd,level) =>{

      if(!reacd){
        if(level == "all"){
          this.gantt.expandAll();
        }else{
          let tops =this.gantt.getTaskTree();
          if(tops){
            tops.forEach((node)=>{
              this.expand__(node,level);
            },this);
          }
        }
      }else if(level == "all"){
        this.gantt.expand(reacd,true);
      }else if(!level || level === 1){
        this.gantt.expand(reacd);
      }else{
        this.expand__(reacd,level);
      }
  }

  expand__ = (record,level) =>{

    if(record && level > 0){
      this.gantt.expand(record);
      this.gantt.eachChild(record, function (o) {
        if (o["children"] != null) {
          this.expand__(o, level - 1);
        }
      }, this);
    }
  }


  setGanttInfo = () =>{
    
    this.gantt.setShowGanttView(false);
    this.gantt.setReadOnly(true);
    // 实例化gantt，将gantt赋值到state中，以便全局操作，获取gantt。
    this.gantt.setMultiSelect(this.props.useCheckBox || false);
    this.gantt.setRowHeight(38);
    this.gantt.setAllowResize(false); //是否允许拖拽调整甘特图大小
    this.gantt.autoSyncSummary = false;
    this.gantt.getCheckStatus = this.props.checkboxStatus;
    this.gantt.onChangeCheckBox = this.props.onChangeCheckBox;
    this.gantt.setRowStyle = this.props.setRowStyle;
    let {layout_} = this.props;
    this.setGanttRender(layout_,true);
  }

  setGanttRender = (layout_,init) =>{
    // 获取宽高
    let hw = this.getDefaultWidthHeight(layout_);
    this.setState({width:hw.width,height:hw.height},()=>{
      this.gantt.setStyle("width:100%; height:100%;");
      // this.gantt.tableView.setShowVScroll(false);// 设置隐藏右下角拖动滚动条，否者会导致左右滚动条托拉的头有段空白。
      if(init){
        this.gantt.render(document.getElementById(this.state.tableKey));
      }
    });
  }


  getDefaultWidthHeight = (layout_) => {
    //debugger;
    let hw = {};
    if(!layout_){
      //初始化css样式
      let h = document.documentElement.clientHeight || document.body.clientHeight;   //浏览器高度，用于设置组件高度
      h = h - 190;
      let w = (document.documentElement.clientWidth || document.body.clientWidth)-40;
      hw = {height: h, width : w};
    }else{
      let width = layout_.contentWidth;
      let height = layout_.contentHeight;
      hw = {width,height};
    }
    return hw;
  }

  setHeightWidth = () =>{

  }

  getGanttColumns = (columns) =>{
    let newColumns = new Array();
    this.renderMap = new Object();
    let thisObj = this;
    let index = 0;
    let treeColumn = "";
    columns.forEach((col) => {
      let {dataIndex,title,width,render,edit} = col;
      let column = {
        name: dataIndex,
        header: title+"<br/>String",
        field: dataIndex,
        width: width
      };

      if(index == 0){
        treeColumn = dataIndex;
      }

      thisObj.renderMap[dataIndex] = render;
      newColumns.push(column);
      index++;
    });

    this.gantt.setTreeColumn(treeColumn);
    return newColumns;
  }

  setCheckBoxColumn = (columns) =>{

    if(this.props.useCheckBox){
      let thisObj = this;
      columns.unshift({
        name : "checkbox_value",
        field : "checkbox_value",
        width:60,
        type: "checkcolumn",
        ...ganttUtil.multipleSelectionChanged
      });
    }
  }
  setLastColumn = (columns) =>{
    columns.push({
      field : "--last-columns--",
      width: 1000
    });
  }
  setColumns = (props) => {

    let columns = this.getGanttColumns(props.columns);
    this.setCheckBoxColumn(columns);
    this.setCellWidth(columns,props) || [];
    this.setLastColumn(columns);
    //将列集合数组设置给甘特图
    this.gantt.setColumns(columns);
  }

  setCellWidth = (columns, props = {}) => {
    //debugger;
    let { contentWidth, contentMinWidth } = props.layout_ || {};

    if (columns && contentMinWidth) {

      if(contentMinWidth <= contentWidth){
        // this.gantt.tableView.setShowVScroll(false);
        this.gantt.tableView.setShowHScroll(false);
      }else{
        this.gantt.tableView.setShowHScroll(true);
      }
      contentWidth = contentWidth || 0;
      // 长度综合
      let sumpx = 0;
      // 百分比综合
      let sumPercentage = 0;
      // 没有设置宽度的列的总个数
      let nullNum = 0, onPxNum = 0;
      //
      let valueMap = new Object();

      // 读取长数据
      let widthSum = contentWidth > contentMinWidth ? contentWidth : contentMinWidth;

      columns.forEach((col) => {
        const { width, field } = col;
        if (!width) {
          nullNum++;
          onPxNum++;
          valueMap[field] = { type: "null" };
        } else if (typeof width === "number" || width.indexOf("px") > 0) {
          // 宽度
          let nwidth = Number((width + "").replace("px", ""));
          sumpx += nwidth;
          valueMap[field] = { type: "px", value: nwidth };
        } else {
          let nwidth = Number(width.replace("%", ""));
          sumPercentage += nwidth;
          valueMap[field] = { type: "%", value: nwidth };
          onPxNum++;
        }
      });

      // 去掉PX数据
      widthSum -= sumpx;
      //widthSum -= useCheckBox ? 60 : 0;
      // widthSum -= !bordered ? 10 : 0;

      if (widthSum <= 100) {
        widthSum = 100;
      }
      let nullPercentage = 0;
      let weights = 1;
      if (sumPercentage > 0 && sumPercentage < 100) {
        if (nullNum > 0) {
          nullPercentage = (100 - sumPercentage) / nullNum;
          weights = 1;
        } else {
          weights = 100 / sumPercentage;
        }
      } else if (sumPercentage > 100) {
        if (nullNum > 0) {
          nullPercentage = 10;
          // 如果百分比超出了100，剩余没有宽度的数据，设置每个占比10%
          weights = 100 / (sumPercentage + (nullPercentage * nullNum));
        } else {
          weights = 100 / sumPercentage;
        }
      } else {
        if (nullNum > 0) {
          nullPercentage = 100 / nullNum;
          weights = 1;
        }
      }

      let sumWidth = 0;
      columns.forEach((col) => {
        const { field } = col;
        if (field) {

          let widthObj = valueMap[field];
          // 类型，值
          let { type, value } = widthObj || {};

          let newWidth = 0;
          if (type === "%" || type == "null") {
            if (type === "%") {
              newWidth = (widthSum * weights * value) / 100;
            } else if (type === "null") {
              newWidth = (widthSum * weights * nullPercentage) / 100;
            }
            col["width"] = newWidth;
          }else{
            // newWidth = col["width"];
          }
          sumWidth += newWidth;
        }
      });
    }
    return [ ...columns];
  }

  setDrawCell = () => {

    let thisObj = this;
    this.gantt.on("drawcell", function (e) {

      let {record, column, field} = e || {};
      let {name} = column || {};
      ganttUtil.setSelectRowCls(e);
      // 格式化方法
      let render = thisObj.renderMap[name];
      // 值
      let value = record[name];
      if (render) {
        // 调用格式化方法
        let ret = render(value,record);
        if(typeof ret === "string"){
          e.cellHtml = ret;
        }else if(typeof ret === "object"){
          let div = document.createElement("div");
          ReactDOM.render(ret,div,()=>{});
          e.cellHtml = div.innerHTML;
          $(div).remove();
        }
      }
    });
  }

  setSelect = () => {
    const thisObj = this;
    // 选中行设置选中行内容
    this.gantt.on('beforeselect', (e) => {

      const item = e.record;
      ganttUtil.setLastSelectedBeforeselect(e);

      thisObj.setState({
        activeIndex: item ? item.id : null,
        record: item,
      }, () => {
        if(thisObj.props.getRowData){
          thisObj.props.getRowData(item)
        }
      });
    })
  }

  setDbClick = () => {
    const thisObj = this;
    // 选中行设置选中行内容
    this.gantt.tableView.on('itemdblclick', (e) => {
      const item = e.record;
      if(thisObj.props.onDoubleClick){
        thisObj.props.onDoubleClick(item)
      }
    })
  }

  /**
   @method 获取table 点击行数据
   @description 获取点击行数据,回调事件到父组件
   @param record {object} 行数据
   @function getRowData {function} 点击行时，将 行数据回调给父组件
   */
  getLineInfo = (record) => {

  };

  /**
   * 获取表头内信息（仅内部使用）
   *
   * @param obj
   * @returns {*}
   */
  getDomHtml = (obj) => {

    let retValue = null;
    if (obj) {
      if(typeof obj == "string" && obj.trim()){
        return obj.trim();
      }else if(typeof obj == "object"){
        const { props } = obj;
        const { children } = props || {};

        if (typeof children == "string") {
          retValue = children;
        } else if (children instanceof Array) {
          for (let i = 0, len = children.length; i < len; i++) {
            let value = this.getDomHtml(children[i]);
            if (value) {
              retValue = value;
              break;
            }
          }
        }
      }
    }
    return retValue;
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.contentMenu != this.props.contentMenu) {
      let list = nextProps.contentMenu
      if (this.props.pagination) {
        list.push({ name: '刷新', fun: 'refresh', type: 'buttom', icon: 'icon-shuaxin', isPublic: true })
      } else {
        list.push(
          { name: '刷新', fun: 'refresh', type: 'buttom', icon: 'icon-shuaxin', isPublic: true },
          { name: '展开全部', fun: 'openAll', type: 'buttom', icon: 'icon-zhankai1', isPublic: true }
        )
      }
      this.setState({
        contentMenu: list
      })
    }

    /**
     * 宽度发生变化，需要重新计算宽/高
     */
    if (nextProps.layout_ != this.props.layout_) {
      //debugger;
      let {layout_} = nextProps;
      // 设置列
      this.setColumns(nextProps);
      this.setGanttRender(layout_);
    }

  }

  componentWillUnmount() {
    //销毁全局点击事件
    document.removeEventListener('click', this.close, false);
    this.gantt = null;
    
    let dom = document.getElementById(this.tableKey);
    if(dom){
      ReactDOM.unmountComponentAtNode(dom);
    }
  }

  handleDatas = (datas) =>{
    let thisObj = this;
    if(datas){
      datas.forEach((item)=>{
        item["UID"] = item["id"];
        thisObj.handleDatas(item["children"]);
      })
    }
  }

  /**
   * @method 获取table数据
   * @description table 挂起之后，获取父组件的数据，如有分页功能，传当前页、每页条数
   */
  getData = () => {
    
    let self = this
    this.gantt.loading();

    if (this.state.pagination) {
      this.props.getData(this.state.current, this.state.pageSize, function (res, total) {

        self.handleDatas(res);
        let dataInitSource = JSON.parse(JSON.stringify(res || []));
        self.setState({
          dataSource: res,
          dataInitSource,
          record: null,
          selectedRowKeys: [],
          activeIndex: ''
        }, () => {
          self.loading__([...res]);
        })
      })
    } else {
      this.props.getData(function (res) {
        
        self.handleDatas(res);
        let dataInitSource = JSON.parse(JSON.stringify(res || []));
        let array = dataUtil.getExpandKeys(res, self.state.expanderLevel)
        self.setState({
          dataSource: res,
          dataInitSource,
          loading: false,
          expandedRowKeys: array,
          selectedRowKeys: [],
          record: null,
          activeIndex: ''
        }, () => {
          self.loading__([...res]);
        })
      })
    }
  }
  loading__ = (data) =>{
    this.gantt.loadTasks(data);
    this.defaultExpand();
    this.gantt.unmask();
    this.gantt.doLayout();
    this.setDefaultSelected();
  }
  setDefaultSelected = () =>{
    let {setDefaultSelected} = this.props;
    let {dataSource} = this.state;
    if(setDefaultSelected){
      //debugger;
      let selecteds = new Array();
      dataUtil.Table(dataSource).forEach((item) => {
        if(setDefaultSelected(item)){
          selecteds.push(item);
        }
      });
      this.gantt.tasks.selects(selecteds,true);
    }
  }

  defaultExpand = () =>{
    if(!this.state.expanderLevel || (this.state.expanderLevel != "all" && this.state.expanderLevel != "ALL")){
      this.gantt.collapseAll();
      this.expand(null,this.state.expanderLevel || 0);
    }
  }

  /**
   * 获取表格的数据
   *
   * @returns {null}
   */
  findDataList = () => {
    return this.state.dataSource;
  }

  /**
   @method 设置需要移动数据的值
   @description 获取被移动的数据的值，用于处理数据位置作用
   @param moveInfo {object} 需要移动数据
   */
  getMoveData = (moveInfo) => {
    this.setState({
      moveInfo
    })
  };

  //关闭
  close = () => {
    this.setState({
      headStatus: false,
      contextMenuType: false
    })
  }

  /**
   @method 获取table 点击行数据
   @description 获取点击行数据,回调事件到父组件
   @param record {object} 行数据
   @function getRowData {function} 点击行时，将 行数据回调给父组件
   */
  getLineInfo = (record) => {
    this.setState({
      activeIndex: record ? record.id : null,
      record: record,
    }, () => {
      this.props.getRowData(record)
    });
  };

  /**
   @method 新增数据
   @description  操作表格数据，新增
   @param record {object} 行数据
   @param newRecord {object} 新增数据
   @param level {string} 级别（同级、下级） 默认操作下级新增数据 。传入 same 为同级新增操作
   */
  add = (record, newRecord, level = '', type = "last") => {
    
    const { dataSource, dataInitSource } = this.state;
    let isNull = !dataSource || dataSource.length == 0;
    // 复制新增数据
    let newInitRecord = dataUtil.clone(newRecord || {});
    //
    let dataTable = dataUtil.Table(dataSource);
    let initDataTable = dataUtil.Table(dataInitSource);
    if(newRecord){
      newRecord["UID"] = newRecord["id"];
    }
    if (level == 'same') {
      //dataTable.newItem(newRecord, dataTable.getParentItem(record), type);
      initDataTable.newItem(newInitRecord, initDataTable.getParentItem(record), type);
      record = dataTable.getParentItem(record);
      if(type == "last"){
        this.gantt.addTask(newRecord, "add", record);
      }else if(type == "first"){
        let children;
        if(record){
          children = record["children"];
        }else{
          children = this.findDataList();
        }
        if(children && children.length > 0){
          let firstChildren = children[0];
          this.gantt.addTask(newRecord, "before", firstChildren);
        }else{
          this.gantt.addTask(newRecord, "add", record);
        }
      }

    } else {
      //dataTable.newItem(newRecord, record, type);
      initDataTable.newItem(newInitRecord, record, type);
      if(type == "last"){
        this.gantt.addTask(newRecord, "add", record);
      }else if(type == "first"){
        let children;
        if(record){
          children = record["children"];
        }else{
          children = this.findDataList();
        }
        if(children && children.length > 0){
          let firstChildren = children[0];
          this.gantt.addTask(newRecord, "before", firstChildren);
        }else{
          this.gantt.addTask(newRecord, "add", record);
        }
      }
    }
    this.setState({
      dataSource: dataSource,
      dataInitSource
    }, () => {

    })
  }

  /**
   * 增加节点在最后位置
   *
   * @param newRecord
   */
  addData = (newRecord, type) => {
    this.add(null, newRecord, "same", type);
  }

  /**
   * 增加子节点
   *
   * @param record 选中节点
   * @param newRecord 新增节点
   */
  addChildren = (newRecord, parentRecord, type) => {
    this.add(parentRecord, newRecord, "", type);
  }

  /**
   @method 更新数据
   @description  操作表格数据，更新数据
   @param record {object} 行数据
   @param newRecord {object} 新数据
   */
  update = (record, newRecord) => {

    const { dataSource, dataInitSource } = this.state;
    this.gantt.updateTask(record, newRecord);
    dataUtil.Table(dataInitSource).updateItem(newRecord);
    this.setState({
      dataSource: dataSource,
      dataInitSource
    })
  }

  /**
   * 修改数据
   *
   * @param newRecord
   */
  updateData = (newRecord = {}) => {
    this.update(null, newRecord);
  }

  /**
   * 根据ID获取行对象
   *
   * @param id
   */
  getDataById = (id) => {
    return dataUtil.getItemByTree(this.state.dataSource, (item) => {
      return id === item.id;
    })
  }

  /**
   @method 删除数据
   @description  操作表格数据，删除数据
   @param record {object} 行数据
   */
  deleted = (record) => {
    
    const { dataSource, dataInitSource } = this.state
    let { id } = record;
    // dataUtil.Table(dataSource).deleteItemByIds([id]);
    this.gantt.removeTask(record);
    dataUtil.Table(dataInitSource).deleteItemByIds([id]);
    this.setState({
      dataSource: dataSource,
      dataInitSource,
      selectedRowKeys: null,
      selectedRows: null,
      activeIndex: '',
      record: null,
    })
  }

  /**
   * 页面搜索
   *
   * @param callback 回调函数
   * @param conditions 查询条件
   * @param children
   */
  search = (conditions, children = true,callback) => {
    /*
    const { dataInitSource } = this.state;
    let searchData = dataUtil.search(dataInitSource, conditions, children);
    this.setState({
      dataSource: searchData
    }, () => {
      if(callback){
        callback(searchData);
      }
    });
    */
    if(typeof conditions === "function"){
      this.gantt.filter(conditions,this.gantt,children);
    }else{
      this.gantt.filter((item,index) => {
        return dataUtil.searchVerification(conditions,item);
      },this.gantt,children);
    }
  }

  /**
   @method 设置table行样式
   @description 设置table行样式，根据ID处理是否是添加className
   @param record {object} 行数据
   */
  setClassName = (record) => {
    if(this.state.editable){
      return record.id == this.state.activeIndex ? 'tableActivty editable-row' : 'editable-row';
    }else{
      return record.id == this.state.activeIndex ? 'tableActivty' : '';
    }
  };

  /**
   @method 重新初始化分页的当前页位置
   @description  考虑到数据会重新赋值，例如 搜索 分页需回到1的位置
   @param record {object} 行数据
   */
  recoveryPage = (current) => {
    this.setState({
      current: current ? current : 1,
      selectedRowKeys: null,
      selectedRows: null,
      activeIndex: '',
      record: null,
    })
  }


  /**
   @method 获取指定页数据
   @description  考虑到数据会重新赋值，例如 搜索的情况下 分页需回到1的位置，新增后的情况下，删除整页的情况下
   @param record {object} 行数据
   */
  getAppointPageData = (current, pagesize) => {
    let self = this
    this.props.getData(current, pagesize, function (res) {
      self.setState({
        dataSource: res,
        current,
        pageSize: pagesize
      })
    })
  }

  getSelecteds = () =>{
    return this.gantt.tasks.getSelecteds();
  }

  render() {
    let width = this.state.width+"px";
    let height = this.state.height+"px";
    return (
      <div id={this.state.tableKey } style={{ width: width, height: height }}></div>
    );
  }
}
