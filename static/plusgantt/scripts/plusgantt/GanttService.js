/* 定义一些常用、通用的方法，供外部调用
-----------------------------------------------------------------------------*/


var prototypes = mini._GridDragDrop.prototype;

mini._GridDragDrop.prototype = {
    // ...prototypes,
    __OnGridCellMouseDown: function (e) {
        console.log("__OnGridCellMouseDown");
        if (e.htmlEvent.button == mini.MouseButton.Right) return;
        var grid = this.owner;
        if (grid.isReadOnly() || grid.isAllowDragDrop(e.record, e.column) == false) return;
        var record = e.record;
        this.isTree = grid.data.isTree;
        this.dragData = grid._getDragData();

        if (this.dragData.indexOf(record) == -1) {
            this.dragData.push(record);
        }
        var drag = this._getDrag();
        drag.start(e.htmlEvent);
    },
    _OnDragStart: function (drag) {
        console.log("_OnDragStart");
        var grid = this.owner;

        this.feedbackEl = mini.append(document.body, '<div class="mini-feedback"></div>');
        this.feedbackEl.innerHTML = grid._getDragText(this.dragData);
        this.lastFeedbackClass = "";
    },
    _OnDragMove: function (drag) {

        var grid = this.owner;

        var x = drag.now[0], y = drag.now[1];
        mini.setXY(this.feedbackEl, x + 15, y + 18);

        var targetRecord = grid._getRecordByEvent(drag.event);
        this.dropRecord = targetRecord;

        if (targetRecord) {
            if (this.isTree) {
                this.dragAction = this.getFeedback(targetRecord, y, 3);
            } else {
                this.dragAction = this.getFeedback(targetRecord, y, 2);
            }
        } else {
            this.dragAction = "no";
        }
        this.lastFeedbackClass = "mini-feedback-" + this.dragAction;
        this.feedbackEl.className = "mini-feedback " + this.lastFeedbackClass;

        if(this.gantt.moveVerify && typeof this.gantt.moveVerify == "undefined"){
          var bl = this.gantt.moveVerify(this.dragAction,targetRecord);
            if(!bl){
                this.dragAction = "no";
            }
        }
        if (this.dragAction == "no") targetRecord = null;
        this.setRowFeedback(targetRecord, this.dragAction);
    }
}

mini.ExtDataTree = function () {
  mini.ExtDataTree.superclass.constructor.call(this);
}

mini.extend(mini.ExtDataTree, mini.DataTree, {
  selectAll:function() {
    this.selects(this.getList());
  },
  /**
   * 选中数据
   *
   * @param records 选中行
   * @param ignoreStatus 忽略状态
   */
  selects: function (records,ignoreStatus) {
    if (!mini.isArray(records)) return;
    records = records.clone();
    if (this.multiSelect == false) {
      this.deselects(this.getSelecteds());
      if (records.length > 0) records.length = 1;
      this._selecteds = [];
      this._idSelecteds = {};
    }

    if(!this._selecteds){
      this._selecteds = [];
    }

    if(!this._idSelecteds){
      this._idSelecteds = {};
    }

    var _records = [],newRecords = [];

    for (var i = 0, l = records.length; i < l; i++) {
      
      var record = this.getbyId(records[i]);
      if (!record) continue;

      if(!ignoreStatus && this.grid && this.grid.__getCheckStatus(record)){
        continue;
      }
      newRecords.push(record);
      if (!this.isSelected(record)) {

        this._selecteds.push(record);
        this._idSelecteds[record._id] = record;

        _records.push(record);
      }
    }
    this._OnSelectionChanged(newRecords, true, _records);

    if(this.grid.onChangeCheckBox){
      var selectedIds = new Array();
      if(this._selecteds){
        var i=0;
        var len = this._selecteds.length
        for(var i = 0;i < len; i++){
          selectedIds.push(this._selecteds[i]["id"]);
        }
      }

      this.grid.onChangeCheckBox(selectedIds,this._selecteds);
    }

  },
  deselects: function (records) {
    if (!mini.isArray(records)) return;
    records = records.clone();
    var _records = [];
    for (var i = records.length - 1; i >= 0; i--) {
      var record = this.getbyId(records[i]);
      if (!record) continue;
      if(this.grid && this.grid.__getCheckStatus(record)){
        continue;
      }
      if (this.isSelected(record)) {
        this._selecteds.remove(record);
        delete this._idSelecteds[record._id];
        _records.push(record);
      }
    }
    this._OnSelectionChanged(records, false, _records);
  },
  _OnSelectionChanged: function (records, select, _records) {
    var e = {
      records: records,
      select: select,
      selected: this.getSelected(),
      selecteds: this.getSelecteds(),
      _records: _records
    };
    this.fire("SelectionChanged", e);

    var current = this._current;
    var now = this.getCurrent();
    if (current != now) {
      this._current = now;
      this._OnCurrentChanged(now);
    }
  },
  filter: function (fn, scope, children) {

    if (typeof fn != "function") return;
    scope = scope || this;

    this._filterInfo = [fn, scope,children];

    this._doFilter();

    this._doSort();

    this._dataChanged();

    this.fire("filter");
  },
  _doFilter: function () {
    if (!this._filterInfo) {
      this.viewNodes = null;
      return;
    }
    var fn = this._filterInfo[0]
    var  scope = this._filterInfo[1];
    var children = false;
    if(this._filterInfo.length > 2){
      children = this._filterInfo[2];
    }
    var viewNodes = this.viewNodes = {}, nodesField = this.nodesField;
    function filter(node,children_,hasChildren) {
      var nodes = node[nodesField];
      if (!nodes) return false;
      var id = node._id;
      var views = viewNodes[id] = [];

      for (var i = 0, l = nodes.length; i < l; i++) {
        var r = nodes[i];
        if(children_){
          var add = hasChildren;
          if(!add){
            add = fn.call(scope, r, i, this);
          }
          var cadd = filter(r,children_,add);
          if (add === true || cadd) {
            views.push(r);
          }
        }else{
          var cadd = filter(r,children_);
          var add = fn.call(scope, r, i, this);
          if (add === true || cadd) {
            views.push(r);
          }
        }
      }
      return views.length > 0;
    }
    filter(this.root,children,false);
  }

});


