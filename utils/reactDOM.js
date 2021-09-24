
//实现dom挂载到页面某个元素
const ReactDOM = {

  render : ( vnode, container ) => {
    return container.appendChild( _render( vnode ) );
  },
  _render :( vnode )=>{
    if ( typeof vnode === 'number' ) {
      vnode = String( vnode );
    }
    //处理文本节点
    if( typeof vnode === 'string'){
      const textNode = document.createTextNode( vnode )
      return textNode;
    }
    //处理组件
    if ( typeof vnode.tag === 'function' ) {
      const component = createComponent( vnode.tag, vnode.attrs );
      setComponentProps( component, vnode.attrs );
      return component.base;
    }
    //普通的dom
    const dom = document.createElement( vnode.tag );
    if( vnode.attrs ){
      Object.keys( vnode.attrs ).forEach( key => {
        const value = vnode.attrs[ key ];
        setAttribute( dom, key, value );    // 设置属性
      });
    }
    vnode.children.forEach( child => render( child, dom ) );    // 递归渲染子节点
    return dom ;    // 返回虚拟dom为真正的DOM
  },

  _toDomHtmlRender :( vnode )=>{
    if ( typeof vnode === 'number' ) {
      vnode = String( vnode );
    }
    //处理文本节点
    if( typeof vnode === 'string'){
      return vnode;
    }
    //处理组件
    if ( typeof vnode.tag === 'function' ) {
      const component = createComponent( vnode.tag, vnode.attrs );
      setComponentProps( component, vnode.attrs );
      return component.base;
    }
    //普通的dom
    const dom = document.createElement( vnode.tag );
    if( vnode.attrs ){
      Object.keys( vnode.attrs ).forEach( key => {
        const value = vnode.attrs[ key ];
        setAttribute( dom, key, value );    // 设置属性
      });
    }
    vnode.children.forEach( child => render( child, dom ) );    // 递归渲染子节点
    return dom ;    // 返回虚拟dom为真正的DOM
  },
  toDomHtmlRender : ( vnode, container ) => {
    return container.appendChild( this._toDomHtmlRender( vnode ) );
  },

  toDom: ( vnode, container ) => {
    container.innerHTML = '';
    return this.render( vnode, container );
  },
  toDomHtml : (vnode)=>{

  }
}
