import React from 'react';
import {Modal, Form} from 'antd';
import ModelFooter from './ModelFooter'
import ModelContent from './ModelContent'
import style from './style.less'
import '../../../../asserts/antd-custom.less'

export default function ModelLayout(props_) {

  let children = props_.children;
  let ModelFooter_ = null, ModelContent_ = null;

  /**
   * 获取布局子节点
   *
   */
  function getLayoutChildren () {

    React.Children.forEach(children, function (child) {
      if(child != null){
        if(child.type === ModelFooter){
          ModelFooter_ = child;
        }else if(child.type === ModelContent){
          ModelContent_ = child;
        }
      }
    });
  }
  // 获取组件
  getLayoutChildren(props_);
  let {width , height, title, handleCancel} = props_;
  return (
    <>
      <div className={style.main}>
        <Modal className={style.formMain}
           width={width || "850px" }
           height = {height || "600px"}
           centered={true}
           mask={false}
           maskClosable={false}
           title={title }
           visible={true}
           onCancel={handleCancel }
           footer={
             <div className="modalbtn">
               {ModelFooter_}
             </div>
           }>
          {ModelContent_}
        </Modal>
        {
          React.Children.map(children, function (child) {
            if(child != null) {
              if (child.type != ModelFooter && child.type != ModelContent) {
                return <> {child} </>
              }
            }
            return <></>
          })
        }
      </div>
    </>
  );
}
