import React from 'react';

export default function ModelStepItem(props_) {

  let children = props_.children;

  return (
    <>
      {
        React.Children.map(children, function (child) {
          if(child != null) {
            return <> {child} </>
          }
          return <></>
        })
      }
    </>
  );
}
