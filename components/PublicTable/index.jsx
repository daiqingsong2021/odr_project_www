import { Table, Icon, Menu, Select, Form, Input, InputNumber, DatePicker,Slider } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ReactDOM from 'react-dom'
import * as util from '../../utils/util';
import SortDnd from '../SortDnd/index'
import moment from 'moment'
import * as dataUtil from '../../utils/dataUtil';
import MyIcon from "../public/TopTags/MyIcon"
const { Option } = Select;
let dragingIndex = -1;
import styles from './style.less'

class BodyRow extends React.Component {
  render() {
    const {
      isOver,
      connectDragSource,
      connectDropTarget,
      moveRow,
      ...restProps
    } = this.props;
    const style = { ...restProps.style, cursor: 'move' };
    let className = restProps.className;
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += ' drop-over-downward';
      }
      if (restProps.index < dragingIndex) {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(
        <tr
          {...restProps}
          className={className}
          style={style}
        />
      )
    );
  }
}

const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index,
    };
  },
};
const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    const nextKey = props['data-row-key']
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }
    props.moveRow(dragIndex, hoverIndex, nextKey);

    monitor.getItem().index = hoverIndex;
  },
};
const DragableBodyRow = DropTarget(
  'row',
  rowTarget,
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  }),
)(
  DragSource(
    'row',
    rowSource,
    (connect) => ({
      connectDragSource: connect.dragSource(),
    }),
  )(BodyRow),
);


const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = (item, form) => {
    this.form = form;
    let { children, dataIndex, record, title, formType, min, max, length, required, items, verItemEditable } = this.props;
    const { editing } = this.state;
    items = items || [];

    if(verItemEditable && verItemEditable(item)){
      return (
        <div
          style={{ paddingRight: 24 }}
        >
          {children}
        </div>
      );
    }
    else if (!editing) {
      return (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingRight: 24 }}
          onClick={this.toggleEdit}
        >
          {children}
        </div>
      );
    } else {
      if (formType == 'Input') {
        return (
          <Form.Item style={{ margin: 0 }}>
            {
              form.getFieldDecorator(dataIndex, {
                rules: [
                  {
                    required: required || false,
                    message: `${title} is required.`,
                  },
                ],
                initialValue: record[dataIndex],
              })
                (
                  <Input maxLength={length} ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />
                )
            }
          </Form.Item>
        )
      } else if (formType == 'InputNumber') {

        return (
          <Form.Item style={{ margin: 0 }}>
            {
              form.getFieldDecorator(dataIndex, {
                rules: [
                  {
                    required: required || false,
                    message: `${title} .`,
                  },
                ],
                initialValue: record[dataIndex],
              })
                (
                  <InputNumber style={{ width: "100%" }} min={min} max={max} ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />
                )
            }
          </Form.Item>
        )

      } else if (formType == 'Select') {

        return (
          <Form.Item style={{ margin: 0 }}>
            {
              form.getFieldDecorator(dataIndex, {
                rules: [
                  {
                    required: required || false,
                    message: `${title} .`,
                  }],
                initialValue: record[dataIndex],
              })
                (
                  <Select ref={node => (this.input = node)} style={{ width: "100%" }} size="small" onPressEnter={this.save} onBlur={this.save}>
                    {
                      items.map(item => {
                        return (
                          <Option value={item.value}>{item.title}</Option>
                        )
                      })
                    }
                  </Select>
                )
            }
          </Form.Item>
        )

      } else if (formType == 'date') {
        let value = record[dataIndex];
        if(typeof value === "string"){
          value = dataUtil.Dates().formatTimeMonent(value);
        }
        return (
          <Form.Item style={{ margin: 0 }}>{
            form.getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: required || false,
                  message: `${title} .`,
                }],
              initialValue: value,
            })
              (
                <DatePicker ref={node => (this.input = node)} style={{ width: '100%' }} format={this.props.format} disabledDate={this.props.disabledDate.bind(this,record,dataIndex)}
                  showTime={{ format: 'HH:mm', defaultValue: moment('00:00:00', 'HH:mm:ss') }}  onOk={this.save}
                  onOpenChange={(status)=>{
                    if(!status){
                      this.save()
                    }
                  }}
                />
              )
          }
          </Form.Item>
        )
      }else if(formType == 'Slider'){
         return (
          <Form.Item style={{ margin: 0 }}>{
            form.getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: required || false,
                  message: `${title} .`,
                }],
              initialValue: record[dataIndex],
            })
              (
                <Slider ref={node => (this.input = node)}
                min={0}
                max={100}
                onChange={this.props.onChange}
                value={typeof this.props.inputValue === 'number' ? this.props.inputValue : 0}
                marks={(this.props.data.type == "task" && (this.props.data.taskType != 1 && this.props.data.taskType != 4)) ? { 0: "", 100: '' } : { 0: "", 100: '' }}
                step={(this.props.data.type == "task" && (this.props.data.taskType != 1 && this.props.data.taskType != 4)) ? null : 1}
              />
              )
          }
          </Form.Item>
         )
      }
    }
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell.bind(this, record)}</EditableContext.Consumer>
        ) : (
            children
          )}
      </td>
    );
  }
}

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

