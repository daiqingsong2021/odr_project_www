import React from 'react';
import LabelFormButton from './LabelFormButton'
import { Form, Row, Col} from 'antd'
import style from "./style.less";

export default function LabelFormLayout(props_) {

  let children = props_.children;
  let Form_ = null,LabelFormButton_ = null;  // 高度

  /**
   * 获取布局子节点
   *
   */
  function getLayoutChildren () {

    React.Children.forEach(children, function (child) {

      if(child != null){
        if(child.type === Form){
          Form_ = child;
        }else if(child.type === LabelFormButton){
          LabelFormButton_ = child;
        }
      }
    });
  }
  // 获取组件
  getLayoutChildren();

  let {title} = props_;

  return (
    <>
      <div className={style.main}>
        {/* <h3 className={style.listTitle}>{title}</h3> */}
        <div className={style.mainScorll} >
          <div className={style.content}>
            {Form_}
          </div>
        </div>
        <div className={style.mybtn}>
          <Row>
            <Col span={24}>
              <Col offset={4}>
                {LabelFormButton_}
              </Col>
            </Col>
          </Row>
        </div>
      </div>
      {
        React.Children.map(children, function (child) {
          if(child != null) {
            if (child.type != Form && child.type != LabelFormButton) {
              return <> {child} </>
            }
          }
          return <></>
        })
      }

    </>
  );
}
