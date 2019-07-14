import { Button, Card } from 'antd';
import DescriptionList from 'components/DescriptionList';
import { connect } from 'dva';
import Bind from 'lodash-decorators/bind';
import Debounce from 'lodash-decorators/debounce';
import moment from 'moment';
import React, { Component } from 'react';

const { Description } = DescriptionList;
const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

const statusMap = {
  pending: '未审核',
  approved: '已通过',
  rejected: '未通过',
};

function ImagesList(props) {
  const {images} = props;
  const listItems = images.map((image) =>
    <img src={image} style={{ margin: 24, maxWidth: 280 }} alt="图片" /> 
  );
  return (
    <div>{listItems}</div>
  );
}


@connect(({ story, loading }) => ({
  story,
  loading: loading.effects['story/detail'],
}))
export default class StoryDetail extends Component {
  state = {
    stepDirection: 'horizontal',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { match: { params: { id } } } = this.props;
  
    dispatch({
      type: 'story/detail',
      payload: {
        story_id: id,
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
  
  render() {
    const { story: { detail } } = this.props;
    return (
      <div>
        <Card title={`编号: ${detail.id}`} style={{ marginBottom: 24 }} bordered={false}>
          <ImagesList images={detail.images} />
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="浏览量">{ detail.view }</Description>
          </DescriptionList>     
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="描述">{ detail.content }</Description>
          </DescriptionList>           
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="联系人">{ detail.linkman }</Description>
          </DescriptionList>       
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="联系手机">{ detail.linkphone }</Description>
          </DescriptionList>       
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="创建时间">{moment(detail.created).format('YYYY-MM-DD HH:mm:ss')}</Description>
          </DescriptionList>    
        </Card>
        <Card title="用户信息" style={{ marginBottom: 24 }} bordered={false}>
          <DescriptionList style={{ marginBottom: 24 }}>
            <Description term="ID">{ detail.user && detail.user.id || '' }</Description>
            <Description term="昵称">{ detail.user && detail.user.nickname || '' }</Description>
          </DescriptionList>      
        </Card>
        <Card title="审核" style={{ marginBottom: 24 }} bordered={false}>
          {(detail.status === "pending") && (
            <div align="center">   
              <Button style={{ marginRight: 10 }} type="primary" onClick={() => this.handleApproved(detail)}>通过</Button>
              <Button style={{ marginRight: 10 }} type="primary" onClick={() => this.handleRejected(detail)}>拒绝</Button>
            </div>
          ) || (
            <DescriptionList style={{ marginBottom: 24 }}>
              <Description term="审核状态">{ statusMap[detail.status] }</Description>
              <Description term="审核时间">{moment(detail.checked).format('YYYY-MM-DD HH:mm:ss')}</Description>
            </DescriptionList>
          )}         
        </Card>
      </div>
    );
  }
}
