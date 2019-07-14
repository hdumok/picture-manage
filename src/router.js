import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { Route, routerRedux, Switch } from 'dva/router';
import React from 'react';

import { getRouterData } from './common/router';
import Authorized from './utils/Authorized';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const UserLayout = routerData['/user'].component;
  const BasicLayout = routerData['/'].component;
  return (
    <LocaleProvider locale={zhCN}>
      <ConnectedRouter history={history}>
        <Switch>
          <Route path="/user" component={UserLayout} />
          <AuthorizedRoute path="/" render={props => <BasicLayout {...props} />} authority={['admin']} />
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;
