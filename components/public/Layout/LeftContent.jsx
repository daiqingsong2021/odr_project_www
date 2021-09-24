import React from 'react';
import PublicTable from '../../../components/PublicTable';
import Toolbar from './Toolbar'
import mstyle from './style/mstyle.less'
export default function LeftContent  (props){

  function getHeight(){
    //初始化css样式
    let h = document.documentElement.clientHeight || document.body.clientHeight;   //浏览器高度，用于设置组件高度
    return h - 150;
  }

  // 高度
  let height = getHeight();
  let {children,width} = props;

  let newProps = {...props,layout_ : { contentHeight: height,contentWidth:width}};
  delete(newProps["children"]);

  return (
    <>
      {
        React.Children.map(children, function (child) {

          if(child != null && child.type === PublicTable){
             let newReact = React.cloneElement(child, newProps || {});
             return <>{newReact} </>;
          }else if(child != null && child.type === Toolbar){
            return <div style={{display:"flex",display:'-ms-flexbox',margin:10}} className={mstyle.btnBox}>{child}</div>
          }

          return <>{child}</>;
        })
      }
    </>
  );
}
