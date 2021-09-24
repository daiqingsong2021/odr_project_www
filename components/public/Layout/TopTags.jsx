import React from 'react';
import style from "./style/toptagstyle.less";

export default function Toolbar(props){

  let {children} = props || {};

  return (
    <>
      <div className={style.main}>
        <div className={style.tabMenu}>
          {
            React.Children.map(children, function (child) {
              return <>{child}</>;
            })
          }
        </div>
      </div>
    </>
  );
}
