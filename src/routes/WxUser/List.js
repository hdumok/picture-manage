import { Avatar, Card, Col, Form, Icon, Input, List, Row } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import React, { PureComponent } from 'react';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './List.less';

// const RadioButton = Radio.Button;
// const RadioGroup = Radio.Group;
const {Search} = Input;

@connect(({ wxuser, loading }) => ({
  wxuser,
  loading: loading.models.wxuser,
}))
@Form.create()
export default class WxUserList extends PureComponent {
  state = {
    formValues: {},
  };
  
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'wxuser/totel',
    });
    dispatch({
      type: 'wxuser/list',
    });
  };
  

  handleQueryList = (page, pageSize) => {

    const { dispatch } = this.props;
    const { formValues } = this.state;

    this.setState({
      formValues,
    });

    const params = {
      page,
      pageSize,
      ...formValues,
    };

    dispatch({
      type: 'wxuser/list',
      payload: params,
    });
  };


  handleSearch = (value) => {
    const { dispatch } = this.props;

    const values = {};

    if (value) {
      values.condition = value;
    };

    this.setState({
      formValues: values,
    });

    dispatch({
      type: 'wxuser/list',
      payload: values,
    });
  };

  handleDetail = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wxuser/detailPage',
      payload: {
        user_id: item.id,
      },
    });
  };

  render() {
    const { wxuser: { pagination, list, totel }, loading } = this.props;

    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        {/* <RadioGroup defaultValue="all">
          <RadioButton value="all">全部</RadioButton>
          <RadioButton value="progress">进行中</RadioButton>
          <RadioButton value="waiting">等待中</RadioButton>
        </RadioGroup> */}
        <Search className={styles.extraContentSearch} placeholder="请输入用户昵称或ID" onSearch={(val) => this.handleSearch(val)} />
      </div>
    );

    const Gender = ({gender}) => {
      if (gender === 1){
        return <Icon type="man" style={{ fontSize: '16px', color: '#52c41a' }} />
      }
      else if(gender === 2){
        return <Icon type="woman" style={{ fontSize: '16px', color: '#eb2f96' }} />
      }
      else {
        return null
      }
    }

    pagination.showSizeChanger = true;
    pagination.onChange = this.handleQueryList.bind(this);
    
    return (
      <PageHeaderLayout>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={8} xs={24}>
                <Info title="总用户数" value={totel.all_user} bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="本月新增用户数" value={totel.mounth_user} bordered />
              </Col>
              <Col sm={8} xs={24}>
                <Info title="今日新增用户数" value={totel.day_user} />
              </Col>
            </Row>
          </Card>

          <Card
            className={styles.listCard}
            bordered={false}
            title="用户列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={pagination}
              dataSource={list}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.headimgurl} shape="square" size="large" />}
                    title={<a href="#">ID: {item.id}</a>}
                    description={item.nickname}
                  />
                  <div className={styles.listContent}>
                    <div className={styles.listContentItem}>
                      <Gender gender={item.gender} />
                    </div>
                  </div>
                  <div className={styles.listContent}>
                    <div className={styles.listContentItem}>
                      <p>{`${item.country}${item.province}${item.city}`}</p>
                    </div>
                  </div>
                  <div className={styles.listContent}>
                    <div className={styles.listContentItem}>
                      <span>创建时间</span>
                      <p>{moment(item.created).format('YYYY-MM-DD HH:mm')}</p>
                    </div>
                  </div>
                  <div className={styles.listContent}>
                    <div className={styles.listContentItem}>
                      <span>最近上线时间</span>
                      <p>{moment(item.accessed).format('YYYY-MM-DD HH:mm')}</p>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
