import { Button, Card } from 'antd';
import DescriptionList from 'components/DescriptionList';
import { connect } from 'dva';
import Bind from 'lodash-decorators/bind';
import Debounce from 'lodash-decorators/debounce';
import moment from 'moment';
import React, { Component } from 'react';

const { Description } = DescriptionList;
const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

@connect(({ activity, loading }) => ({
  activity,
  loading: loading.effects['activity/detail'],
}))
export default class ActivityProfile extends Component {
  state = {
    stepDirection: 'horizontal',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { match: { params: { id } } } = this.props;
  
    dispatch({
      type: 'activity/detail',
      payload: {
        activity_id: id,
      },
    });
  }

  @Bind()
  @Debounce(200)
  setStepDirection() {
    const { stepDirection } = this.state;
    const w = getWindowWidth();
    if (stepDirection !== 'vertical' && w <= 576) {
      this.setState({
        stepDirection: 'vertical',
      });
    } else if (stepDirection !== 'horizontal' && w > 576) {
      this.setState({
        stepDirection: 'horizontal',
      });
    }
  }


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

  render() {
    const { activity: { detail } } = this.props;
    return (
      <div>
        <Card title={`编号: ${detail.id}`} style={{ marginBottom: 24 }} bordered={false}>
          <img src={detail.image} style={{ marginBottom: 24, maxWidth: 280 }} alt="图片" />   
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="活动名称">{ detail.name }</Description>
          </DescriptionList>       
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="活动描述">{ detail.description }</Description>
          </DescriptionList>       
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="创建时间">{moment(detail.created).format('YYYY-MM-DD HH:mm:ss')}</Description>
          </DescriptionList>    
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="上线状态">{ detail.online ? "已上线" : "未上线" }</Description>
          </DescriptionList>       
          {detail.online && (
            <DescriptionList style={{ marginBottom: 24 }}>
              <Description term="上线时间">{ moment(detail.onlined).format('YYYY-MM-DD HH:mm:ss') }</Description>
            </DescriptionList>
          )}
          <div align="center">   
            {!detail.online && (<Button style={{ marginRight: 10 }} type="primary" onClick={() => this.handleOnline(detail)}>上线活动</Button>) || (
            <Button style={{ marginRight: 10 }} type="primary" onClick={() => this.handleOffline(detail)}>下线活动</Button>)}         
          </div>
        </Card>
      </div>
    );
  }
}
