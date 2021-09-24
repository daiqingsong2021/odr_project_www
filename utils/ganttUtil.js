
/**
 * 选中行时，设置最后选中的行
 *
 * @param l
 * @param f
 * @returns {*}
 */
export const setLastSelectedBeforeselect = (e) =>{
    
    const item = e.record;
    let {selectedRow} = e.sender.tasks;
    if(selectedRow && selectedRow["id"] != item["id"]  ){
      e.sender.tasks.selectedRow = item;
    }if(!selectedRow){
      e.sender.tasks.selectedRow = item;
    }
    e.sender.tasks.lastSelectedRow = selectedRow;
}
/**
 * 设置行的选中颜色，以及行的自定义的样式。
 *
 * @param e
 */
export const setSelectRowCls = (e) =>{

  let {record} = e || {};
  let {selectedRow} = e.sender.tasks;
  if(selectedRow && record["id"] === selectedRow["id"] ){
    e.rowCls = "mini-supergrid-click-rowselected";
  }

  //  设置行的样式
  if(e.sender.setRowStyle){
    //
    let rowStyle = getRowStyleHtml(e.sender,record,e.sender.tasks.isSelected(record));
    e.rowStyle = rowStyle || "";
  }
}

export const getRowStyleHtml = (sender,record,select) =>{
  //  设置行的样式
  if(sender.setRowStyle) {
    //
    let rowStyle = sender.setRowStyle(record);
    if (select) {
      if (rowStyle && (rowStyle.indexOf("background") > -1 || rowStyle.indexOf("backgroundColor") > -1)) {
        let arr = rowStyle.split(";");
        rowStyle = "";
        arr.forEach((item) => {
          if (item && item.indexOf("background") == -1) {
            rowStyle += item + ";";
          }
        });
      }
    }
    return rowStyle;
  }
}

export const singleSelectionChanged = {

  __OnSelectionChanged: function (e) {
    setRowBySelectionChanged(e);
  },
  init: function (grid) {
    grid.on("selectionchanged", this.__OnSelectionChanged, this);
  }
}


export const setRowBySelectionChanged = (e) =>{
    let {select,selected,_records} = e;
    let {selectedRow,lastSelectedRow} = e.sender.owner.tasks;
    let tableView = e.sender.owner.tableView;
    if(select){
      if(selectedRow){
        if(lastSelectedRow && lastSelectedRow["id"] != selectedRow["id"]){
          tableView.removeRowCls(lastSelectedRow, "mini-supergrid-click-rowselected");
        }
        tableView.addRowCls(selectedRow, "mini-supergrid-click-rowselected");
      }
    }
    if(_records){
      _records.forEach(record => {
        if(e.sender.owner.setRowStyle) {
          //
          let rowStyle = e.sender.owner.setRowStyle(record);
          let rowEl = tableView._getRowEl(record);
          mini.setStyle(rowEl, rowStyle);
          if(select && rowStyle && rowStyle.indexOf("background") > -1){
            $(rowEl).css("background",null);
            $(rowEl).css("backgroundColor",null);
          }
        }
      });
    }
}


export const multipleSelectionChanged ={
  header: function (column) {

    let checkhtml;
    if (this.multiSelect == false){
      checkhtml = "";
    }else{
      let allCheckbox = $(this.el).find("#checkedbox-all");
      if(allCheckbox.length > 0){
        checkhtml = allCheckbox.prop("outerHTML");
      }else{
        let className = "ant-checkbox";
        checkhtml = '<span id = "checkedbox-all" style="margin-top: -10px" class="'+className+'" ><span class="ant-checkbox-inner"></span></span>';
      }
    }
    // ant-checkbox-indeterminate
    return checkhtml;
  },
  getCheckId: function (record) {
    return this._gridUID + "$checkcolumn$" + record[this._rowIdField];
  },
  init: function (grid) {
    grid.on("selectionchanged", this.__OnSelectionChanged, this);
    grid.on("HeaderCellClick", this.__OnHeaderCellClick, this);
  },
  renderer: function (e) {

    let selected = e.sender.isSelected ? e.sender.isSelected(e.record) : false;
    let {id} = e.record;
    let className = "ant-checkbox";
    if(selected){
      className += " ant-checkbox-checked";
    }

    if(e.sender.owner && e.sender.owner.__getCheckStatus(e.record)){
      className += " ant-checkbox-disabled";
    }

    const checkhtml = '<span id = "checkedbox-'+id+'" data-id="'+id+'" class="'+className+'" ><span class="ant-checkbox-inner"></span></span>';
    return checkhtml;
  },
  __OnHeaderCellClick: function (e) {
    
    let grid = e.sender;
    let owner = grid.owner;
    if (e.column != this) return;
    let allcheck = $(grid.el).find("#checkedbox-all");
    if (allcheck.size() > 0) {
      let className = allcheck.attr('class');
      let check = className.indexOf("ant-checkbox-checked") > -1;
      if (grid.getMultiSelect()) {
        if (check) {
          owner.deselectAll();
          allcheck.removeClass("ant-checkbox-checked");
        } else {
          owner.selectAll();
          allcheck.addClass("ant-checkbox-checked");
        }
      } else {
        owner.deselectAll();
        if (check) {
          owner.select(0);
        }
      }
      grid.fire("checkall");
    }
  },
  __OnSelectionChanged: function (e) {
    
    let {_records, select, selected} = e;
    let $table = $(e.sender.el);
    let owner = e.sender.owner;
    if (_records && _records.length > 0) {
      if (select) {
        _records.forEach(record => {
          let {id} = record;
          let $check = $table.find("#checkedbox-" + id);
          $check.removeClass("ant-checkbox-checked");
          $check.addClass("ant-checkbox-checked");
        });
      } else {
        let idArr = new Array();
        _records.forEach(record => {
          idArr.push(record["id"]);
        });
        $table.find(".ant-checkbox-checked").each(function () {
          let id = $(this).data("id");
          if (idArr.indexOf(Number(id)) > -1) {
            $(this).removeClass("ant-checkbox-checked");
          }
        });
      }
    }

    setRowBySelectionChanged(e);

    let allcheck = $table.find("#checkedbox-all");
    let selecteds = e.sender.getSelecteds();

    if(!selecteds || selecteds.length == 0){
      allcheck.removeClass("ant-checkbox-checked");
      allcheck.removeClass("ant-checkbox-indeterminate");
    }else {
      //let length = thisObj.state.dataInitSource.length;
      let list = owner.tasks.getList();
      let checked = false,unchecked = false;
      for(let i = 0, len = list.length; i < len; i++){
        if(!owner.__getCheckStatus(list[i])){
          if(e.sender.isSelected(list[i])){
            checked = true;
          }else{
            unchecked = true;
          }
          if(checked && unchecked){
            break;
          }
        }
      }

      if(checked && unchecked){
        allcheck.removeClass("ant-checkbox-checked");
        allcheck.addClass("ant-checkbox-indeterminate");
      }else if(!checked){
        allcheck.removeClass("ant-checkbox-checked");
        allcheck.removeClass("ant-checkbox-indeterminate");
      }else {
        allcheck.addClass("ant-checkbox-checked");
        allcheck.removeClass("ant-checkbox-indeterminate");
      }
    }
  }
}
