import React from 'react';
import PublicTable from '../../../components/PublicTable';
import { connect } from 'react-redux';
import { changeMenuTheme } from '@/store/menuTheme/action';
function MainContent  (props){

  function getHeight(){
    //初始化css样式
    let h = document.documentElement.clientHeight || document.body.clientHeight;   //浏览器高度，用于设置组件高度
    return h - 192;
  }
  // 高度
  let height = getHeight();
  let {children,contentWidth,contentMinWidth,initLayoutWidth,surplusWidth,menuTheme} = props;
  let leftMenuWidth = 0
  if(menuTheme.menuType == 'colTheme'){
    leftMenuWidth = 0
  }else if(menuTheme.menuType == 'rowTheme-vertical'){
    leftMenuWidth = 200
  }else if(menuTheme.menuType == 'rowTheme-inline'){
    leftMenuWidth = 80
  }
  surplusWidth = surplusWidth || 0;
  contentWidth = contentWidth && contentWidth >0 ? contentWidth : initLayoutWidth;
  contentWidth = contentWidth - surplusWidth - leftMenuWidth;
  let newProps = {...props,layout_ : { contentHeight: height,contentWidth ,contentMinWidth}};
  delete(newProps["children"]);

  return (
    <>
      {
        React.Children.map(children, function (child) {

          if(child != null && child.type === PublicTable){
             let p = {...newProps,mainContent:true}
             let newReact = React.cloneElement(child, p);
             return <>{newReact} </>;
          }else if(child != null && child.type === MainContent){
            let newReact = React.cloneElement(child, newProps || {});
            return <>{newReact} </>;
          }
          return <>{child}</>;
        })
      }
    </>
  );
}
export default connect(
  state => ({
    menuTheme:state.menuTypeData
  }),
  {
    changeMenuTheme
  }
)(MainContent);