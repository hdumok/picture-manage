import { Avatar, Button, Card, Col, DatePicker, Form, Input, List, Row, Select, Tag } from 'antd';
import StandardTable from 'components/StandardTable';
import { connect } from 'dva';
import moment from 'moment';
import React, { PureComponent } from 'react';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './List.less';


const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@connect(({ story, loading }) => ({
  story,
  loading: loading.models.story,
}))
@Form.create()
export default class StoryList extends PureComponent {
  state = {
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'story/list',
    });
  }

  handleQueryList = (pagination, filters, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    if (sorter.field){
      formValues.field = sorter.field;
      formValues.order = sorter.order.slice(0, -3);
    }
    else {
      delete formValues.field;
      delete formValues.order;
    }

    this.setState({
      formValues,
    });

    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
    };

    dispatch({
      type: 'story/list',
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

      if (values.status === '') {
        delete values.status
      }

      if (values.recommend === '') {
        delete values.recommend
      }

      if (values.name === '') {
        delete values.name
      }

      if (values.user_id === '') {
        delete values.user_id
      }

      if (values.nickname === '') {
        delete values.nickname
      }

      if (values.times && values.times.length > 0){
        [ values.timeStart, values.timeEnd ] = values.times;
        delete values.times
      }

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'story/list',
        payload: values,
      });
    });
  };


  handleDetail = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'story/detailPage',
      payload: {
        story_id: item.id,
      },
    });
  };

  handleApproved = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'story/check',
      payload: {
        story_id: item.id,
        status: 'approved',
      },
    });
  };


  handleRejected = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'story/check',
      payload: {
        story_id: item.id,
        status: 'rejected',
      },
    });
  };

  handleDelete = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'story/delete',
      payload: {
        story_id: item.id,
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
            <FormItem label="故事编号">{getFieldDecorator('story_id')(<Input placeholder="" />)}</FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="审核状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="pending">未审核</Option>
                  <Option value="approved">已通过</Option>
                  <Option value="rejected">未通过</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户 ID">{getFieldDecorator('user_id')(<Input placeholder="" />)}</FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户昵称">{getFieldDecorator('nickname')(<Input placeholder="" />)}</FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="提交时间">
              {getFieldDecorator('times')(<RangePicker showTime style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden', align: 'center' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </div>
        </div>
      </Form>
    );
  }

  render() {
    const { story, loading } = this.props;

    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
      },
      {
        title: '描述',
        dataIndex: 'content',
        render: val => <span>{val.length > 20 ? `${val.slice(0, 20)}...` : val}</span>,
      },
      {
        title: '用户',
        dataIndex: 'user',
        render: val => (
          <List.Item.Meta
            avatar={<Avatar src={val.headimgurl} shape="square" size="large" />}
            title={val.id}
            description={val.nickname}
          />
        ),
      },
      {
        title: '浏览',
        dataIndex: 'view',
        align: 'right',
        sorter: true,
        render: val => `${val}`,
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: val => {
          if (val === 'approved') {
            return <Tag color="#87d068">已通过</Tag>
          }
          else if(val === 'rejected'){
            return <Tag color="#f50">未通过</Tag>
          }
          else {
            return <Tag color="#CCCCCC">未审核</Tag>
          }
        },
      },
      {
        title: '发布时间',
        dataIndex: 'created',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '审核时间',
        dataIndex: 'checked',
        sorter: true,
        render: val => <span>{val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''}</span>,
      },
      {
        title: '操作',
        render: val => (
          (val.status === "pending") && (
            <div>
              <a type="primary" style={{ marginRight: 10 }} onClick={() => this.handleDetail(val)}>
                详情
              </a>
              <a type="primary" style={{ marginRight: 10 }} onClick={() => this.handleApproved(val)}>
                通过
              </a>
              <a type="primary" style={{ marginRight: 10 }} onClick={() => this.handleRejected(val)}>
                驳回
              </a>
              <a style={{ marginRight: 10 }} onClick={() => this.handleDelete(val)}>
                删除
              </a>
            </div>
          ) || (
            <div>
              <a type="primary" style={{ marginRight: 10 }} onClick={() => this.handleDetail(val)}>
              详情
              </a>
              <a style={{ marginRight: 10 }} onClick={() => this.handleDelete(val)}>
                删除
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
              data={story}
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
