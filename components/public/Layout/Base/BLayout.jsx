import React from 'react';
import { Layout } from 'antd';
import BHeader from "./BHeader";
import BSider from "./BSider";
import BFooter from "./BFooter";
import BContent from "./BContent";
import * as layoutUtil from "../layoutUtil"

export default function BLayout(props_) {

  let {layout_,children,surplusWidth} = props_;

  let {width,height} = layout_ || {};

  surplusWidth = layoutUtil.getNumber(surplusWidth,width);
  if(surplusWidth > 0){
    width -= surplusWidth;
  }
  function getLayoutChildren () {
    if(layout_){
      let heightArr = new Array();
      let widthArr = new Array();
      let contentHeight,contentWidth;
      React.Children.forEach(children, function (child) {
        if(child != null){
          if(child.type === BHeader || child.type === BFooter ){
            heightArr.push(child.props.height);
          }else if(child.type === BSider){
            widthArr.push(child.props.width);
          }else if(child.type === BContent || child.type === BLayout){
            contentHeight =  layoutUtil.getNumber(child.props.height,height) ;
            contentWidth = layoutUtil.getNumber(child.props.width,width);
          }
        }
      });
      let newHeight = height,newWidth = width;
      if(heightArr){
        for(let i = 0, len = heightArr.length; i < len; i++){
          let hei = heightArr[i];
          newHeight -= layoutUtil.getNumber(hei,height);
        }
      }

      if(widthArr){
        for(let i = 0, len = widthArr.length; i < len; i++){
          let wid = widthArr[i];
          newWidth -= layoutUtil.getNumber(wid,width);
        }
      }
      newHeight = contentHeight || newHeight;
      newWidth = contentWidth || newWidth;
      return {...layout_,height : newHeight,width: newWidth,contentWidth:newWidth,contentHeight : newHeight,contentMinWidth:newWidth};
    }

    return layout_;
  }
  // 获取组件
  let newLayout_ = getLayoutChildren();
  let newProps = {layout_: newLayout_};
  return (
    <Layout style={{background:"white"}}>
      {
        React.Children.map(children, function (child) {
          if(child != null) {
            if(child.type === BContent || child.type === BLayout){
              let newReact = React.cloneElement(child,{...newProps});
              return <> {newReact} </>
            }else if(child.type === BSider){
              let win = child.props.width;
              let newWin = layoutUtil.getNumber(win,width);
              let newHei = height;
              let newReact = React.cloneElement(child,{layout_:{width:newWin,height:newHei,contentWidth:newWin,contentHeight : newHei,contentMinWidth:newWin}});
              console.log("newReact",newReact);
              return <>{newReact}</>
            }else if(child.type === BHeader || child.type === BFooter){
              let hei = child.props.height;
              let newHei = layoutUtil.getNumber(hei,height);
              let newWin = width;
              let newReact = React.cloneElement(child,{layout_:{width:newWin,height:newHei,contentWidth:newWin,contentHeight : newHei,contentMinWidth:newWin}});
              return <>{newReact}</>
            }
          }
          return <></>
        })
      }
    </Layout>
  );
}
