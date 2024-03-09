import ReactECharts from 'echarts-for-react';
import {PageContainer,} from '@ant-design/pro-components';
import '@umijs/max';

import React, {useEffect,  useState} from 'react';
import {listTopInvokeInterfaceInfoUsingGet} from "@/services/weiapi-backend/analysisController";


const Analysis: React.FC = () => {
  const [data, setData] = useState<API.InterfaceInfoVO[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    try {

    listTopInvokeInterfaceInfoUsingGet().then(res => {

      if (res.data) {
        setData(res.data);
      }
    })
    }
      catch (e: any) {

      }

  }, [])
// 映射：{value: 1048, name: 'Search Engine'},
  const chartData   = data.map(item => {
    return {
      value: item.totalNum,
      name: item.name
    }
  })

  const option = {
    title: {
      text: '接口调用次数TOP3',
      subtext: '数据视图',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '调用次数',
        type: 'pie',
        radius: '50%',
        data: chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };


  return (
    <PageContainer>
      <ReactECharts loadingOption={loading} option={option}/>
    </PageContainer>
  );
};
export default Analysis;
