import { Alert } from 'antd';
import Login from 'components/Login';
import { connect } from 'dva';
import React, { Component } from 'react';

import styles from './Login.less';

const { Tab, UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {};

  handleSubmit = (err, values) => {
    const { dispatch } = this.props;
    if (!err) {
      dispatch({
        type: 'login/login',
        payload: values,
      });
    }
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { login, submitting } = this.props;
    return (
      <div className={styles.main}>
        <Login defaultActiveKey="account" onSubmit={this.handleSubmit}>
          <Tab key="account" tab="管理员登录">
            {login.status === 'error' && login.type === 'account' && !submitting && this.renderMessage('账户或密码错误')}
            <UserName name="account" placeholder="admin" />
            <Password name="password" placeholder="123456" />
          </Tab>
          <Submit loading={submitting}>登录</Submit>
        </Login>
      </div>
    );
  }
}
