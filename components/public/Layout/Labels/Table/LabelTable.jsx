import React from 'react';
import PublicTable from "../../../../PublicTable";
import * as layoutUtil from "../../layoutUtil";

export default function LabelTable(props){

  function getHeight(){
    //初始化css样式
    let h = document.documentElement.clientHeight || document.body.clientHeight;   //浏览器高度，用于设置组件高度
    return h - 280;
  }

  // 高度
  let height = getHeight();
  let {children,contentMinWidth,surplusHeight,contentWidth,labelTableItemNum,defaultSurplusHeight} = props;

  if(!labelTableItemNum || labelTableItemNum == 0){
    //
    let renderWidth = layoutUtil.getLabelsWidthByMenuCode(props.menuCode);
    contentWidth = renderWidth - 40;
    // contentWidth = contentWidth && contentWidth > 0 ? contentWidth : labelWidth-40;
  }
  surplusHeight = surplusHeight || 0;
  // 系统默认高度差
  surplusHeight += (defaultSurplusHeight || 0);
  let newProps = {...props,layout_ : { contentHeight: (height - surplusHeight),contentWidth :contentWidth, contentMinWidth: contentMinWidth }};
  delete(newProps["children"]);

  return (
    <>
      {
        React.Children.map(children, function (child) {

          if(child != null && child.type === PublicTable){
            let newReact = React.cloneElement(child, newProps || {});
            return <>{newReact} </>;
          }

          return <>{child}</>;
        })
      }
    </>
  );
}