mini.ExtGantt = function () {
  mini.ExtGantt.superclass.constructor.call(this);
}

mini.extend(mini.ExtGantt, PlusGantt, {

  selectAll:  function() {
    this.tasks.selectAll();
  },
  __getCheckStatus : function(record){
    var ret = false;
    if(this.getCheckStatus){
      ret = this.getCheckStatus(record);
    }
    return ret;
  },
  loadTasks: function (tasks) {
    
    if (!mini.isArray(tasks)) tasks = [];

    //this.parseTasks(tasks, this.data.TASKMAP);
    //delete this.data.TASKMAP;

    this.allowTaskModified = false;

    this.data.Tasks = tasks;

    this.tasks = new mini.ExtDataTree();
    this.tasks.expandOnLoad = this.expandOnLoad;
    this.tasks.idField = "UID";
    this.tasks.parentField = "ParentTaskUID";
    this.tasks.loadData(tasks);
    this.tasks.grid = this;
    this.tasks.getRootNode().UID = this.rootTaskUID;


    var tasks = this.getTaskList();
    for (var i = 0, l = tasks.length; i < l; i++) {
      var task = tasks[i];
      this._taskParseDate(task);
    }

    this.tableView.setData(this.tasks);
    this.ganttView.setData(this.tasks);
    this.syncTasks();

    var task = this.getTaskAt(0);
    if (task) {
      this.scrollIntoView(task);
    }
    var tasks = this.getTaskList();
    for (var i = 0, l = tasks.length; i < l; i++) {
      var task = tasks[i];
      task._x = task.ID + ":" + task.OutlineNumber;
    }

    this.tasks.on("selectionchanged", function (e) {

    }, this);
    this.tasks.on("datachanged", function (e) {
      this.fire("datachanged", e);
    }, this);

    this.allowTaskModified = true;
  },
  filter: function (fn, scope,children) {
    
    this.tasks.filter(fn, scope, children);
    var that = this;
    setTimeout(function () {
      that.setScrollTop(that.tableView.getScrollTop(), true);
    }, 50);
  }
});

