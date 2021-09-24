import React from 'react';
import { Layout } from 'antd';
import PublicTable from "../../../PublicTable";

const {Content } = Layout;

export default function BContent(props_) {

  let {layout_,children,contentMinWidth,overflowX,overflowY} = props_;
  let {width,height} = layout_ || {};

  if(layout_){

    layout_ = {...layout_,contentHeight:height,contentWidth: width,contentMinWidth: contentMinWidth || width};
  }
  overflowX = overflowX || "auto";
  overflowY = overflowY || "auto";
  let newProps = {layout_};
  return (
    <Content width={width+"px"} style = {{overflowX:overflowX,overflowY:overflowY,background:"white",width:width+"px"}}>
      {
        React.Children.map(children, function (child) {
          if(child.type == PublicTable){
            let newReact = React.cloneElement(child,{...newProps});
            return <> {newReact} </>
          }else{
            let newReact = React.cloneElement(child,{...newProps});
            return <> {newReact} </>
          }
          return <></>
        })
      }
    </Content>
  );
}
