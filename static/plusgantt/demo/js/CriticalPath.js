//关键路径（里程碑、非工作日）
var CriticalPath = function (gantt, options) {
    this.gantt = gantt;
    $.extend(this, options);
    this.init();
}
CriticalPath.prototype = {
    visible: false,

    init: function () {
        var me = this,
            gantt = me.gantt;

        var orderProject = gantt.orderProject;
        gantt.orderProject = function () {
            orderProject.apply(this, arguments);
            me.createCriticalPath();
        }
    },

    setVisible: function (value) {
        this.visible = value;
        this.gantt.setShowCriticalPath(value);
        this.gantt.refresh();
    },

    createCriticalPath: function () {
        var me = this,
            gantt = me.gantt,
            tasks = gantt.getTaskList();

        //准备：构建hash，快速检索
        me.taskHash = {};
        for (var i = 0, l = tasks.length; i < l; i++) {
            var task = tasks[i];
            me.taskHash[task.UID] = task;

            //额外处理任务日期、工期（里程碑任务为1天）
            task._start = this.clearTime(task.Start);
            task._finish = this.maxTime(task.Finish);
            task._duration = task.Duration || 1;
        }

        //准备：创建后置任务关系
        me.successors = {};
        for (var i = 0, l = tasks.length; i < l; i++) {
            var task = tasks[i];
            var links = task.PredecessorLink;
            if (links != null && links.length > 0) {
                for (var j = 0, k = links.length; j < k; j++) {
                    var link = links[j];
                    var preTask = me.taskHash[link.PredecessorUID];
                    if (preTask != null) {
                        var successors = me.successors[preTask.UID];
                        if (!successors) {
                            successors = me.successors[preTask.UID] = [];
                        }

                        link.TaskUID = task.UID;
                        successors.push(link);
                    }
                }
            }
        }

        //1) 最早开始、最早完成
        for (var i = 0, l = tasks.length; i < l; i++) {
            var task = tasks[i];
            var start = me.getEarlyStartByPredecessor(task);

            task.EarlyStart = start;
            task.EarlyFinish = this.maxTime(me.addDuration(task.EarlyStart, task._duration - 1));
        }

        //2) 最晚开始、最晚完成
        for (var i = 0, l = tasks.length; i < l; i++) {
            var task = tasks[i];
            var finish = me.getLateFinishBySuccessor(task);

            task.LateFinish = finish;
            task.LateStart = this.clearTime(me.addDuration(finish, -task._duration + 1));
        }

        //3) 最早开始 - 最早完成，小于1天，是关键任务
        for (var i = 0, l = tasks.length; i < l; i++) {
            var task = tasks[i];

            task.Critical = 0;
            if (task.LateStart - task.EarlyStart <= 0) {
                task.Critical = 1;
            }
        }

    },

    addDuration: function (date, duration) {
        date = new Date(date.getTime());
        date.setDate(date.getDate() + duration);
        return date;
    },

    clearTime: function (date) {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        return date;
    },

    maxTime: function (date) {
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
        return date;
    },

    //从前置任务中获取最早开始日期
    getEarlyStartByPredecessor: function (task) {
        var me = this,
            links = task.PredecessorLink,
            earlyStart;

        if (links) {

            for (var i = 0, l = links.length; i < l; i++) {
                var link = links[i];
                var preTask = this.taskHash[link.PredecessorUID];
                if (preTask == null || !preTask._start || !preTask._finish) continue;

                var start = preTask._start,
                finish = preTask._finish;

                switch (link.Type) {
                    case 0:     //完成-完成(FF)
                        start = this.clearTime(this.addDuration(finish, task._duration));
                        break;
                    case 1:     //完成-开始(FS)                       
                        start = this.clearTime(this.addDuration(finish, 1));
                        break;
                    case 2:     //开始-完成(SF)
                        finish = this.maxTime(this.addDuration(start, -1));
                        start = this.clearTime(this.addDuration(finish, task._duration));
                        break;
                    case 3:     //开始-开始(SS)
                        start = start;
                        break;
                }

                var linkLag = link.LinkLag || 0;
                if (linkLag != 0) {
                    start = this.addDuration(start, linkLag);
                }

                if (earlyStart == null || earlyStart.getTime() < start.getTime()) {
                    earlyStart = start;
                }
            }
        }

        if (!earlyStart) earlyStart = task._start;

        return earlyStart;
    },

    //从后置任务中获取最晚完成日期
    getLateFinishBySuccessor: function (task) {
        var me = this,
            successors = me.successors[task.UID],
            lateFinish;

        if (successors) {

            for (var i = 0, l = successors.length; i < l; i++) {
                var link = successors[i];
                var succTask = this.taskHash[link.TaskUID];
                if (succTask == null || !succTask._start || !succTask._finish) continue;

                var start = succTask._start,
                finish = succTask._finish;

                switch (link.Type) {        //要反过来
                    case 0:     //完成-完成(FF)
                        finish = finish;
                        break;
                    case 1:     //完成-开始(FS)                  
                        start = this.addDuration(start, -1);
                        finish = this.maxTime(start);
                        break;
                    case 2:     //开始-完成(SF)
                        finish = this.addDuration(finish, 1);
                        start = this.clearTime(finish);
                        finish = this.maxTime(this.addDuration(start, task._duration));
                        break;
                    case 3:     //开始-开始(SS)
                        finish = this.maxTime(this.addDuration(start, task._duration));
                        break;
                }

                var linkLag = link.LinkLag || 0;
                if (linkLag != 0) {
                    finish = this.addDuration(finish, -linkLag);
                }

                if (lateFinish == null || lateFinish.getTime() > finish.getTime()) {
                    lateFinish = finish;
                }
            }
        }

        if (!lateFinish) lateFinish = task._finish;

        return lateFinish;
    }
}