mini.copyTo(mini.SuperTree.prototype, {
  doLayout: function () {

    if (!this.canLayout()) return;

    var h = this.getHeight(true);
    var w = this.getWidth(true);

    mini.setHeight(this._headerEl, this.headerHeight);

    var vh = this.getViewportHeight();
    mini.setHeight(this._viewportEl, vh);

    this.viewportWidth = this.getViewportWidth();
    this.viewportHeight = this.getViewportHeight();

    if (this.showHScroll) {
      this.hscrollerEl.style.bottom = 0;
    } else {
      this.hscrollerEl.style.bottom = '-2000px';
    }
    if (this.showVScroll) {
      this.vscrollerEl.style.right = 0;
    } else {
      this.vscrollerEl.style.right = '-2000px';
    }

    this.vscrollerEl.style.top = this.getHeaderHeight() + "px";
    this.vscrollerEl.style.height = this.getVScrollHeight() + "px";

    var hscrollWidth = this.getHScrollWidth();
    this.hscrollerEl.style.width = hscrollWidth + "px";

    var scrollWidth = this.getViewScrollWidth();
    // scrollWidth = (hscrollWidth/(hscrollWidth))*scrollWidth;
    this.hscrollerContentEl.style.width = (scrollWidth) + "px";
    this.vscrollerContentEl.style.height = this.scrollHeight + "px";

    this.cellsEl.style.width = this.viewportWidth + "px";
    this.cellsEl.style.height = this.viewportHeight + "px";

    this.scrollLeft = this.hscrollerEl.scrollLeft;
    this.scrollTop = this.vscrollerEl.scrollTop;
    var vwidth = this.getHScrollWidth();
    if (this.scrollLeft > this.scrollWidth - vwidth) this.scrollLeft = this.scrollWidth - vwidth;

    var aw = this.getAllFrozenColumnWidth();
    this.cellsEl.style.left = aw + "px";
    this.lockedcellsEl.style.width = aw + "px";
    this.lockedcellsEl.style.height = this.viewportHeight + "px";

    this._refreshViewport(true);
  },
  getHScrollWidth: function () {

    this.viewportWidth = this.getViewportWidth();
    var vwidth = this.viewportWidth;
    //if (this.showVScroll) vwidth -= 18;
    if (vwidth < 0) vwidth = 0;
    return vwidth;
  },
  getVScrollHeight: function () {

    this.viewportHeight = this.getViewportHeight();
    var vheight = this.viewportHeight;
    if (this.showHScroll) vheight -= 18;
    if (vheight < 0) vheight = 0;
    return vheight;
  },
  getAllColumnWidth: function () {

    var columns = this.getViewColumns();
    var all = 0;
    var columnWidth = this.columnWidth;
    for (var i = 0, l = columns.length; i < l; i++) {
      var col = columns[i];
      if(!col.field || col.field != "--last-columns--"){
        var w = mini.isNull(col.width) ? columnWidth : col.width;
        all += w;
      }
    }
    // all -= 18;
    return all;
  }
});

mini._SuperGridSelect.prototype = {

  __onGridCellMouseDown: function (e) {
    
    var record = e.record, column = e.column;
    if (this.grid.allowCellSelect) {
      var cell = {
        record: record,
        column: column
      };
      this.grid.setCurrentCell(cell);
    }
    if (!this.grid.allowRowSelect) return;

    var ex = {
      record: record,
      column: column,
      cancel: false
    };
    if(!this.grid.getMultiSelect() || !column._multiRowSelect){
      this.grid.fire("beforeselect", ex);
    }

    if (ex.cancel == true) return;
    var grid = this.grid;

    if (this.grid.getMultiSelect()) {
      this.grid.el.onselectstart = function () { };
      if (e.htmlEvent.shiftKey) {
        this.grid.el.onselectstart = function () { return false };
        e.htmlEvent.preventDefault();

        if (!this.currentRecord) {
          this.grid.data.select(record);
          this.currentRecord = this.grid.getSelected();
        } else {

          this.grid.deselectAll();
          this.grid.selectRange(this.currentRecord, record);
        }

      } else {
        this.grid.el.onselectstart = function () { };
        if (e.htmlEvent.ctrlKey) {
          this.grid.el.onselectstart = function () { return false };
          e.htmlEvent.preventDefault();
        }


        if (column._multiRowSelect || e.htmlEvent.ctrlKey || grid.allowUnselect) {
          if (this.grid.data.isSelected(record) && (column._multiRowSelect || e.htmlEvent.ctrlKey)) {
            if (e.htmlEvent.button != 2) {
              this.grid.data.deselect(record);

              this.grid.setCurrentCell(null);

            }
          } else {
            this.grid.data.select(record);
          }

        } else {
          if (this.grid.data.isSelected(record)) {
            this.grid.data.select(record);
          } else {
            this.grid.data.deselectAll();
            this.grid.data.select(record);
          }
        }

        this.currentRecord = this.grid.getSelected();

      }

    }
    else {
      if (!this.grid.data.isSelected(record)) {
        this.grid.data.select(record);
      }
    }
  }
};


