import React from 'react';
import { Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

export default function BFooter(props_) {

  let {children,height,layout_} = props_;
  let style = {overflow:"auto",background:"white"};
  if(height){
    style["height"] = height+"px";
  }
  return (
    <Footer style = {style}>
      {
        React.Children.map(children, function (child) {
          if(child != null) {
            let newReact = React.cloneElement(child,{layout_:layout_ || {}});
            return <> {newReact} </>
          }
          return <></>
        })
      }
    </Footer>
  );
}
