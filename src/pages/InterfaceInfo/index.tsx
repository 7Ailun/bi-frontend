import {
  getInterfaceInfoVoByIdUsingGet,
  invokeInterfaceInfoUsingPost,
} from '@/services/weiapi-backend/interfaceInfoController';
import { addInvokeCountUsingPost } from '@/services/weiapi-backend/userInterfaceInfoController';
import { PageContainer } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Button, Card, Descriptions, Divider, Form, message, Statistic } from 'antd';
import { Input } from 'antd/lib';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<API.InterfaceInfoVO>();
  const params = useParams();
  const [invokeRes, setInvokeRes] = useState<any>();
  const [invokeLoading, setInvokeLoading] = useState(false);

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage: "url('https://pic.imgdb.cn/item/65ebffd49f345e8d03b03e5b.jpg')",
      backgroundSize: '100% 100%',
    };
  });

  const onFinish = async (values: any) => {
    if (!params.id) {
      message.error('接口不存在');
      return;
    }
    setInvokeLoading(true);
    try {
      const res = await invokeInterfaceInfoUsingPost({
        id: params.id,
        ...values,
      });

      setInvokeRes(res.data);
      message.success('请求成功');
    } catch (error: any) {
      message.error('请求失败,请重试' + error.message);
    }
    setInvokeLoading(false);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    loadData();
  };

  /**
   * 加载数据
   */
  const loadData = async () => {
    if (!params.id) {
      message.error('参数不存在');
      return;
    }
    setLoading(true);
    try {
      const res = await getInterfaceInfoVoByIdUsingGet({
        id: params.id,
      });
      setData(res.data);
    } catch (error: any) {
      message.error('请求失败,' + error.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    loadData();
  }, []);

  /**
   * 免费获取
   */
  const freeGet = async () => {
    try {
      const res = await addInvokeCountUsingPost({
        interfaceInfoId: data?.id,
        userId: data?.userId,
        number: 50,
      });
      if (res.code === 0) {
        message.success('成功获取' + res.data + '次调用次数');
        await loadData();
      } else {
        message.error('获取调用次数失败');
      }
    } catch (e: any) {
      message.error('获取调用次数失败' + e);
    }
  };

  return (
    <PageContainer title={'查看接口文档'} className={containerClassName}>
      <Card>
        {data ? (
          <Descriptions title={data?.name} column={1}>
            <Descriptions.Item label="接口状态">{data?.status ? '正常' : '关闭'}</Descriptions.Item>
            <Descriptions.Item label="描述">{data?.description}</Descriptions.Item>
            <Descriptions.Item label="请求地址">{data?.url}</Descriptions.Item>
            <Descriptions.Item label="请求方法">{data?.method}</Descriptions.Item>
            <Descriptions.Item label="请求参数">{data?.requestParams}</Descriptions.Item>
            <Descriptions.Item label="请求头">{data?.requestHeader}</Descriptions.Item>
            <Descriptions.Item label="响应头">{data?.responseHeader}</Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {moment(data?.createTime).format('YYYY年-MM月-DD日 HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {moment(data?.updateTime).format('YYYY年-MM月-DD日 HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <>接口不存在</>
        )}
      </Card>
      <Divider />
      <div className={'button-row'}>
        <Statistic title="剩余次数" value={data?.leftNum} />
        <Button type={'primary'} style={{ marginLeft: 'auto' }} onClick={freeGet}>
          免费获得
        </Button>
      </div>
      <Divider />
      <Card title={'接口调用'} loading={loading}>
        <Form name="basic" layout="vertical" onFinish={onFinish}>
          <Form.Item label="请求参数" name="requestParams">
            <Input.TextArea />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type="primary" htmlType="submit">
              调用
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Divider />
      <Card title={'返回结果'} loading={invokeLoading}>
        {invokeRes}
      </Card>
    </PageContainer>
  );
};

export default Index;
