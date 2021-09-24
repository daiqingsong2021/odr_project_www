import 'babel-polyfill'
import 'es6-promise'
import 'core-js/es6/map';
import 'core-js/es6/set'
import Head from 'next/head'
// import 'antd/dist/antd.less'
import React, { Component } from 'react'
import emitter from '../api/ev'

import style from './layout.less'
//import Auth from "../components/Auth";
import QueueAnim from 'rc-queue-anim';
export default class Layout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  componentWillMount() {
    emitter.addListener('loading', (loading) => {
      this.setState({ loading: loading })
    })
  }

  render() {
    const { props } = this
    const { children } = props
    return (
      <div>
        <Head>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta charSet='utf-8' />
          {/*<link rel='stylesheet' href='/_next/static/style.css' />*/}
          <title>哈尔滨运营日报管理系统</title>
          <meta name="renderer" content="webkit" />
          <meta name="force-rendering" content="webkit" />
          <meta httpEquiv="X-UA-Compatible" content="IE=Edge,chrome=1" />
          <script src="/static/plusgantt/scripts/jquery.min.js" type="text/javascript" ></script>
          <script src='/static/plusgantt/demo/js/ProgressLine.js' ></script>
          <link rel="stylesheet" href="/static/css/antd.css" />
          {/* [if lt IE 10]>
            <script src="https://npmcdn.com/es5-shim@4.5.8/es5-shim.js"></script>
            <script src="https://npmcdn.com/es5-shim@4.5.8/es5-sham.js"></script>
            <script src="https://as.alipayobjects.com/g/component/??console-polyfill/0.2.2/index.js,html5shiv/3.7.2/html5shiv.min.js,media-match/2.0.2/media.match.min.js"></script>
            <script src="https://npmcdn.com/jquery@1.x"></script>
          <![endif] */}
          <link href='/static/plusgantt/demo/js/ProgressLine.css' rel="stylesheet" type="text/css" />
          <link href="/static/plusgantt/scripts/miniui/themes/default/miniui.css" rel="stylesheet" type="text/css" />
          <link href="/static/images/heb/heb_icon.png" rel="icon" />
          <link rel="icon" href="data:image/ico;base64,aWNv"></link>
          <script src="/static/plusgantt/scripts/miniui/miniui.js" type="text/javascript" ></script>
          <script src="/static/acmPlusGantt/locale/zh_CN.js" type="text/javascript" ></script>
          <link href="/static/less/ganttDefault.css" rel="stylesheet" type="text/css" />
          <script src="/static/plusgantt/scripts/plusgantt/GanttMenu.js" type="text/javascript" ></script>
          <script src="/static/plusgantt/scripts/plusgantt/GanttSchedule.js" type="text/javascript" ></script>
          <script src="/static/plusgantt/scripts/plusgantt/GanttService.js" type="text/javascript" ></script>
          <script type="text/javascript" src="/static/map/api.map.baidu.js?v=2.0&ak=Yhym4BqyDDKYN0V72ieirY4UuKOhqooB" defer ></script>
          <script type="text/javascript" src="/static/map/react-bmap.min.js" defer ></script>
          {/* <script type="text/javascript" src="/static/pdfjs/pdf.js" defer ></script> */}
          <script type="text/javascript" src="/static/js/history.min.js" defer ></script>
          {/* <script src="https://cdn.bootcss.com/echarts/4.1.0/echarts.min.js"></script> */}
		      {/* <script src="http://gallery.echartsjs.com/dep/echarts/map/js/china.js"></script> */}
        </Head>
        <div className="main">
          {children}
        </div>
        <QueueAnim className="demo-content"
          animConfig={[
            { opacity: [1, 0], translateY: [0, -50] }
          ]}>
          {this.state.loading && (
            <div className={style.loadingBox} key={'a'}>
              <div className={style.loadBg}>
                <img src='../../static/images/loading.gif' />
                loading....
              </div>
            </div>
          )}
        </QueueAnim>

      </div>

    )
  }
}


/* export default ({ children }) =>

  <div>
    <Head>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta charSet='utf-8' />
      <link rel='stylesheet' href='/_next/static/style.css' />
    </Head>
    <div className={layout.example}>布局1
      {children}
    </div>
  </div>
 */
