import { Form, Tabs } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import styles from './index.less';
import LoginItem from './LoginItem';
import LoginSubmit from './LoginSubmit';
import LoginTab from './LoginTab';

class Login extends Component {
  static propTypes = {
    className: PropTypes.string,
    defaultActiveKey: PropTypes.string,
    onTabChange: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static childContextTypes = {
    tabUtil: PropTypes.object,
    form: PropTypes.object,
    updateActive: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    defaultActiveKey: '',
    onTabChange: () => {},
    onSubmit: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      type: props.defaultActiveKey,
      tabs: [],
      active: {},
    };
  }

  getChildContext() {
    const { tabs } = this.state;
    const { form } = this.props;
    return {
      tabUtil: {
        addTab: id => {
          this.setState({
            tabs: [...tabs, id],
          });
        },
      },
      form,
      updateActive: activeItem => {
        const { type, active } = this.state;
        if (active[type]) {
          active[type].push(activeItem);
        } else {
          active[type] = [activeItem];
        }
        this.setState({
          active,
        });
      },
    };
  }

  onSwitch = type => {
    const { onTabChange } = this.props;
    this.setState({
      type,
    });
    onTabChange(type);
  };

  handleSubmit = e => {
    e.preventDefault();
    const { active, type } = this.state;
    const { form, onSubmit } = this.props;
    const activeFileds = active[type];
    form.validateFields(activeFileds, { force: true }, (err, values) => {
      onSubmit(err, values);
    });
  };

  render() {
    const { className, children } = this.props;
    const { type } = this.state;
    const TabChildren = [];
    const otherChildren = [];
    React.Children.forEach(children, item => {
      if (!item) {
        return;
      }
      // eslint-disable-next-line
      if (item.type.__ANT_PRO_LOGIN_TAB) {
        TabChildren.push(item);
      } else {
        otherChildren.push(item);
      }
    });
    return (
      <div className={classNames(className, styles.login)}>
        <Form onSubmit={this.handleSubmit}>
          <div>
            <Tabs animated={false} className={styles.tabs} activeKey={type} onChange={this.onSwitch}>
              {TabChildren}
            </Tabs>
            {otherChildren}
          </div>
        </Form>
      </div>
    );
  }
}

Login.Tab = LoginTab;
Login.Submit = LoginSubmit;
Object.keys(LoginItem).forEach(item => {
  Login[item] = LoginItem[item];
});

export default Form.create()(Login);
