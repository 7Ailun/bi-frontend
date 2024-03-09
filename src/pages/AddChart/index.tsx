import { gentChartByAiUsingPOST } from '@/services/allen/chartController';
import { UploadOutlined } from '@ant-design/icons';
import {Button, Card, Col, Divider, Form, Input, message, Row, Select, Space, Spin, Upload} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';

/**
 * 添加图表（同步）
 * @constructor
 */
const AddChart: React.FC = () => {
  const [chart, setChart] = useState<API.BiResponse>();
  const [option, setOption] = useState<any>();
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
    setChart(undefined);
    setOption(undefined);
    setSubmitting(true);
    // 对接后端上传数据
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await gentChartByAiUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析成功');
        const chartOption = JSON.parse(res.data.genChart ?? '');
        if (!chartOption) {
          message.error('图表解析错误');
        } else {
          setChart(res.data);
          setOption(chartOption);
        }
      }
    } catch (e: any) {
      message.error('分析失败' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className={'add-chart'}>
      <Row gutter={24}>
        <Col span={12} >
          <Card title={'智能分析'}>
            <Form name="addChart" labelAlign='left' labelCol={{ span: 4}}
                  wrapperCol={{ span: 16}}  onFinish={onFinish} initialValues={{}}>
              <Form.Item
                name="goal"
                label="分析目标："
                rules={[{ required: true, message: '分析目标是必填项！' }]}
              >
                <TextArea placeholder="请输入你的分析需求，比如：分析网站的增长情况" />
              </Form.Item>

              <Form.Item name="name" label="图表名称：" >
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
        </Col>
        <Col span={12}>
          <Card title={'分析结论'}>
            <div>{chart?.genResult ?? <div>请先在左侧进行分析</div>}</div>
            <Spin spinning={submitting}/>
          </Card>
          <Divider/>
          <Card title={'可视化图表'}>
          <div>
            {option ? <ReactECharts option={option}/> : <div>请先在左侧进行分析</div>}
            <Spin spinning={submitting}/>
          </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AddChart;
