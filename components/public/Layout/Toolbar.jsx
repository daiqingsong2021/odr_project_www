import React from 'react';


export default function Toolbar(props){

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
