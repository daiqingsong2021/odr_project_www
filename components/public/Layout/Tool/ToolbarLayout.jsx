import React from 'react';
import ToobarLeft from './ToolbarLeft'
import ToobarRight from './ToolbarRight'
import style from './style.less'

export default function ToolbarLayout(props_) {

  let children = props_.children;
  let ToobarLeft_ = null, ToobarRight_ = null;

  /**
   * 获取布局子节点
   *
   */
  function getLayoutChildren () {

    React.Children.forEach(children, function (child) {
      if(child != null){
        if(child.type === ToobarLeft){
          ToobarLeft_ = child;
        }else if(child.type === ToobarRight){
          ToobarRight_ = child;
        }
      }
    });
  }
  // 获取组件
  getLayoutChildren(props_);

  return (
    <>
      <div className={style.main}>
        <div className={style.search}>
          {ToobarRight_ }
        </div>
        <div className={style.tabMenu}>
          {ToobarLeft_ }
        </div>
      </div>
      {
        React.Children.map(children, function (child) {
          if(child != null) {
            if (child.type != ToobarLeft && child.type != ToobarRight) {
              return <> {child} </>
            }
          }
          return <></>
        })
      }
    </>
  );
}
