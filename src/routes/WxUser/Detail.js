import { Card } from 'antd';
import DescriptionList from 'components/DescriptionList';
import { connect } from 'dva';
import Bind from 'lodash-decorators/bind';
import Debounce from 'lodash-decorators/debounce';
import moment from 'moment';
import React, { Component } from 'react';

const { Description } = DescriptionList;
const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

@connect(({ wxuser, loading }) => ({
  wxuser,
  loading: loading.effects['wxuser/detail'],
}))
export default class WxUserProfile extends Component {
  state = {
    stepDirection: 'horizontal',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { match: { params: { id } } } = this.props;
  
    dispatch({
      type: 'wxuser/detail',
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
      type: 'wxuser/online',
      payload: {
        activity_id: item.id,
        online: true,
      },
    });
  };

  handleOffline = item => {
    const { dispatch } = this.props;
    dispatch({
      type: 'wxuser/offline',
      payload: {
        activity_id: item.id,
        online: false,
      },
    });
  };

  render() {
    const { wxuser: { detail } } = this.props;
    return (
      <div>
        <Card title={`编号: ${detail.id}`} style={{ marginBottom: 24 }} bordered={false}>
          <img src={detail.image} style={{ marginBottom: 24, maxWidth: 280 }} alt="图片" />   
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="微信昵称">{ detail.nickname }</Description>
          </DescriptionList>       
          {/* <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="活动描述">{ detail.description }</Description>
          </DescriptionList>        */}
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="创建时间">{moment(detail.created).format('YYYY-MM-DD HH:mm:ss')}</Description>
          </DescriptionList>       
        </Card>
      </div>
    );
  }
}
