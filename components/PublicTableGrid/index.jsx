
import AntTable from "./AntTable"
import GanttTable from "./GanttTable"
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
export default class PublicTableGrid extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
    };
  }
  componentDidMount() {
    if (this.props.onRef) {
      this.props.onRef(this);
    }
  }
  /**
   * @method 获取table数据
   * @description table 挂起之后，获取父组件的数据，如有分页功能，传当前页、每页条数
   */
  getData = () => {
    this.table.getData();
  }

  /**
   * 获取表格的数据
   *
   * @returns {null}
   */
  findDataList = () => {
    return this.table.findDataList();
  }

  /**
   @method 获取table 点击行数据
   @description 获取点击行数据,回调事件到父组件
   @param record {object} 行数据
   @function getRowData {function} 点击行时，将 行数据回调给父组件
   */
  getLineInfo = (record) => {
    this.table.getLineInfo(record);
  };

  /**
   @method 获取table 点击行数据
   @description 获取点击行数据,回调事件到父组件
   @param record {object} 行数据
   @function getRowData {function} 点击行时，将 行数据回调给父组件
   */
  onDoubleClick = (record) => {
    this.table.onDoubleClick(record);
  };

  /**
   @method 新增数据
   @description  操作表格数据，新增
   @param record {object} 行数据
   @param newRecord {object} 新增数据
   @param level {string} 级别（同级、下级） 默认操作下级新增数据 。传入 same 为同级新增操作 
   */
  add = (record, newRecord, level = '', type = "last") => {
    this.table.add(record, newRecord,level,type);
  }

  /**
   * 增加节点在最后位置
   *
   * @param newRecord
   */
  addData = (newRecord, type) => {
    this.table.addData(newRecord, type);
  }

  /**
   * 增加子节点
   *
   * @param record 选中节点
   * @param newRecord 新增节点
   */
  addChildren = (newRecord, parentRecord, type) => {
    this.table.addChildren(newRecord, parentRecord, type);
  }

  /**
   @method 更新数据
   @description  操作表格数据，更新数据
   @param record {object} 行数据
   @param newRecord {object} 新数据
   */
  update = (record, newRecord) => {
    this.table.update(record, newRecord);
  }

  /**
   * 修改数据
   *
   * @param newRecord
   */
  updateData = (newRecord = {}) => {
    this.table.updateData(newRecord);
  }

  /**
   * 根据ID获取行对象
   *
   * @param id
   */
  getDataById = (id) => {
    this.table.getDataById(id);
  }

  /**
   @method 删除数据
   @description  操作表格数据，删除数据
   @param record {object} 行数据
   */
  deleted = (record) => {
    this.table.deleted(record);
  }

  /**
   * 页面搜索
   *
   * @param callback 回调函数
   * @param conditions 查询条件
   * @param children
   */
  search = (conditions, children = true,callback) => {
    this.table.search(conditions,children,callback);
  }

  /**
   @method 重新初始化分页的当前页位置
   @description  考虑到数据会重新赋值，例如 搜索 分页需回到1的位置
   @param record {object} 行数据
   */
  recoveryPage = (current) => {
    this.table.recoveryPage(current);
  }

  /**
   @method 获取指定页数据
   @description  考虑到数据会重新赋值，例如 搜索的情况下 分页需回到1的位置，新增后的情况下，删除整页的情况下
   @param record {object} 行数据
   */
  getAppointPageData = (current, pagesize) => {
    this.table.getAppointPageData(current, pagesize);
  }

  getSelecteds = () =>{
    return this.table.getSelecteds();
  }

  /**
   * 获取勾选数据的ID集合
   *
   * @returns {any[]}
   */
  getSelectedIds = () =>{
    let selecteds = this.table.getSelecteds();
    let selectedIds = new Array();
    if(selecteds){
      selecteds.forEach((item)=>{
        selectedIds.push(item["id"]);
      })
    }
    return selectedIds;
  }

  render() {

    let {tableType} = this.props;

    return (
      <>
        {
          tableType == "gantt" && (
            <GanttTable {...this.props} onRef = {table => this.table = table}>
            </GanttTable>
          )
        }
        {
          !tableType && (
            <AntTable {...this.props} onRef = {table => this.table = table}>
            </AntTable>
          )
        }

      </>
    );
  }
}
