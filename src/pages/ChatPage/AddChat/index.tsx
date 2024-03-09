
import {Button, Card, Divider, Form, message, Space, Spin} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
import {genResultByAiUsingPOST} from "@/services/allen/chatAiController";

/**
 * 提问（同步）
 * @constructor
 */
const AddChat: React.FC = () => {
  const [chat, setChat] = useState<API.ChatAiResponse>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  /**
   * 提交
   * @param values
   */
  const onFinish = async (values: any) => {
    // 避免重复提交
    if (submitting) {
      return;
    }
    // 避免图表覆盖
    setChat(undefined);
    setSubmitting(true);
    // 对接后端上传数据
    const params = {
      ...values,
    };
    try {
      const res = await genResultByAiUsingPOST(params, {});
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析成功');

          setChat(res.data);
      }
    } catch (e: any) {
      message.error('分析失败' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className={'add-chat'} style={{backgroundImage: 'url("public/img/巨人1.png")'}} >
          <Card title={'智能回答'}>
            <Form name="addChat" labelAlign='left' labelCol={{ span: 4}}
                  wrapperCol={{ span: 16}}  onFinish={onFinish} initialValues={{}}>
              <Form.Item
                name="question"
                label="问题："
                rules={[{ required: true, message: '要分析的问题是必填项！' }]}
              >
                <TextArea  placeholder="请输入你的问题，比如：如何减肥？"
                           autoSize={{ minRows: 6, maxRows: 6 }} />
              </Form.Item>
              <Form.Item wrapperCol={{ span: 16, offset: 4 }}>
                <Space>
                  <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                    提交
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>

        <Card title={'问题类型'}>
          <div>{chat?.chatType ?? <div>请先提交您的问题</div>}</div>
          <Spin spinning={submitting}/>
        </Card>
        <Divider/>

          <Card title={'回答'}>
            <div>{chat?.genResult ?? <div>请先提交您的问题</div>}</div>
            <Spin spinning={submitting}/>
          </Card>
          <Divider/>
    </div>
  );
};
export default AddChat;
