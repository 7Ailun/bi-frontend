import {
  listMyChartByPageUsingPOST,
  regenChartByAiUsingPOST,
} from '@/services/allen/chartController';
import { useModel } from '@@/exports';
import { Avatar, Button, Card, message, Result } from 'antd';
import Search from 'antd/es/input/Search';
import { List } from 'antd/lib';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';

const MyChartPage: React.FC = () => {
  const initSearchParams = {
    current: 1,
    pageSize: 4,
    sortField: 'createTime',
    sortOrder: 'desc',
  };

  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams });
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const [count, setCount] = useState(0);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listMyChartByPageUsingPOST(searchParams);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        // 隐藏图表的title
        if (res.data.records) {
          res.data.records.forEach((data: any) => {
            if (data.chartStatus === 'succeed') {
              const chartOption = JSON.parse(data.genChart ?? '{}');
              chartOption.title = undefined;
              data.genChart = JSON.stringify(chartOption);
            }
          });
        }
      } else {
        message.error('获取我的图表失败');
      }
    } catch (e: any) {
      message.error('获取我的图表失败', e.message);
    }
    setLoading(false);
  };

  const handleClick = () => {
    setCount(count + 1); // 通过改变状态来触发重新渲染
  };

  const reGenerateChart = async (value: any) => {
    setLoadingButton(true);
    try {
      if(value.chartStatus === 'succeed') {
        message.success("图表已经生成")
        setLoadingButton(false);
        return;
      }
      const res = await regenChartByAiUsingPOST({
        chartId: value.id
      });
      if (res.data) {
        message.success('生成成功');
      } else {
        message.error('生成失败');
      }
    } catch (e: any) {
      message.error('生成失败', e.message);
    }
    handleClick();
    setLoadingButton(false);
  };

  /**
   * 该代码段是在使用React的useEffect钩子函数时调用的函数。
   * 它会在组件渲染时触发，并且会在搜索参数(searchParams)改变时触发。
   * 具体来说，当searchParams改变时，loadData函数会被调用，
   * 并且组件会重新加载。这种重载可以帮助您在搜索参数改变时更新组件的内容。
   */
  useEffect(() => {
    loadData();
  }, [searchParams,count]);

  return (
    <div className={'my-chart-page'}>
      <div>
        <Search
          placeholder="请输入图表名称"
          enterButton
          loading={loading}
          onSearch={(value) => {
            setSearchParams({
              ...initSearchParams,
              name: value,
            });
          }}
        />
      </div>
      <div className="margin-16" />
      <List
        // 响应式间隔列表
        grid={{
          gutter: 16, // 间隔大小
          xs: 1,
          sm: 1,
          md: 1,
          lg: 1,
          xl: 2,
          xxl: 2,
        }}
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            });
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item: any) => (
          <List.Item key={item.id}>
            <Card
              style={{ width: '100%' }}
              bordered={false}
              // todo 完成编辑图表 和重新生成功能
              extra={
                <div>
                  <Button>编辑图表</Button>
                  <Button onClick={() => reGenerateChart(item)} loading={loadingButton} >重新生成</Button>
                </div>
              }
            >
              <List.Item.Meta
                avatar={<Avatar src={currentUser && currentUser.userAvatar} />}
                title={item.name}
                description={item.chartType ? '图表类型：' + item.chartType : undefined}
              />

              <>
                {item.chartStatus === 'wait' && (
                  <>
                    <Result status="warning" title="图表等待生成" />
                  </>
                )}
                {item.chartStatus === 'running' && (
                  <>
                    <Result status="info" title="图表生成中" />
                  </>
                )}

                {item.chartStatus === 'succeed' && (
                  <>
                    <div style={{ marginBottom: 16 }} />
                    <h4>{'分析目标：' + item.goal}</h4>
                    <div style={{ marginBottom: 16 }} />
                    <h4>{'分析结论：' + item.genResult}</h4>
                    <div style={{ marginBottom: 16 }} />
                    <ReactECharts option={item.genChart && JSON.parse(item.genChart)} />
                  </>
                )}
                {item.chartStatus === 'failed' && (
                  <>
                    <Result status="error" title="图表生成失败" subTitle={item.errorMessage} />
                  </>
                )}
              </>
            </Card>
          </List.Item>
        )}
      />
      <br />
    </div>
  );
};
export default MyChartPage;