class DragSortingTable extends React.Component {
  components = {
    body: {
      row: DragableBodyRow,
    },
  }

  constructor(props) {

    super(props);
    const scroll = this.initScroll(props);
    this.state = {
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
      editable: true
    };
  }




  /**
   * 设置滚动条
   *
   * @param scroll
   */
  initScroll = (props) => {
    let ret = {};
    if (props) {
      let { scroll, layout_ } = props;
      ret = { ...scroll };
      let width, height;
      if (layout_) {
        width = layout_.contentWidth;
        height = layout_.contentHeight;
      }

      if (width && width > 0) {
        ret["x"] = width - 20;
      }
      if (height && height > 0) {
        ret["y"] = height - 40;
      }
    }
    return ret;
  }

  componentDidMount() {
    //监听全局点击事件
    document.addEventListener('click', this.close)
    if (this.props.onRef) {
      this.props.onRef(this);
    }
    let list = this.state.contentMenu
    if (this.props.contentMenu) {
      list = [...this.props.contentMenu]
    }
    if (this.props.pagination) {
      list.push({ name: '刷新', fun: 'refresh', type: 'buttom', icon: 'icon-shuaxin', isPublic: true })
    } else {
      //如果是平埔
      if (this.props.istile) {
        list.push({ name: '刷新', fun: 'refresh', type: 'buttom', icon: 'icon-shuaxin', isPublic: true })
      } else {
        //如果是树形
        list.push(
          { name: '刷新', fun: 'refresh', type: 'buttom', icon: 'icon-shuaxin', isPublic: true },
          { name: '展开全部', fun: 'openAll', type: 'buttom', icon: 'icon-zhankai1', isPublic: true }
        )
      }
    }

    if (this.props.initLoadData != false) {
      this.getData();
    }

    let headItem = []
    if (this.state.headItem) {
      headItem = this.state.headItem
      for (let i = 0; i < headItem.length; i++) {
        headItem[i].ischecked = true
      }
    }

    let columns = this.extColumns(this.props.columns, this.props);
    // let columns = this.props.columns;
    if (!this.props.bordered) {
      columns.push({
        title: '',
        key: 'lastIndex',
      })
    }

    this.setState({
      headItem: headItem,
      contentMenu: list,
      columns: columns
    })
    // 重新计算表格高度等属性
    this.initDomNode(this.props, true);
  }

  /**
   * 扩展表头，（1、设置表头title属性，2、待扩展）
   *
   * @param columns 原始表头数据
   * @returns {*}
   */
  extColumns = (columns, props) => {

    this.setCellWindth(columns, props);
    this.setCellTitle(columns);
    return columns;
  }

  setCellWindth = (columns, props = {}) => {

    let { useCheckBox, bordered } = props;
    let { contentWidth, contentMinWidth } = props.layout_ || {};

    if (columns && contentMinWidth) {

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
        const { width, key } = col;
        if (!width) {
          nullNum++;
          onPxNum++;
          valueMap[key] = { type: "null" };
        } else if (typeof width === "number" || width.indexOf("px") > 0) {
          // 宽度
          let nwidth = Number((width + "").replace("px", ""));
          sumpx += nwidth;
          valueMap[key] = { type: "px", value: nwidth };
        } else {
          let nwidth = Number(width.replace("%", ""));
          sumPercentage += nwidth;
          valueMap[key] = { type: "%", value: nwidth };
          onPxNum++;
        }
      });

      // 去掉PX数据
      widthSum -= sumpx;
      widthSum -= useCheckBox ? 60 : 0;
      widthSum -= !bordered ? 10 : 0;

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

