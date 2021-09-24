import React from 'react';

export default function LabelFormButton(props){

  let {children} = props || {};
  return (
    <>
      {
        React.Children.map(children, function (child) {
          return <>{child}</>;
        })
      }
    </>
  );
}
