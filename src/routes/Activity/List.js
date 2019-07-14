import { Button, Card, Col, Form, Input, Row, Select, Tag } from 'antd';
import StandardTable from 'components/StandardTable';
import { connect } from 'dva';
import moment from 'moment';
import React, { PureComponent } from 'react';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './List.less';

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ activity, loading }) => ({
  activity,
  loading: loading.models.activity,
}))
@Form.create()
export default class ActivityList extends PureComponent {
  state = {
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/list',
    });
  }

  handleQueryList = pagination => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };

    dispatch({
      type: 'activity/list',
      payload: params,
    });
  };

  handleSearch = e => {
    // 因为是form，所以需要屏蔽默认操作
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      if (values.online === '') {
        delete values.online
      }

      if (values.name === '') {
        delete values.name
      }

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'activity/list',
        payload: values,
      });
    });
  };

  handleCreate = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/createPage',
    });
  };

  handleDetail = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/detailPage',
      payload: {
        activity_id: item.id,
      },
    });
  };

  handleOnline = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/online',
      payload: {
        activity_id: item.id,
        online: true,
      },
    });
  };

  handleOffline = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/offline',
      payload: {
        activity_id: item.id,
        online: false,
      },
    });
  };

  renderForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="作品名称">{getFieldDecorator('name')(<Input placeholder="" />)}</FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="是否上线">
              {getFieldDecorator('online')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value>已上线</Option>
                  <Option value={false}>未上线</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden', align: 'center' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit" style={{ marginRight: 12 }}>
              查询
            </Button>
            <Button type="primary" onClick={() => this.handleCreate()}>
              新建
            </Button>
          </div>
        </div>
      </Form>
    );
  }

  render() {
    const { activity, loading } = this.props;

    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '是否上线',
        dataIndex: 'online',
        render: val => (val && (<Tag color="#87d068">已上线</Tag>) || (<Tag color="#CCCCCC">未上线</Tag>)),
      },
      {
        title: '创建时间',
        dataIndex: 'created',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '上线时间',
        dataIndex: 'onlined',
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
      {
        title: '操作',
        render: val => (
          (!val.online) && (
            <div>
              <a style={{ marginRight: 10 }} onClick={() => this.handleDetail(val)}>
                详情
              </a>
              <a style={{ marginRight: 10 }} onClick={() => this.handleOnline(val)}>
                上线活动
              </a>
            </div>
          ) || (
            <div>
              <a style={{ marginRight: 10 }} onClick={() => this.handleDetail(val)}>
                详情
              </a>
              <a style={{ marginRight: 10 }} onClick={() => this.handleOffline(val)}>
                下线活动
              </a>
            </div>
          )
        ),
      },
    ];

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              loading={loading}
              data={activity}
              rowKey="id"
              columns={columns}
              onChange={this.handleQueryList}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
