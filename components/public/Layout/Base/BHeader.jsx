import React from 'react';
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

export default function BHeader(props_) {

  let {children,height,layout_} = props_;
  let style = {background:"white",lineHeight: "inherit",padding:"0",overflow:"auto"};
  if(height){
    style["height"] = height+"px";
  }


  return (
    <Header style = {style}>
      {
        React.Children.map(children, function (child) {
          if(child != null) {
            let newReact = React.cloneElement(child,{layout_:layout_ || {}});
            return <> {newReact} </>
          }
          return <></>
        })
      }
    </Header>
  );
}
