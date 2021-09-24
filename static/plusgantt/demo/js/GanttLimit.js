function GanttLimit(gantt) {
    var ganttView = gantt.ganttView;

    function getLimitStart(item) {
        //var limitStart = new Date(2017, 2, 19);
        var limitStart = item.LimitStart;
        limitStart = mini.clearTime(limitStart);
        return limitStart;
    }

    function getLimitFinish(item) {
        //var limitFinish = new Date(2017, 3, 5);
        var limitFinish = item.LimitFinish;
        limitFinish = mini.maxTime(limitFinish);
        return limitFinish;
    }

    ganttView.on('itemdragmove', function (e) {
        //document.title = e.action + new Date().getTime();
        //document.title = e.item.Start.getTime();
        var item = e.item;
        var limitStart = getLimitStart(item);
        var limitFinish = getLimitFinish(item);

        if (e.action == 'move') {
            if (limitStart && item.Start < limitStart) {
                var timeSpan = item.Finish - item.Start;
                item.Start = new Date(limitStart.getTime());
                item.Finish = new Date(item.Start.getTime() + timeSpan);
            }
            if (limitFinish && item.Finish > limitFinish) {
                var timeSpan = item.Finish - item.Start;
                item.Finish = new Date(limitFinish.getTime());
                item.Start = new Date(item.Finish.getTime() - timeSpan);
            }
        } else if (e.action == 'finish') {
            if (limitFinish && item.Finish > limitFinish) {
                item.Finish = new Date(limitFinish.getTime());
            }
        }

        renderLimitLine(item);
    });

    ///////////////////////////////////////////////////////////////////////////////

    var container = $(ganttView.el).find(".mini-ganttview-viewport");
    function renderLimitLine(item) {
        if (item._renderLimit) return;
        item._renderLimit = true;

        var limitStart = getLimitStart(item);
        var limitFinish = getLimitFinish(item);

        var html = '';

        var viewBox = ganttView.getViewportBounds(ganttView.viewRegion);
        var rowHeight = gantt.rowHeight;

        if (limitStart) {
            var left = ganttView.getOffsetByDate(limitStart) - viewBox.left - 1;
            var top = ganttView.getItemTop(item) - viewBox.top;
            html += '<div class="limitline" style="position:absolute;left:' + left + 'px;top:' + top + 'px;width:2px;height:' + rowHeight + 'px;background:red;overflow:hidden;z-index:10000;"></div>';
        }
        if (limitFinish) {
        
            var left = ganttView.getOffsetByDate(limitFinish) - viewBox.left - 1;
            var top = ganttView.getItemTop(item) - viewBox.top;
            html += '<div class="limitline" style="position:absolute;left:' + left + 'px;top:' + top + 'px;width:2px;height:' + rowHeight + 'px;background:red;overflow:hidden;z-index:10000;"></div>';
        }

        container.append(html);
    }

    ganttView.on('itemdragcomplete', function (e) {
        var item = e.item;
        delete item._renderLimit;
        container.find(".limitline").remove();
        //alert("complete");
    });
}