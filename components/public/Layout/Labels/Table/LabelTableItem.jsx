import React from 'react';
import style from "./itemstyle.less";
import LabelTable from "./LabelTable";
import LabelToolbar from "./LabelToolbar";

export default function LabelTableItem(props_){

  let children = props_.children;
  let LabelTable_ = null,LabelToolbar_ = null;
  /**
   * 获取布局子节点
   *
   */
  function getLayoutChildren (props) {

    React.Children.forEach(children, function (child) {

      if(child != null){
        if(child.type === LabelTable){
          let newReact = React.cloneElement(child, props || {});
          LabelTable_ = newReact;
        }else if(child.type === LabelToolbar){
          LabelToolbar_ = child;
        }
      }
    });
  }

  let {title,contentWidth} = props_;
  let width = contentWidth + "px";
  let newContentWidth = contentWidth - 40;
  let newProps = {...props_,surplusHeight : 20, contentWidth : newContentWidth};
  delete (newProps["children"]);
  // 获取组件
  getLayoutChildren(newProps);



  return (
    <>
      <div className={style.cotent} style = {{width : width }}>
        <h3 className={style.listTitle}><p>{title }</p></h3>
        <div className={style.listIcon}>
          {LabelToolbar_ }
        </div>
        <div>
          {LabelTable_ }
        </div>
      </div>
        {
          React.Children.map(children, function (child) {
            if(child != null && ( child.type === LabelTable || child.type === LabelToolbar)){
              return <></>;
            }
            return <>{child}</>;
          })
        }
    </>
  );
}