      columns.forEach((col) => {
        const { key } = col;
        if (key) {

          let widthObj = valueMap[key];
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
          }
        }
      });
    }
  }

  /**
   * 设置每个单元格（<td>）上出现title
   *
   * @param col
   **/
  setCellTitle = (columns) => {

    if (columns) {
      columns.forEach((col) => {
        // 设置单元格 title
        let { dataIndex, onCell, render, edit, title } = col;

        let newOnCell;
        if (edit && edit.editable) {
          col.onCell = record => ({
            ...edit,
            record,
            dataIndex: dataIndex,
            title: title
          })

        }
        else if (onCell) {
          newOnCell = (record, index) => {

            let cell = onCell(record, index);
            if (cell && cell["title"] != undefined) {
              return cell;
            }
            let title = record[dataIndex];
            if (render) {
              title = render(record[dataIndex], record);
              if (typeof title == "object") {
                title = this.getInnerText(title);
              }
            } else {
              title = record[dataIndex];
              if (typeof title == "object") {
                title = title.name;
              }
            }
            return { ...(cell || {}), title };
          };
          col.onCell = newOnCell;
        } else {
          col.onCell = (record, index) => {

            let title;
            if (render) {
              title = render(record[dataIndex], record);
              if (typeof title == "object") {
                title = this.getInnerText(title);
              }
            } else {
              title = record[dataIndex];
              if (typeof title == "object") {
                title = title.name;
              }
            }
            return { title };
          };
        }
      });
    }
  }


  setCellTitle111 = (columns) => {
    if (columns) {
      columns.forEach((col) => {
        // 设置单元格 title
        let { key, render } = col;
        if (render) {
          col.render = (text, record) => {
            let dat = render(text, record);
            let d = this.getInnerText(dat);
            if (typeof dat === "object") {
              dat = this.getInnerText(dat);
            }
            return dat;
          };
        }
      });
    }
  }

  /**
   * 获取表头内信息（仅内部使用）
   *
   * @param obj
   * @returns {*}
   */
  getInnerText = (obj) => {

    let retValue = null;
    if (obj) {
      if (typeof obj == "string" && obj.trim()) {
        return obj.trim();
      } else if (typeof obj == "object") {
        const { props } = obj;
        const { children } = props || {};

        if (typeof children == "string") {
          retValue = children;
        } else if (children instanceof Array) {
          for (let i = 0, len = children.length; i < len; i++) {
            let value = this.getInnerText(children[i]);
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

      let newColumns = this.state.columns ? this.state.columns : nextProps.columns;
      //
      if (!this.props.mainContent) {
        // this.setCellWindth(newColumns, nextProps);
        this.extColumns(newColumns, nextProps);
        this.setState({ columns: newColumns }, () => {
          this.initDomNode(nextProps);
        });
      } else {
        this.setCellTitle(newColumns);
        this.setState({ columns: newColumns }, () => {
          this.initDomNode(nextProps);
        });
      }
    }
  }

  componentWillUnmount() {
    //销毁全局点击事件
    document.removeEventListener('click', this.close, false);

    if (this.observer) {
      this.observer.disconnect();
    }
  }

  mutationObserver = (target, config, callback) => {
    // Firefox和Chrome早期版本中带有前缀
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    // 创建观察者对象
    let observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        callback(mutation);
      });
    });

    // 传入目标节点和观察选项
    observer.observe(target, config);
    return observer;
  }

  ____headerScroll = (target, heardDom) => {
    if (target.scrollHeight > target.clientHeight || target.offsetHeight > target.clientHeight) {
      if (heardDom && heardDom.style) {
        heardDom.style.overflowY = "scroll";
      }
    } else {
      if (heardDom && heardDom.style) {
        heardDom.style.overflowY = "auto";
      }
    }
  }
  /**
   * 处理DOM
   */
  ___handleDom = (findDom, heardDom, type) => {
    if (!this.observer) {
      let config = {};
      if (type === "layout") {
        config = { attributes: true, attributeOldValue: true, subtree: false }
      } else {
        config = { attributes: true, attributeOldValue: true, subtree: true, childList: true }
      }
      this.observer = this.mutationObserver(findDom, config, (mutation) => {
        let { target, attributeName, oldValue, addedNodes, type } = mutation;
        if (attributeName == "style" && oldValue && oldValue.indexOf("height")) {
          this.____headerScroll(target, heardDom, findDom);
        } else if (type == "childList" && addedNodes && addedNodes.length > 0) {

          this.____headerScroll(findDom, heardDom);
        }
      });
    }
  }

  /**
   * 通过dom对象修改表格宽度高度等属性
   *
   * @param props
   */
  initDomNode = (props, isInit) => {

    const dom = ReactDOM.findDOMNode(this);
    let findDom = this._findChildrenByClassName([dom], "ant-table-body");
    let heardDom = this._findChildrenByClassName([dom], "ant-table-header");
    let placeholder = this._findChildrenByClassName([dom], "ant-table-placeholder");

    if (findDom) {

      let { layout_ } = props;
      if (layout_) {
        // 通过监听方式处理Dom对象
        this.___handleDom(findDom, heardDom, "leyout");
        let trueLayout = {};
        let { contentHeight, contentWidth, contentMinWidth } = layout_;
        if (contentHeight && contentHeight > 0) {

          // if (this.props.pagination) {
          //   contentHeight -= 85;
          // }
          if(localStorage.getItem('menutype') == 1){
            if(this.props.isReport){
              contentHeight -= 45;
            }else{
              contentHeight -= 0;
            }
          }else{
            if(this.props.isReport){
              contentHeight -= 45;
            }
          }
          // console.log(findDom)
          findDom.style.height = contentHeight + "px";
          trueLayout["contentHeight"] = contentHeight;
          trueLayout["nullIconHeight"] = contentHeight - 40;
        }
        if (contentWidth && contentWidth > 0) {
          findDom.style.width = contentWidth + "px";
          if (heardDom) {
            heardDom.style.width = contentWidth + "px";
            trueLayout["contentWidth"] = contentWidth;
          }

        }

        if (placeholder && trueLayout["nullIconHeight"] && (!this.state.dataSource || this.state.dataSource.length == 0)) {
          findDom.style.height = "0px";
          placeholder.style.height = trueLayout["nullIconHeight"] + "px";
        }
        this.setState({ trueLayout });

        if (contentMinWidth && contentMinWidth > 0) {
          findDom.style.minWidth = contentWidth + "px";
          if (heardDom) {
            heardDom.style.minWidth = contentWidth + "px";
          }
        }
      } else {
        this.___handleDom(findDom, heardDom);
      }

    }
  }

  /**
   * 查询子节点
   *
   * @param parents
   * @param className
   * @returns {*}
   * @private
   */
  _findChildrenByClassName = (parents, className) => {
    if (parents && parents.length > 0) {

      for (let i = 0, len = parents.length; i < len; i++) {

        let dom = parents[i];
        if (dom) {
          if (dom.className && dom.className.toString().split(" ").indexOf(className) > -1) {
            return dom;
          }
          let findDom = this._findChildrenByClassName(dom.childNodes, className);
          if (findDom) {
            return findDom;
          }
        }
      }
    }
    return null;
  }

  /**
   * @method 获取table数据
   * @description table 挂起之后，获取父组件的数据，如有分页功能，传当前页、每页条数
   */
  getData = () => {
    let self = this
    this.setState({
      loading: true
    })

    if (this.state.pagination) {
      this.props.getData(this.state.current, this.state.pageSize, function (res, total) {

        let dataInitSource = JSON.parse(JSON.stringify(res || []));
        self.setState({
          dataSource: res,
          dataInitSource,
          loading: false,
          record: null,
          selectedRowKeys: [],
          activeIndex: '',
          total: total || self.state.total
        }, () => {
          self.resetNullIcon(res);
        })
      })
    } else {
      this.props.getData(function (res) {
        let dataInitSource = JSON.parse(JSON.stringify(res || []));
        let array = dataUtil.getExpandKeys(res, self.state.expanderLevel)
        self.setState({
          dataSource: res,
          dataInitSource,
          loading: false,
          //expandedRowKeys:array,
          expandedRowKeys: (self.props.menuCode && self.props.menuCode == 'SM-ORG') ? self.state.expanderLevel:array,
          selectedRowKeys: [],
          record: null,
          activeIndex: ''
        }, () => {
          self.resetNullIcon(res);
        })
      })
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
   @method 移动事件
   @description 捕获鼠标拖拽松开时处理数据,请求父组件接口是否可以移动，回调为 true 时移动数据
   @param dragIndex {number} 开始下标
   @param hoverIndex {number} 终点位置下标
   @param nextKey  {number} 终点key 用于查询终点数据

   */
  moveRow = (dragIndex, hoverIndex, nextKey) => {
    const { moveInfo } = this.state;
    const { dataSource, dataInitSource } = this.state
    //请求父组件 是否可以移动数据  true 移动 否则
    this.setState({
      loading: true
    })
    var self = this
    this.props.move(moveInfo, nextKey, function (res) {
      self.setState({
        loading: false
      })
      if (res == true) {
        util.move(dataSource, moveInfo, nextKey, hoverIndex);
        // util.move(dataInitSource,moveInfo, nextKey,hoverIndex);
        self.setState({
          dataSource: dataSource
        })
      }
    })
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

    if (level == 'same') {
      dataTable.newItem(newRecord, dataTable.getParentItem(record), type);
      initDataTable.newItem(newInitRecord, initDataTable.getParentItem(record), type);
    } else {
      dataTable.newItem(newRecord, record, type);
      initDataTable.newItem(newInitRecord, record, type);
    }
    this.setState({
      dataSource: dataSource,
      dataInitSource
    }, () => {
      if (isNull) {
        this.resetNullIcon(dataSource);
      }
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
    dataUtil.Table(dataInitSource).updateItem(newRecord);
    dataUtil.Table(dataSource).updateItem({ ...newRecord });
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
    dataUtil.Table(dataSource).deleteItemByIds([id]);
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

  expandKeys = (level) => {
    let expandedRowKeys = this.state.expandedRowKeys
    if (this.state.record.children) {
      let array = dataUtil.getExpandKeys([this.state.record])
      var newKeys = expandedRowKeys.concat(array)
      this.setState({
        expandedRowKeys: newKeys
      })
    }
  }
  /**
   * 页面搜索
   *
   * @param callback 回调函数
   * @param conditions 查询条件
   * @param children 
   */
  search = (conditions, children = true, callback) => {
    const { dataInitSource } = this.state;
    let searchData = dataUtil.search(dataInitSource, conditions, children);
    this.setState({
      dataSource: searchData
    }, () => {
      this.resetNullIcon(searchData);
      if (callback) {
        callback(searchData);
      }
    });
  }
  resetNullIcon = (data) => {
    if (this.props.layout_) {
      if (!data || data.length == 0) {
        this._setNullIcon();
      } else {
        this._clearNullIcon();
      }
    }

  }

  /**
   * 设置空数据的图标
   *
   * @private
   */
  _setNullIcon = () => {
    const dom = ReactDOM.findDOMNode(this);
    let findDom = this._findChildrenByClassName([dom], "ant-table-body");
    let placeholder = this._findChildrenByClassName([dom], "ant-table-placeholder");
    if (placeholder) {
      let { trueLayout } = this.state;
      let { nullIconHeight } = trueLayout || {};
      placeholder.style.height = nullIconHeight + "px";
      placeholder.style.display = "";
      findDom.style.height = "0px";
    }
  }

  /**
   * 清楚空数据的图标
   *
   * @private
   */
  _clearNullIcon = () => {
    const dom = ReactDOM.findDOMNode(this);
    let findDom = this._findChildrenByClassName([dom], "ant-table-body");
    let placeholder = this._findChildrenByClassName([dom], "ant-table-placeholder");
    if (placeholder && placeholder.style.display != "none") {
      placeholder.style.display = "none";
    }

    let { trueLayout } = this.state;
    let { contentHeight } = trueLayout || {};
    findDom.style.height = contentHeight + "px";
  }


  /**
   @method 展开行事件
   */
  handleOnExpand = (expanded, record) => {
    const { expandedRowKeys } = this.state
    if (expanded) {
      expandedRowKeys.push(record.id)
    } else {
      let i = expandedRowKeys.findIndex(item => item == record.id)
      expandedRowKeys.splice(i, 1)
    }
    this.setState({
      expandedRowKeys
    })
  }

  /**
   @method 设置table行样式
   @description 设置table行样式，根据ID处理是否是添加className
   @param record {object} 行数据
   */
  setClassName = (record) => {
    if (this.state.editable) {
      return record.id == this.state.activeIndex ? 'tableActivty editable-row' : 'editable-row';
    } else {
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
   @method table 右键事件
   @description  行右键操作时，根据是否是共有方法判断，非共有方法一律抛出
   @param data {object} 操作条
   */
  contentMenuClick = (data) => {
    if (data.isPublic) {
      if (data.fun == 'refresh') {
        this.getData();
      }
      if (data.fun == 'openAll') {
        this.expandKeys()
      }
    } else {
      this.props.rightClick(data);
    }
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
  //设置列 盒子  显示\隐藏
  setColumns = (status, e) => {
    this.setState({
      headStatus: false,
      headColumnsStatus: status == 'open' ? true : false
    })
  }


  initColumns = (data, allList) => {
    data.push({
      title: '',
      key: 'lastIndex',
    })
    this.setState({
      columns: data,
      headItem: allList,
      headColumnsStatus: false
    })
  }


  render() {
    /**
     @method 分页配置
     @description 分页处理，操作分页时做出回调处理，默认每页20条数据
     @param current {number} 当前页
     @param pageSize {number} 每页条数
     @param total {number} 总数
     @function onChangePage {function} 操作分页时，回调父组件请求数据
     */
    let pagination = (current, pageSize, total) => {
      return {
        total: total,
        current: current ? current : 1,
        pageSize: pageSize ? pageSize : 20,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['20', '50', '100', '500'],
        showTotal: total => `总共${total}条`,
        onShowSizeChange: (current, pageSize) => {
          this.setState({
            pageSize: pageSize,
            current: current,
            selectedRowKeys: null,
            selectedRows: null,
            activeIndex: '',
            record: null
          }, () => {
            //pageSize 变化的回调
            this.getData()
          })
        },
        onChange: (current, pageSize) => {
          this.setState({
            pageSize: pageSize,
            current: current,
            selectedRowKeys: null,
            selectedRows: null,
            activeIndex: '',
            record: null
          }, () => {
            //页码改变的回调，参数是改变后的页码及每页条数
            this.getData()
          })
        }
      }
    }
    const { selectedRowKeys } = this.state

    /**
     @method 复选框配置项
     @description 复选框配置项，该配置可捕获复选框操作、可设置checkbox是否可操作 disabled 状态
     @param selectedRowKeys {array} 复选框选中集合
     @param selectedRows {object} 复选框选中行数据
     @param checkboxStatus {string} checkbox是否可操作的字段 key
     @function onChangeCheckBox {function} 操作复选框时，回调方法 可获得 复选框选中集合、复选框选中行数据
     */
    const rowSelections = {
      selectedRowKeys,
      columnWidth: "60px",

      onChange: (selectedRowKeys, selectedRows) => {
        if (this.props.selectTree) {
          return
        }
        this.props.onChangeCheckBox(selectedRowKeys, selectedRows)
        this.setState({
          selectedRows,
          selectedRowKeys
        })
      },
      onSelect: (record, selected, selectedRows, nativeEvent) => {
        if (!this.props.selectTree) {
          return
        }
        let selectRowIdArray = this.state.selectedRowKeys
        const findChildCheck = (rows) => {
          rows.forEach(rowsChild => {
            let i = selectRowIdArray.findIndex(item => item == rowsChild.id)
            if (i == -1) {
              selectRowIdArray.push(rowsChild.id)
            }
            let j = selectedRows.findIndex(item => item.id == rowsChild.id)
            if (j == -1) {
              selectedRows.push(rowsChild)
            }
            if (rowsChild.children) {
              findChildCheck(rowsChild.children)
            }
          })
        }
        const findChildUnCheck = (rows) => {
          rows.forEach(rowsChild => {
            let i = selectRowIdArray.findIndex(item => item == rowsChild.id)
            if (i > -1) {
              selectRowIdArray.splice(i, 1)
            }
            let j = selectedRows.findIndex(item => item.id == rowsChild.id)
            if (j > -1) {
              selectedRows.splice(j, 1)
            }
            if (rowsChild.children) {
              findChildUnCheck(rowsChild.children)
            }
          })
        }
        if (selected) {

          findChildCheck([record])
          this.setState({
            selectedRowKeys: selectRowIdArray,
            selectedRows: selectedRows
          })
          this.props.onChangeCheckBox(selectedRowKeys, selectedRows)
        } else {
          findChildUnCheck([record])
          this.setState({
            selectedRowKeys: selectRowIdArray,
            selectedRows: selectedRows
          })
          this.props.onChangeCheckBox(selectedRowKeys, selectedRows)
        }
      },

      onSelectAll: (selected, selectedRows, changeRows) => {
        if (!this.props.selectTree) {
          return
        }
        if (selected) {
          this.setState({
            selectedRowKeys: selectedRows.map(item => item.id),
            selectedRows: selectedRows
          })
          this.props.onChangeCheckBox(selectedRows.map(item => item.id), selectedRows)
        } else {
          this.setState({
            selectedRowKeys: [],
            selectedRows: []
          })
          this.props.onChangeCheckBox([], [])
        }
      },
      getCheckboxProps: record => ({
        //根据 指定字段 判读checkbox 是否可以操作，默认可操作
        disabled: this.props.checkboxStatus ? this.props.checkboxStatus(record) : false,
      })
    };
    let isCheck = this.props.useCheckBox ? false : true //无复选框，第一行左边距设为30px

    let { components } = this.props;
    if (this.state.editable) {
      components = {
        body: {
          row: EditableFormRow,
          cell: EditableCell,
        }
      };
    }

    return (

      <div className={styles.main + " " + (isCheck ? styles.firstMargin : "")}>
        {this.state.contextMenuType && (
          <div className={styles.contentMenu} style={{ left: this.state.contentX, top: this.state.contentY }}>
            <Menu>
              {this.state.contentMenu.map((item, key) => {
                return (
                  item.type == 'select' ? (
                    <Menu.Item key={item.name}>
                      <Select defaultValue="1" style={{ width: 120 }}>
                        <Option value="1">展开1层</Option>
                        <Option value="2">展开2层</Option>
                        <Option value="3">展开3层</Option>
                        <Option value="4">展开4层</Option>
                        <Option value="5">展开5层</Option>
                        <Option value="6">展开6层</Option>
                        <Option value="7">展开7层</Option>
                        <Option value="8">展开8层</Option>
                      </Select>
                    </Menu.Item>
                  ) : (
                      <Menu.Item key={item.name} onClick={this.contentMenuClick.bind(this, item)}>
                        <MyIcon type={item.icon} style={{ fontSize: 14 }} />
                        {item.name}
                      </Menu.Item>
                    )
                )

              })
              }
            </Menu>
          </div>
        )}
        {
          this.state.headStatus &&
          (
            <div className={styles.contentMenu} style={{ left: this.state.x, top: this.state.y }}>
              <Menu>
                <Menu.Item key={"show-column"} onClick={this.setColumns.bind(this, 'open')}>
                  <Icon type={"unordered-list"} />
                  隐藏/显示 列
                </Menu.Item>
                {
                  this.state.headerMenu.map((item, key) => {
                    return (
                      <Menu.Item key={item.name} onClick={this.contentMenuClick.bind(this, item)}>
                        <Icon type={item.icon} />
                        {item.name}
                      </Menu.Item>
                    )
                  })
                }
              </Menu>
            </div>
          )
        }
        {this.state.headColumnsStatus &&

          <SortDnd sub={this.initColumns} close={this.setColumns.bind(this, 'close')} columns={this.state.headItem} />
        }
        {this.props.dnd ? (

          <Table
            bordered={this.props.bordered ? true : false}
            columns={this.state.columns}
            dataSource={this.state.dataSource}
            components={this.components}
            rowKey={record => record.id}
            pagination={false}
            scroll={this.state.scroll}
            rowSelection={this.props.useCheckBox ? rowSelections : null}
            expandedRowKeys={this.state.expandedRowKeys}
            onExpand={this.handleOnExpand.bind(this)}    //添加 默认点击 + 图标方法
            size={this.props.size ? this.props.size : 'small'}
            rowClassName={this.setClassName}
            indentSize={this.state.indentSize}
            loading={this.state.loading ? this.state.loading : false}
            onRow={(record, index) => ({
              index,
              onMouseEnter: this.getMoveData.bind(this, record),
              moveRow: this.moveRow,
              onClick: (event) => {
                let isCheck = this.props.useCheckBox ? true : false
                if (isCheck) {

                  let flag = this.props.checkboxStatus ? this.props.checkboxStatus(record) : false
                  if (!flag) {
                    this.setState({
                      selectedRowKeys: [record.id],
                      selectedRows: [record]
                    }, () => {
                      this.props.onChangeCheckBox([record.id], [record])
                    })
                  } else {
                    this.setState({
                      selectedRowKeys: [],
                      selectedRows: []
                    }, () => {
                      this.props.onChangeCheckBox([], [])
                    })
                  }
                }

                this.getLineInfo(record)
              },
              onContextMenu: (event) => {
                //右键操作
                event.preventDefault()
                //禁用右键功能
                if (this.props.closeContentMenu) {
                  return
                }
                this.getLineInfo(record)
                this.setState({
                  contextMenuType: true,
                  contentX: event.clientX,
                  contentY: document.body.clientHeight - event.clientY
                    >= this.state.contentMenu.length * 40 ? event.clientY :
                    document.body.clientHeight - this.state.contentMenu.length * 40 - 10
                })
              }
            })}
            onHeaderRow={(columns, index) => {
              return {
                onContextMenu: (event) => {
                  //右键操作
                  event.preventDefault()
                  this.setState({
                    headStatus: true,
                    x: event.clientX,
                    y: event.clientY
                  })
                }
              }
            }}
          />
        ) : (!this.props.scroll?(
          <Table
              bordered={this.props.bordered ? true : false}
              columns={this.state.columns}
              components={components}
              dataSource={this.state.dataSource}
              rowKey={record => record.id}
              size={this.props.size ? this.props.size : 'small'}
              indentSize={this.state.indentSize}
              // scroll={this.state.scroll}
              pagination={this.props.pagination ?
                pagination(this.state.current, this.state.pageSize, this.props.total)
                : false}
              rowSelection={this.props.useCheckBox ? rowSelections : null}
              loading={this.state.loading ? this.state.loading : false}
              expandedRowKeys={this.state.expandedRowKeys}
              onExpand={this.handleOnExpand.bind(this)}    //添加 默认点击 + 图标方法
              rowClassName={this.setClassName}
              onRow={(record, index) => ({
                onClick: (event) => {
                  let isCheck = this.props.useCheckBox ? true : false
                  if (isCheck) {

                    let flag = this.props.checkboxStatus ? this.props.checkboxStatus(record) : false
                    if (!flag) {
                      this.setState({
                        selectedRowKeys: [record.id],
                        selectedRows: [record]
                      }, () => {
                        this.props.onChangeCheckBox([record.id], [record])
                      })
                    } else {
                      this.setState({
                        selectedRowKeys: [],
                        selectedRows: []
                      }, () => {
                        this.props.onChangeCheckBox([], [])
                      })
                    }
                  }

                  this.getLineInfo(record)
                },
                onContextMenu: (event) => {
                  //禁用右键功能
                  if (this.props.closeContentMenu) {
                    return
                  }
                  //右键操作
                  event.preventDefault()
                  this.getLineInfo(record)
                  this.setState({
                    contextMenuType: true,
                    contentX: event.clientX,
                    contentY: document.body.clientHeight - event.clientY
                      >= this.state.contentMenu.length * 40 ? event.clientY :
                      document.body.clientHeight - this.state.contentMenu.length * 40 - 10
                  })
                }
              })}
              // onHeaderRow={(columns, index) => {
              //   return {
              //     onContextMenu: (event) => {
              //       //右键操作
              //       event.preventDefault()
              //       this.setState({
              //         headStatus: true,
              //         x: event.clientX,
              //         y: event.clientY
              //       })
              //     }
              //   }
              // }}
            />
        ):(<Table
              bordered={this.props.bordered ? true : false}
              columns={this.state.columns}
              components={components}
              dataSource={this.state.dataSource}
              rowKey={record => record.id}
              size={this.props.size ? this.props.size : 'small'}
              indentSize={this.state.indentSize}
              scroll={this.props.scroll}
              pagination={this.props.pagination ?
                pagination(this.state.current, this.state.pageSize, this.props.total)
                : false}
              rowSelection={this.props.useCheckBox ? rowSelections : null}
              loading={this.state.loading ? this.state.loading : false}
              expandedRowKeys={this.state.expandedRowKeys}
              onExpand={this.handleOnExpand.bind(this)}    //添加 默认点击 + 图标方法
              rowClassName={this.setClassName}
              onRow={(record, index) => ({
                onClick: (event) => {
                  let isCheck = this.props.useCheckBox ? true : false
                  if (isCheck) {

                    let flag = this.props.checkboxStatus ? this.props.checkboxStatus(record) : false
                    if (!flag) {
                      this.setState({
                        selectedRowKeys: [record.id],
                        selectedRows: [record]
                      }, () => {
                        this.props.onChangeCheckBox([record.id], [record])
                      })
                    } else {
                      this.setState({
                        selectedRowKeys: [],
                        selectedRows: []
                      }, () => {
                        this.props.onChangeCheckBox([], [])
                      })
                    }
                  }

                  this.getLineInfo(record)
                },
                onContextMenu: (event) => {
                  //禁用右键功能
                  if (this.props.closeContentMenu) {
                    return
                  }
                  //右键操作
                  event.preventDefault()
                  this.getLineInfo(record)
                  this.setState({
                    contextMenuType: true,
                    contentX: event.clientX,
                    contentY: document.body.clientHeight - event.clientY
                      >= this.state.contentMenu.length * 40 ? event.clientY :
                      document.body.clientHeight - this.state.contentMenu.length * 40 - 10
                  })
                }
              })}
              // onHeaderRow={(columns, index) => {
              //   return {
              //     onContextMenu: (event) => {
              //       //右键操作
              //       event.preventDefault()
              //       this.setState({
              //         headStatus: true,
              //         x: event.clientX,
              //         y: event.clientY
              //       })
              //     }
              //   }
              // }}
            />)
            
          )}
      </div>

    );
  }
}

const tableDnd = DragDropContext(HTML5Backend)(DragSortingTable);

export default tableDnd
