import { Button, Card, Form, Icon, Input, message, Upload } from 'antd';
import { connect } from 'dva';
import React, { PureComponent } from 'react';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const { TextArea } = Input;

function beforeUpload(file) {
  const isImage = file.type.indexOf('image') === 0;
  if (!isImage) {
    message.error('请上传正确格式图片!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('为了首页加载速度, 图片不能大于2M!');
  }
  return isImage && isLt2M;
}

@connect(({ loading }) => ({
  submitting: loading.effects['activity/create'],
}))
@Form.create()
export default class ActivityCreate extends PureComponent {

  state = {
    image: null,
    loading: false,
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { image } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'activity/create',
          payload: {
            ...values,
            image,
          },
        });
      }
    });
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    };
    if (info.file.status === 'done') {
      this.setState({
        image: info.file.response.data.url,
        loading: false,
      })
    };
  };

  render() {
    const { submitting, form } = this.props;
    const { loading, image } = this.state;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderLayout title="活动创建">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="活动名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入名称',
                  },
                ],
              })(<Input placeholder="给活动起个名字" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="活动描述">
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                    message: '请输入活动描述',
                  },
                ],
              })(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder="请输入活动描述"
                  rows={4}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="活动图片">
              {getFieldDecorator('image', {
                rules: [
                  {
                    required: true,
                  },
                ],
              })(
                <Upload
                  name="file"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="/manage/upload"
                  beforeUpload={beforeUpload}
                  onChange={this.handleChange}
                >
                  {image ? <img src={image} style={{ marginBottom: 24, maxWidth: 280 }} alt="图片" /> : (
                    <div>
                      <Icon type={loading ? 'loading' : 'plus'} />
                    </div>
                  )}
                </Upload>
               )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32, textAlign: "center" }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
