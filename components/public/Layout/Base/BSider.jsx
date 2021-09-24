import React from 'react';
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

export default function BSider(props_) {
  //debugger;
  let {children,layout_} = props_;
  let style = {overflow:"auto",background:"white"};
  let {width} = layout_ || {};
  if(width){
    style["width"] = width+"px";
  }
  return (
    <Sider width={width+"px"} style = {style}>
      {
        React.Children.map(children, function (child) {
          if(child != null) {
            let newReact = React.cloneElement(child,{layout_:layout_ || {}});
            return <> {newReact} </>
          }
          return <></>
        })
      }
    </Sider>
  );
}
