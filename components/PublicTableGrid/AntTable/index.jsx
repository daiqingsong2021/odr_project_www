import { Table, Icon, Menu, Select, Form, Input, InputNumber,TreeSelect } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ReactDOM from 'react-dom'
import * as util from '../../../utils/util';
import SortDnd from '../../SortDnd/index'
import * as dataUtil from '../../../utils/dataUtil';
import MyIcon from "../../public/TopTags/MyIcon"
const { Option } = Select;
let dragingIndex = -1;
import styles from './style.less'
import axios from '../../../api/axios';

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
    //???????????????
    if (this.props.dataconfig && editing) {
      const dataconfig = this.props.dataconfig
      //????????????
      const request = dataconfig.request || "get"
      if (request == "get") {
        //????????????
        if (dataconfig.param) {
          //????????????
          const newParam = dataconfig.param.map(item => {
            //??????????????????
            if(typeof item=="object"){
              let arr = item.recordValue.split(".")
              let temp = this.props.record
              arr.forEach(item => {
                temp = temp[item]
              })
              return temp
            }else{
              return item
            }
          
           
         
          })
          axios.get(dataconfig.url(...newParam), null, null, true).then(res => {
            this.setState({
              selectData: res.data.data,
              editing
            }, () => {
              this.input.focus();
            })
          })
        }else{
          axios.get(dataconfig.url, null, null, true).then(res => {
            this.setState({
              selectData: res.data.data,
              editing
            }, () => {
              this.input.focus();
            })
          })
        }

      }

    } else {

      this.setState({ editing }, () => {
        if (editing) {
          this.input.focus();
        }
      });
    }

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

  renderCell = form => {

    this.form = form;
    let { children, dataIndex, record, title, formType, min, max, length, required, items, parser, precision, formatter, dataconfig } = this.props;
    const { editing } = this.state;
    items = items || [];

    if (!editing) {
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
                  <InputNumber style={{ width: "100%" }} min={min} max={max} ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} precision={precision}
                    formatter={formatter}
                    parser={parser} />
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
                initialValue: dataconfig && dataconfig.valueKey? record[dataIndex][dataconfig.valueKey]:record[dataIndex],
              })
                (
                  <Select ref={node => (this.input = node)} style={{ width: "100%" }} size="small" onPressEnter={this.save} onBlur={this.save}>
                    { this.state.selectData? 
                      this.state.selectData.map(item => {
                        return (
                          <Option key={item.value} value={parseInt(item.value)}>{item.title}</Option>
                        )
                      }):
                      items.map(item => {
                        return (
                          <Option key={item.value} value={item.value}>{item.title}</Option>
                        )
                      })
                    }
                  </Select>
                )
            }
          </Form.Item>
        )

      }else if (formType == 'TreeSelect') {

        return (
          <Form.Item style={{ margin: 0 }}>
            {
              form.getFieldDecorator(dataIndex, {
                rules: [
                  {
                    required: required || false,
                    message: `${title} .`,
                  }],
                initialValue: dataconfig && dataconfig.valueKey? record[dataIndex][dataconfig.valueKey]:record[dataIndex],
              })
                (
                  <TreeSelect ref={node => (this.input = node)} size="small" onPressEnter={this.save} 
                        style={{ width: "100%" }} onChange={(value,label,extra)=>{
                          form.setFieldsValue({dataIndex:value},()=>{
                            this.save()
                          })
                        }}
                        treeData={this.state.selectData ? this.state.selectData : items}
                      />
                )
            }
          </Form.Item>
        )

      }  else if (formType == 'Date') {
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
                <DatePicker style={{ width: '100%' }} format={this.props.format} disabledDate={this.props.disabledDate}
                  showTime={{ format: 'HH:mm', defaultValue: moment('00:00:00', 'HH:mm:ss') }} />
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
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
            children
          )}
      </td>
    );
  }
}

