import React, { Component } from 'react';
import router from 'next/router'
//首页模块
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount(){
    router.push('/login')
  }
  render() {
    return (
      <div>

      </div>
    )
  }
}


export default Index
