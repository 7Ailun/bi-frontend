import { listInterfaceInfoVoByPageUsingGet } from '@/services/weiapi-backend/interfaceInfoController';
import { PageContainer } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { List, message } from 'antd';
import React, { useEffect, useState } from 'react';

const Index: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<API.InterfaceInfoVO[]>([]);
  const [total, setTotal] = useState<any>(0);

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
  const loadData = async (current = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const res = await listInterfaceInfoVoByPageUsingGet({
        current,
        pageSize,
      });
      setList(res?.data?.records ?? []);
      setTotal(res?.data?.total ?? 0);
    } catch (error: any) {
      message.error('请求失败,' + error.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    loadData();
  }, []);

  return (
    <PageContainer title={'在线接口开放平台'} className={containerClassName}>
      <List
        className="demo-loadmore-list"
        loading={loading}
        itemLayout="horizontal"
        dataSource={list}
        renderItem={(item) => {
          const apiLink = `/interface_info/${item.id}`;
          return (
            <List.Item
              actions={[
                <a key={item.id} href={apiLink}>
                  查看
                </a>,
              ]}
            >
              <List.Item.Meta
                title={<a href={apiLink}>{item.name}</a>}
                description={item.description}
              />
            </List.Item>
          );
        }}
        pagination={{
          showTotal(total: number) {
            return '总数：' + total;
          },
          pageSize: 5,
          total,
          onChange(page: number, pageSize: number) {
            loadData(page, pageSize);
          },
        }}
      />
    </PageContainer>
  );
};

export default Index;