// 扩展甘特图
ExtGantt = mini.ExtGantt;
function CreateGantt(options) {

    options = $.extend({
        autoSchedule: true
    }, options);

    var gantt = new ExtGantt();

    if (options.autoSchedule) {
        //创建甘特图调度插件
        new GanttSchedule(gantt);
    }

    gantt.setStyle("width:800px;height:400px");

    gantt.setAllowDragDrop(true);

    gantt.setColumns([
        { header: "", field: "ID", width: 30, cellCls: "mini-indexcolumn", align: "center", allowDrag: true, cellStyle: "cursor:move" },
        new StatusColumn(),
        { header: mini.Gantt.Name_Text, field: "Name", width: 200, name: "taskname",
            editor: { type: "textbox" }
        },
        { header: mini.Gantt.PredecessorLink_Text, field: "PredecessorLink",
            editor: {
                type: "textbox"
            },
            oncellbeginedit: function (e) {
                var table = e.source, gantt = table.owner;
                var links = e.value;
                e.value = gantt.getLinkString(links);
            }
        },
        { header: mini.Gantt.Duration_Text, field: "Duration",
            editor: {
                type: "spinner", minValue: 0, maxValue: 1000
            }
        },
        { header: mini.Gantt.Start_Text, field: "Start",
            editor: {
                type: "datepicker"
            }
        },
        { header: mini.Gantt.Finish_Text, field: "Finish",
            editor: {
                type: "datepicker"
            }
        },
        { header: mini.Gantt.PercentComplete_Text, field: "PercentComplete",
            editor: {
                type: "spinner", minValue: 0, maxValue: 100
            }
        },
        { header: "备注", field: "Note", width: 200, enterCommit: false,
            editor: { type: "textarea", minWidth: 200 }
        }
    ]);
    //设置节点列
    gantt.setTreeColumn("taskname");

    gantt.on("drawcell", function (e) {
        if (e.column.field == "Name" && e.record.Summary) {
            e.cellHtml = '<b>' + e.cellHtml + '</b>';
        }
        if (e.column.field == "Start" || e.column.field == "Finish") {
            var d = e.value;
            if (d) {
                e.cellHtml = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
            }
        }
        if (e.column.field == "PredecessorLink") {
            e.cellHtml = gantt.getLinkString(e.value);
        }
    });

    return gantt;
}


//状态列
StatusColumn = function (optons) {
    return mini.copyTo({
        name: "Status",
        width: 60,
        header: '<div class="mini-gantt-taskstatus"></div>',
        formatDate: function (date) {
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        },
        renderer: function (e) {
            var record = e.record;
            var s = "";
            if (record.PercentComplete == 100) {
                var t = record.Finish ? "任务完成于 " + this.formatDate(record.Finish) : "";
                s += '<div class="mini-gantt-finished" title="' + t + '"></div>';
            }
            if (record.Summary && record.FixedDate) {

                var t = "此任务固定日期，从开始日期 " + this.formatDate(record.Start)
                        + " 到完成日期 " + this.formatDate(record.Finish);
                s += '<div class="mini-gantt-constraint3" title=\'' + t + '\'></div>';
            } else if (record.ConstraintType >= 2 && mini.isDate(record.ConstraintDate)) {
                var ct = mini.Gantt.ConstraintType[record.ConstraintType];
                if (ct) {
                    var ctype = ct.Name;
                    var t = "此任务有 " + ct.Name + " 的限制，限制日期 " + this.formatDate(record.ConstraintDate);
                    s += '<div class="mini-gantt-constraint' + record.ConstraintType + '" title=\'' + t + '\'></div>';
                }
            }
            if (record.Milestone) {
                s += '<div class="mini-gantt-milestone-red" title="里程碑"></div>';
            }
            if (record.Notes) {
                var t = '备注：' + record.Notes;
                s += '<div class="mini-gantt-notes" title="' + t + '"></div>';
            }
            if (record.Conflict == 1) {
                var t = "此任务排程有冲突，如有必要，请适当调整";
                s += '<div class="mini-gantt-conflict" title="' + t + '"></div>';
            }

            //如果有新的任务状态图标显示, 请参考以上代码实现之......

            return s;
        }
    }, optons);
}
