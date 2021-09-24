import React from 'react';
import LeftContent from './LeftContent'
import MainContent from './MainContent'
import ExtContent from './ExtContent'
import Toolbar from './Toolbar'
import RightTags from "../../public/RightTags"
import mstyle from './style/mstyle.less'
import lstyle from './style/lstyle.less'

export default function ExtLayout(props_) {

  let children = props_.children;
  let RightTags_ = null,Toolbar_ = null,LeftContent_ = null,MainContent_ = null,ExtContent_ = null;  // 高度
  let height = getHeight();

  /**
   * 获取布局子节点
   *
   */
  function getLayoutChildren () {

    React.Children.forEach(children, function (child) {
      if(child != null){
        if(child.type === MainContent){
          MainContent_ = child;
        }else if(child.type === LeftContent){
          LeftContent_ =child;
        }else if(child.type === RightTags){
          RightTags_ = child;
        }else if(child.type === Toolbar){
          Toolbar_ = child;
        }else if (child.type === ExtContent){
          ExtContent_ = child;
        }
      }
    });
  }

  function addNewProps(props = {}){

    if(MainContent_){
      let surplusWidth = 0;
      if(LeftContent_){
        let {width} = LeftContent_.props;
        surplusWidth = width + 10;
      }
      MainContent_ = React.cloneElement(MainContent_,{...props,surplusWidth});
    }
    if(LeftContent_){
      LeftContent_ = React.cloneElement(LeftContent_,props);
    }

    if(ExtContent_){
      ExtContent_ = React.cloneElement(ExtContent_,props);
    }

    if(RightTags_){
      const {renderWidth} = props || {};
      RightTags_ =  React.cloneElement(RightTags_,{ renderWidth : renderWidth, height : height + "px"});
    }

  }

  function getHeight(){
    //初始化css样式
    let h = document.documentElement.clientHeight || document.body.clientHeight;   //浏览器高度，用于设置组件高度
    return h - 190;
  }

  function getLayoutInitWidth (){
    return (document.documentElement.clientWidth || document.body.clientWidth)-40;
  }

  // 内容高度
  let contentHeight = height;
  let initLayoutWidth = getLayoutInitWidth();
  //
  let newProps = {...props_,initLayoutWidth : initLayoutWidth, layout_ : {contentHeight : contentHeight}};
  delete(newProps["children"]);
  // 获取组件
  getLayoutChildren(newProps);
  addNewProps(newProps);

  return (
    <>
      {
        ExtContent_ != null && (
          <div>
            { Toolbar_}
            { ExtContent_ }
            {
              React.Children.map(children, function (child) {
                if(child != null) {
                  if (child.type != MainContent && child.type != LeftContent && child.type != RightTags && child.type != Toolbar && child.type != ExtContent) {
                    return <> {child} </>
                  }
                }
                return <></>
              })
            }
          </div>
        )
      }
      {
        LeftContent_ != null && ExtContent_ == null && (
          <div>
            <div className={lstyle.main}>
              <div className={lstyle.leftMain}>
                <div className={lstyle.leftbox}>
                  {LeftContent_ }
                </div>
                <div className={lstyle.rightbox}>
                  { Toolbar_}
                  <div className = {lstyle.tableContent}>
                    <div className={lstyle.tablescroll}>
                      {MainContent_ }
                    </div>
                    <div className={lstyle.rightBox} height = {height + "px"}>
                      {RightTags_ }
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {
              React.Children.map(children, function (child) {
                if(child != null) {
                  if (child.type != MainContent && child.type != LeftContent && child.type != RightTags && child.type != Toolbar) {
                    return <> {child} </>
                  }
                }
                return <></>
              })
            }

          </div>
        )
      }

      {
        LeftContent_ == null && ExtContent_ == null && (
          <div>
            { Toolbar_}
            <div className={mstyle.main}>
              <div id = {"layout-content"} className={mstyle.leftMain} >
                <div>
                  {MainContent_ }
                </div>
              </div>
              <div className={mstyle.rightBox} height = {height + "px"}>
                {RightTags_ }
              </div>
            </div>
            {
              React.Children.map(children, function (child) {
                if(child != null) {
                  if (child.type != MainContent && child.type != LeftContent && child.type != RightTags && child.type != Toolbar) {
                    return <> {child} </>
                  }
                }
                return <></>
              })
            }
          </div>
        )
      }




    </>
  );
}
