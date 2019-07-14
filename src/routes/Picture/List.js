import { Avatar, Button, Card, Col, DatePicker, Form, Input, List, Popconfirm, Radio, Row, Select, Switch, Tag } from 'antd';
import StandardTable from 'components/StandardTable';
import { connect } from 'dva';
import moment from 'moment';
import React, { PureComponent } from 'react';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './List.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const { Option, OptGroup } = Select;

@connect(({ area, picture, loading }) => ({
  area,
  picture,
  loading: loading.models.picture,
}))
@Form.create()
export default class PictureList extends PureComponent {
  state = {
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'picture/list',
    });

    dispatch({
      type: 'area/shenzhen',   
    })
  }

  handleQueryList = (pagination, filters, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const { current: page, pageSize } = pagination;

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
      page,
      pageSize,
      ...formValues,
    };

    dispatch({
      type: 'picture/list',
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

      if (values.recommend === '') {
        delete values.recommend
      }

      if (values.status === '') {
        delete values.status
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

      if (values.city === '') {
        delete values.city
      }

      if (values.district === '') {
        delete values.district
      }

      if (values.times && values.times.length > 0){
        [ values.timeStart, values.timeEnd ] = values.times;
        delete values.times
      }

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'picture/list',
        payload: values,
      });
    });
  };

  handleDetail = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'picture/detailPage',
      payload: {
        picture_id: item.id,
      },
    });
  };

  handleApproved = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'picture/check',
      payload: {
        picture_id: item.id,
        status: 'approved',
      },
    });
  };

  handleRejected = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'picture/check',
      payload: {
        picture_id: item.id,
        status: 'rejected',
      },
    });
  };

  handleRecommend = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'picture/recommend',
      payload: {
        picture_id: item.id,
        recommend: !item.recommend,
      },
    });
  };
  
  handleDelete = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'picture/delete',
      payload: {
        picture_id: item.id,
      },
    });
  };

  renderForm() {
    const { form, area } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="作品编号">{getFieldDecorator('picture_id')(<Input placeholder="" />)}</FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="作品名称">{getFieldDecorator('name')(<Input placeholder="" />)}</FormItem>
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
          <Col md={8} sm={24}>
            <FormItem label="深圳地区">
              {getFieldDecorator('district')(
                <Select>
                  <OptGroup label={area.name}>
                    {
                      area.children.map(child => <Option value={child.name}>{child.name}</Option>)
                    }
                  </OptGroup>
                </Select>
            )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="审核状态">{getFieldDecorator('status', {
              initialValue: "",
            })(
              <RadioGroup name="status">
                <Radio value="">全部</Radio>
                <Radio value="pending">未审核</Radio>
                <Radio value="approved">已通过</Radio>
                <Radio value="rejected">未通过</Radio>
              </RadioGroup>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="推荐状态">{getFieldDecorator('recommend', {
              initialValue: "",
            })(
              <RadioGroup name="recommend">
                <Radio value="">全部</Radio>
                <Radio value>已推荐</Radio>
                <Radio value={false}>未推荐</Radio>
              </RadioGroup>)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden', align: 'center' }}>
          <div style={{ float: 'right', marginBottom: 24}}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </div>
        </div>
      </Form>
    );
  }

  render() {
    const { picture, loading } = this.props;

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
        title: '地区',
        dataIndex: 'district',
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
        title: '投票数',
        dataIndex: 'vote',
        align: 'center',
        sorter: true,
        render: val => `${val}`,
      },
      {
        title: '提交时间',
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
        title: '推荐',
        render: val => <Switch checked={val.recommend} disabled={val.status !== "approved"} onChange={() => this.handleRecommend(val)} />,
      },
      {
        title: '操作',
        render: val => (
          (val.status === "pending") && (
            <div>
              <a style={{ marginRight: 10 }} onClick={() => this.handleDetail(val)}>
                详情
              </a>
              <a style={{ marginRight: 10 }} onClick={() => this.handleApproved(val)}>
                通过
              </a>
              <a style={{ marginRight: 10 }} onClick={() => this.handleRejected(val)}>
                驳回
              </a>
              <Popconfirm
                title="确认删除?"
                onConfirm={this.handleDelete.bind(this, val)}
                okText="确认"
                cancelText="取消"
              >
                <a style={{ marginRight: 10 }}>
                删除
                </a>
              </Popconfirm>
            </div>
          ) || (
            <div>
              <a style={{ marginRight: 10 }} onClick={() => this.handleDetail(val)}>
                详情
              </a>
              <Popconfirm
                title="确认删除?"
                onConfirm={() => this.handleDelete(val)}
                okText="确认"
                cancelText="取消"
              >
                <a style={{ marginRight: 10 }}>
                删除
                </a>
              </Popconfirm>
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
              data={picture}
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
