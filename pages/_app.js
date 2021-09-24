import 'babel-polyfill'
import 'es6-promise'
import 'core-js/es6/map';
import 'core-js/es6/set'
import App, { Container } from 'next/app';
import { Provider } from 'react-redux';
// import withReduxSaga from '../redux/withReduxSaga'
import React from 'react';

import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import en_US from 'antd/lib/locale-provider/en_US';
import moment from 'moment';
import Layout from '../layouts/layout';
import 'moment/locale/zh-cn';
import '../asserts/antd-custom.less';

import store from '../store';


import '../static/fonts/safont/iconfont.css';

moment.locale('zh-cn');

class GlobalApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }
  
  render() {
    const  language =store.getState().localeProviderData.currentLocale
    const { Component, pageProps } = this.props;
    return <Container>
      <Provider store={store}>
        <LocaleProvider locale={language=="zh-CN"?zh_CN:en_US}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </LocaleProvider>
      </Provider>
    </Container>;
  }
}

// export default withReduxSaga(GlobalApp)
export default GlobalApp;