/**
 @author haifeng
 @description ???????????????????????? (?????????)
 @param dnd {Boolean} table ???????????????????????? ??????fasle
 @param bordered {Boolean} ??????????????????????????????????????????false
 @param columns  {array} ????????????????????????
 @param dataSource {array} ????????????
 @param pagination {Boolean} ????????? ??????????????????
 @param onRow {Function(record, index)}  ???????????????
 @param useCheckBox (Boolean) ??????????????????????????? ??????false
 @param scroll {{ x: number | true, y: number }} ???????????????????????????????????????????????????????????????????????????????????????????????????????????????
 @param size (default | middle | small) ??????????????? ?????? small
 @param total {number}  ????????? ????????? ????????????????????????????????????
 @param onChangePage {function(????????????????????????)} ??????????????????????????????
 @param onChangeCheckBox {function (?????????ID??????????????????)} ?????????????????????
 @param checkboxStatus {string} ????????????????????????????????????????????? ?????? ??????
 @param loading //table loading?????? ???????????????
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
      headStatus: false,                                                        //?????????????????????
      headColumnsStatus: false,
      x: 0, y: 0, contentX: 0, contentY: 0,
      dnd: this.props.dnd ? true : false,                                       //???????????????????????? ??????false
      bordered: this.props.bordered ? true : false,                             //??????????????????????????????????????????false
      activeIndex: null,                                                        //table ?????????key?????????????????????className
      record: null,                                                             //table ???????????????
      columns: [],                  //table ??????
      dataSource: null,                                                         //table ??????
      dataInitSource: [],
      pagination: this.props.pagination ? true : false,                         //????????? ??????????????????
      scroll: scroll ? scroll : false,                    //???????????????????????????????????????????????????????????????????????????????????????????????????????????????
      size: this.props.size ? this.props.size : 'small',                        //??????????????? ?????? small
      total: this.props.total ? this.props.total : 0,                           //????????? ????????? ????????????????????????????????????
      pageSize: this.props.pageSize ? this.props.pageSize : 20,                 //???????????????????????????20???
      current: this.props.current ? this.props.current : 1,                     //?????????????????????1???
      moveInfo: null,                                                           //???????????????
      indentSize: this.props.indentSize ? this.props.indentSize : 10,           //??????????????????????????????????????????????????? px ?????????,?????? 10px
      selectedRowKeys: [],                                                      //?????????????????????ID
      columnsKeys: [],
      expandedRowKeys: [],                                                       //?????????
      expanderLevel: this.props.expanderLevel ? this.props.expanderLevel : 0,        //????????????????????????2???
      contentMenu: [],
      headerMenu: this.props.headerMenu || [],
      editable: true
    };
  }




  /**
   * ???????????????
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
      if (ret["y"] && props.cutHeight) {
        ret["y"] -= props.cutHeight
      }
    }
    return ret;
  }

  componentDidMount() {
    //????????????????????????
    document.addEventListener('click', this.close)
    if (this.props.onRef) {
      this.props.onRef(this);
    }
    let list = this.state.contentMenu
    if (this.props.contentMenu) {
      list = [...this.props.contentMenu]
    }
    if (this.props.pagination) {
      list.push({ name: '??????', fun: 'refresh', type: 'buttom', icon: 'icon-shuaxin', isPublic: true })
    } else {
      //???????????????
      if (this.props.istile) {
        list.push({ name: '??????', fun: 'refresh', type: 'buttom', icon: 'icon-shuaxin', isPublic: true })
      } else {
        //???????????????
        list.push(
          { name: '??????', fun: 'refresh', type: 'buttom', icon: 'icon-shuaxin', isPublic: true },
          { name: '????????????', fun: 'openAll', type: 'buttom', icon: 'icon-zhankai1', isPublic: true }
        )
      }
    }

    if (this.props.initLoadData != false) {
      this.getData();
    }

 
    let columns = this.extColumns(this.props.columns, this.props);
    columns.forEach(item=>item.ischecked = true)
   
    this.setState({
      contentMenu: list,
      columns: columns
    })
    // ?????????????????????????????????
    this.initDomNode(this.props, true);
  }

  /**
   * ??????????????????1???????????????title?????????2???????????????
   *
   * @param columns ??????????????????
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
      // ????????????
      let sumpx = 0;
      // ???????????????
      let sumPercentage = 0;
      // ????????????????????????????????????
      let nullNum = 0, onPxNum = 0;
      //
      let valueMap = new Object();

      // ???????????????
      let widthSum = contentWidth > contentMinWidth ? contentWidth : contentMinWidth;

      columns.forEach((col) => {
        const { width, key } = col;
        if (!width) {
          nullNum++;
          onPxNum++;
          valueMap[key] = { type: "null" };
        } else if (typeof width === "number" || width.indexOf("px") > 0) {
          // ??????
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

      // ??????PX??????
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
          // ????????????????????????100???????????????????????????????????????????????????10%
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
          // ????????????
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
   * ????????????????????????<td>????????????title
   *
   * @param col
   **/
  setCellTitle = (columns) => {

    if (columns) {
      columns.forEach((col) => {
        // ??????????????? title
        let { dataIndex, onCell, render, edit, title } = col;

        let newOnCell;
        if (edit && edit.editable) {
          col.onCell = record => ({
            ...edit,
            record,
            dataIndex: dataIndex,
            title: title
          })
          if(edit.formType=='Select'){
            col.onHeaderCell=column=>{
              return {style:{paddingLeft:20}}
              }
          }

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
        // ??????????????? title
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
   * ??????????????????????????????????????????
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
        list.push({ name: '??????', fun: 'refresh', type: 'buttom', icon: 'icon-shuaxin', isPublic: true })
      } else {
        list.push(
          { name: '??????', fun: 'refresh', type: 'buttom', icon: 'icon-shuaxin', isPublic: true },
          { name: '????????????', fun: 'openAll', type: 'buttom', icon: 'icon-zhankai1', isPublic: true }
        )
      }
      this.setState({
        contentMenu: list
      })
    }
    /**
     * ??????????????????????????????????????????/???
     */

    if (nextProps.layout_ != this.props.layout_) {
     if( nextProps.columns!=this.props.columns){
      nextProps.columns.forEach(item=>item.ischecked = true)
     }
      let newColumns = nextProps.columns;
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
    //????????????????????????
    document.removeEventListener('click', this.close, false);

    if (this.observer) {
      this.observer.disconnect();
    }
  }

  mutationObserver = (target, config, callback) => {
    // Firefox???Chrome???????????????????????????
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    // ?????????????????????
    let observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        callback(mutation);
      });
    });

    // ?????????????????????????????????
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
   * ??????DOM
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
   * ??????dom???????????????????????????????????????
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
        // ????????????????????????Dom??????
        this.___handleDom(findDom, heardDom, "leyout");
        let trueLayout = {};
        let { contentHeight, contentWidth, contentMinWidth } = layout_;
        if (contentHeight && contentHeight > 0) {

          if (this.props.pagination) {
            contentHeight -= 85;
          }
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
   * ???????????????
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
   * @method ??????table??????
   * @description table ??????????????????????????????????????????????????????????????????????????????????????????
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
          expandedRowKeys: array,
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
   * ?????????????????????
   *
   * @returns {null}
   */
  findDataList = () => {
    return this.state.dataSource;
  }

  /**
   @method ????????????
   @description ???????????????????????????????????????,??????????????????????????????????????????????????? true ???????????????
   @param dragIndex {number} ????????????
   @param hoverIndex {number} ??????????????????
   @param nextKey  {number} ??????key ????????????????????????

   */
  moveRow = (dragIndex, hoverIndex, nextKey) => {
    const { moveInfo } = this.state;
    const { dataSource, dataInitSource } = this.state
    //??????????????? ????????????????????????  true ?????? ??????
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
   @method ??????????????????????????????
   @description ???????????????????????????????????????????????????????????????
   @param moveInfo {object} ??????????????????
   */
  getMoveData = (moveInfo) => {
    this.setState({
      moveInfo
    })
  };

  //??????
  close = () => {
    this.setState({
      headStatus: false,
      contextMenuType: false
    })
  }

  /**
   @method ??????table ???????????????
   @description ?????????????????????,????????????????????????
   @param record {object} ?????????
   @function getRowData {function} ?????????????????? ???????????????????????????
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
   @method ????????????
   @description  ???????????????????????????
   @param record {object} ?????????
   @param newRecord {object} ????????????
   @param level {string} ??????????????????????????? ?????????????????????????????? ????????? same ????????????????????? 
   */
  add = (record, newRecord, level = '', type = "last") => {

    const { dataSource, dataInitSource } = this.state;
    let isNull = !dataSource || dataSource.length == 0;
    // ??????????????????
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
   * ???????????????????????????
   *
   * @param newRecord
   */
  addData = (newRecord, type) => {
    this.add(null, newRecord, "same", type);
  }

  /**
   * ???????????????
   *
   * @param record ????????????
   * @param newRecord ????????????
   */
  addChildren = (newRecord, parentRecord, type) => {
    this.add(parentRecord, newRecord, "", type);
  }

  /**
   @method ????????????
   @description  ?????????????????????????????????
   @param record {object} ?????????
   @param newRecord {object} ?????????
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
   * ????????????
   *
   * @param newRecord
   */
  updateData = (newRecord = {}) => {
    this.update(null, newRecord);
  }

  /**
   * ??????ID???????????????
   *
   * @param id
   */
  getDataById = (id) => {
    return dataUtil.getItemByTree(this.state.dataSource, (item) => {
      return id === item.id;
    })
  }

  /**
   @method ????????????
   @description  ?????????????????????????????????
   @param record {object} ?????????
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
   * ????????????
   *
   * @param callback ????????????
   * @param conditions ????????????
   * @param children 
   */
  search = (conditions, children = true, callback) => {
    const { dataInitSource } = this.state;
    let searchData = dataUtil.search(dataInitSource, conditions, children);
    this.setState({
      dataSource: searchData,
      activeIndex: null,
      record: null
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
   * ????????????????????????
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
   * ????????????????????????
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
   @method ???????????????
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
   @method ??????table?????????
   @description ??????table??????????????????ID?????????????????????className
   @param record {object} ?????????
   */
  setClassName = (record) => {
    if (this.state.editable) {
      return record.id == this.state.activeIndex ? 'tableActivty editable-row' : 'editable-row';
    } else {
      return record.id == this.state.activeIndex ? 'tableActivty' : '';
    }
  };

  /**
   @method ???????????????????????????????????????
   @description  ??????????????????????????????????????? ?????? ???????????????1?????????
   @param record {object} ?????????
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
   @method table ????????????
   @description  ????????????????????????????????????????????????????????????????????????????????????
   @param data {object} ?????????
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
   @method ?????????????????????
   @description  ??????????????????????????????????????? ?????????????????? ???????????????1????????????????????????????????????????????????????????????
   @param record {object} ?????????
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
  //????????? ??????  ??????\??????
  setColumns = (status, e) => {
    this.setState({
      headStatus: false,
      headColumnsStatus: status == 'open' ? true : false
    })
  }


  initColumns = (data) => {
    this.setCellWindth(data, this.props);
    this.setCellTitle(data);
    this.setState({
      columns: data,
      headColumnsStatus: false
    })
  }


  render() {
    /**
     @method ????????????
     @description ???????????????????????????????????????????????????????????????20?????????
     @param current {number} ?????????
     @param pageSize {number} ????????????
     @param total {number} ??????
     @function onChangePage {function} ?????????????????????????????????????????????
     */
    let pagination = (current, pageSize, total) => {
      return {
        total: total,
        current: current ? current : 1,
        pageSize: pageSize ? pageSize : 20,
        showSizeChanger: true,
        showQuickJumper: true,
        pageSizeOptions: ['20', '50', '100', '500'],
        showTotal: total => `??????${total}???`,
        onShowSizeChange: (current, pageSize) => {
          this.setState({
            pageSize: pageSize,
            current: current,
            selectedRowKeys: null,
            selectedRows: null,
            activeIndex: '',
            record: null
          }, () => {
            //pageSize ???????????????
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
            //??????????????????????????????????????????????????????????????????
            this.getData()
          })
        }
      }
    }
    const { selectedRowKeys } = this.state

    /**
     @method ??????????????????
     @description ??????????????????????????????????????????????????????????????????checkbox??????????????? disabled ??????
     @param selectedRowKeys {array} ?????????????????????
     @param selectedRows {object} ????????????????????????
     @param checkboxStatus {string} checkbox???????????????????????? key
     @function onChangeCheckBox {function} ????????????????????????????????? ????????? ????????????????????????????????????????????????
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
        //?????? ???????????? ??????checkbox ????????????????????????????????????
        disabled: this.props.checkboxStatus ? this.props.checkboxStatus(record) : false,
      })
    };
    let isCheck = this.props.useCheckBox ? false : true //???????????????????????????????????????30px

    let { components } = this.props;
    if (this.state.editable) {
      components = {
        body: {
          row: EditableFormRow,
          cell: EditableCell,

        }
      };
    }
    const columns1=this.state.columns
    let columns=[]
    columns1.forEach((item)=>{
      if(item.ischecked==true){
        columns.push(item)
      }
    })
    if (!this.props.bordered) {
      columns.push({
        title: '',
        key: 'lastIndex',
      })
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
                        <Option value="1">??????1???</Option>
                        <Option value="2">??????2???</Option>
                        <Option value="3">??????3???</Option>
                        <Option value="4">??????4???</Option>
                        <Option value="5">??????5???</Option>
                        <Option value="6">??????6???</Option>
                        <Option value="7">??????7???</Option>
                        <Option value="8">??????8???</Option>
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
                  ??????/?????? ???
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

          <SortDnd sub={this.initColumns} close={this.setColumns.bind(this, 'close')} columns={this.state.columns} />
        }
        {this.props.dnd ? (

          <Table
            bordered={this.props.bordered ? true : false}
            columns={columns}
            dataSource={this.state.dataSource}
            components={this.components}
            rowKey={record => record.id}
            pagination={false}
            scroll={this.state.scroll}
            rowSelection={this.props.useCheckBox ? rowSelections : null}
            expandedRowKeys={this.state.expandedRowKeys}
            onExpand={this.handleOnExpand.bind(this)}    //?????? ???????????? + ????????????
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
                //????????????
                event.preventDefault()
                //??????????????????
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
                  //????????????
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
        ) : (
            <Table
              bordered={this.props.bordered ? true : false}
              columns={columns}
              components={components}
              dataSource={this.state.dataSource}
              rowKey={record => record.id}
              size={this.props.size ? this.props.size : 'small'}
              indentSize={this.state.indentSize}
              scroll={this.state.scroll}
              pagination={this.props.pagination ?
                pagination(this.state.current, this.state.pageSize, this.props.total)
                : false}
              rowSelection={this.props.useCheckBox ? rowSelections : null}
              loading={this.state.loading ? this.state.loading : false}
              expandedRowKeys={this.state.expandedRowKeys}
              onExpand={this.handleOnExpand.bind(this)}    //?????? ???????????? + ????????????
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
                  //??????????????????
                  if (this.props.closeContentMenu) {
                    return
                  }
                  //????????????
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
              onHeaderRow={(columns, index) => {
                return {
                  onContextMenu: (event) => {
                    //????????????
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
          )}
      </div>

    );
  }
}

const tableDnd = DragDropContext(HTML5Backend)(DragSortingTable);

export default tableDnd
