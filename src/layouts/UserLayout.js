import { Icon } from 'antd';
import { Link, Route, Switch } from 'dva/router';
import React, { Fragment } from 'react';
import DocumentTitle from 'react-document-title';

import logo from '../assets/logo.svg';
import GlobalFooter from '../components/GlobalFooter';
import { getRoutes } from '../utils/utils';
import styles from './UserLayout.less';

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '图片管理Demo';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 图片管理Demo`;
    }
    return title;
  }

  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>图片管理Demo</span>
                </Link>
              </div>
            </div>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route key={item.key} path={item.path} component={item.component} exact={item.exact} />
              ))}
            </Switch>
          </div>
          <GlobalFooter
            copyright={
              <Fragment>
                Copyright <Icon type="copyright" /> 2018 图片管理Demo
              </Fragment>
            }
          />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
