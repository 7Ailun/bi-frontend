import { gentChartByAiAsyncMqUsingPOST } from '@/services/allen/chartController';
import { UploadOutlined } from '@ant-design/icons';
import { ProForm } from '@ant-design/pro-form';
import { Button, Card, Form, Input, message, Select, Space, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
import useForm = ProForm.useForm;

/**
 * 添加图标（异步）
 * @constructor
 */
const AddChartAsync: React.FC = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [form] = useForm();

  /**
   * 提交
   * @param values
   */
  const onFinish = async (values: any) => {
    // 避免重复提交
    if (submitting) {
      return;
    }
    setSubmitting(true);
    // 对接后端上传数据
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await gentChartByAiAsyncMqUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析任务提交成功，稍后请在我的图表页面查看啊');
        form.resetFields();
      }
    } catch (e: any) {
      message.error('分析失败' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className={'add-chart-async'}>
      <Card title={'智能分析'}>
        <Form
          form={form}
          name="addChart"
          labelAlign="left"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          onFinish={onFinish}
          initialValues={{}}
        >
          <Form.Item
            name="goal"
            label="分析目标："
            rules={[{ required: true, message: '分析目标是必填项！' }]}
          >
            <TextArea placeholder="请输入你的分析需求，比如：分析网站的增长情况" />
          </Form.Item>

          <Form.Item name="name" label="图表名称：">
            <Input placeholder="请输入图表名称" />
          </Form.Item>

          <Form.Item name="chartType" label="图表类型：">
            <Select
              placeholder="请选择图表类型"
              options={[
                { value: '折线图', label: '折线图' },
                { value: '柱状图', label: '柱状图' },
                { value: '饼图', label: '饼图' },
                { value: '雷达图', label: '雷达图' },
                { value: '散点图', label: '散点图' },
              ]}
            ></Select>
          </Form.Item>

          <Form.Item name="file" label="图表上传：" extra="在此上传您需要分析的文件">
            <Upload name="file" maxCount={1}>
              <Button icon={<UploadOutlined />}>上传 CSV 文件</Button>
            </Upload>
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
    </div>
  );
};
export default AddChartAsync;
