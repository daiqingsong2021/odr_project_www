import React from 'react';
import style from "./style.less";
import itemstyle from "./itemstyle.less";
import LabelToolbar from "./LabelToolbar";
import LabelTable from "./LabelTable";
import LabelTableItem from "./LabelTableItem";
import * as layoutUtil from "../../layoutUtil";


export default function LabelTableLayout(props_) {

  let children = props_.children;
  let LabelTable_ = null,LabelToolbar_ = null,LabelTableItem_ = null;
  let labelTableItemNum = 0;
  /**
   * 获取布局子节点
   *
   */
  function getLayoutChildren () {

    React.Children.forEach(children, function (child) {

      if(child != null){
        if(child.type === LabelTable){
          LabelTable_ = child;
        }else if(child.type === LabelToolbar){
          LabelToolbar_ = child;
        }else if(child.type == LabelTableItem){
          LabelTableItem_ = LabelTableItem;
          labelTableItemNum ++;
        }
      }
    });
  }
  let renderWidth = layoutUtil.getLabelsWidthByMenuCode(props_.menuCode);
  // 生成随机ID
  let labelId = Date.now();
  // 获取组件
  getLayoutChildren();
  let itemWidth = 0;
  if(labelTableItemNum > 0){
    itemWidth = (renderWidth / labelTableItemNum);
  }else{
    itemWidth = renderWidth;
  }

  let surplusHeight = props_.surplusHeight || 0;
  if(LabelTableItem_ == null && LabelToolbar_ == null){
    surplusHeight = -30;
  }

  if(LabelTable_ != null){
    LabelTable_ = React.cloneElement(LabelTable_,{ menuCode:props_.menuCode,surplusHeight : surplusHeight,contentWidth : itemWidth,labelTableItemNum});
  }

  let {title} = props_;

  return (
    <>
      {
        LabelTableItem_ == null && (
          <div className={style.main}>
            {/* <h3 className={style.listTitle}>{title}</h3> */}
            <div className={style.rightTopTogs}>
              {LabelToolbar_ }
            </div>
            <div className={style.contentScorll }>
              {LabelTable_ }
            </div>
            {
              React.Children.map(children, function (child) {
                if(child != null) {
                  if (child.type != LabelToolbar && child.type != LabelTable) {
                    return <> {child } </>
                  }
                }
                return <></>
              })
            }
          </div>
        )
      }
      {
        LabelTableItem_ != null && (
          <div className={itemstyle.main}>
            {
              React.Children.map(children, function (child) {
                if(child != null) {
                  if (child.type != LabelToolbar && child.type != LabelTable) {
                    if(child.type == LabelTableItem){
                      let newReact = React.cloneElement(child, { contentWidth : itemWidth, labelTableItemNum : labelTableItemNum });
                      return <>{newReact} </>;
                    }
                    return <> {child} </>
                  }
                }
                return <> </>
              })
            }
          </div>
        )


      }





    </>
  );
}
