import React from 'react';
import {Modal, Steps, Button} from 'antd';
import ModelFooter from '../ModelFooter'
import ModelLayout from '../ModelLayout'
import ModelContent from '../ModelContent'
import ModelStepItem from './ModelStepItem'
import style from './style.less'

const Step = Steps.Step;

export default function ModelStepLayout(props_) {

  let children = props_.children;
  let max = 0;
  let items = new Array(),stepArr = new Array(),funcMaps = {},stepMap = {};
  /**
   * 获取布局子节点
   *
   */
  function getLayoutChildren () {
    React.Children.forEach(children, function (child) {
      if(child != null){
        if(child.type === ModelStepItem){
          max++;
          let { title,handleNext } = child.props || {};
          items.push(child);
          stepArr.push({title, handleNext, step : max});
          funcMaps[max] = handleNext;
        }
      }
    });
  }
  // 获取组件
  getLayoutChildren(props_);
  //
  let {stepData,title, handleCancel,handleStep,width } = props_;

  let {step,steped} = stepData || {};
  steped = steped || 1;
  step = step || 1;

  const toNext = function(isNext){
    if(isNext){
      if(step + 1 > steped){
        steped = step + 1;
      }
      handleStep({step:(step+1),steped});
    }
  }

  const handleStep_ = function(type){
    let fun = funcMaps[step];
    if(type == 'next'){
      if(step == max){
        if(fun){
          fun();
        }
      }else{
        let r = true;
        if(fun){
          fun(toNext);
        }else{
          toNext(true);
        }
      }
    }else{
      handleStep({step:step-1,steped});
    }
  };
  let index = 1;
  return (
    <>
      <ModelLayout title = {title} handleCancel = {handleCancel} width={width}>
          <ModelFooter>
          {
            step == 1 &&
            <>
              <Button key="back" onClick={handleCancel}>取消</Button>
              <Button key="3" type="primary" onClick = {handleStep_.bind(this,"next")}>下一步</Button>
            </>
          }
          {
            step > 1 && step < max &&
            <>
              <Button key="backone" onClick = {handleStep_.bind(this,"previous")} >上一步</Button>
              <Button key="3" type="primary" onClick = {handleStep_.bind(this,"next")} >下一步</Button>
            </>
          }
          {
            step == max &&
            <>
              <Button key="backone" onClick = {handleStep_.bind(this,"previous")}>上一步</Button>
              <Button key="3" type="primary" onClick = {handleStep_.bind(this,"next")}>提交</Button>
            </>
          }
        </ModelFooter>
        <ModelContent>

          <div className={style.steps}>
            <Steps size="small" current={step - 1}>
              {
                stepArr.map(function (item) {
                  let {title,step} = item;
                  return <Step key={"step-"+step} title={title}/>
                })
              }
              <Step key={"last"} title="完成"/>
            </Steps>
          </div>

          {
            React.Children.map(children, function (child) {
              if(child != null) {
                if(child.type == ModelStepItem){
                  if(steped >= index){
                    if( step == index){
                      index++;
                      return <div> {child} </div>;
                    }else{
                      index++;
                      return <div style={{display:"none"}}> {child} </div>;
                    }
                  }
                  index++;
                }else{
                  return <div> {child} </div>;
                }
              }
              return <></>
            })
          }
        </ModelContent>

      </ModelLayout>
    </>
  );
}
