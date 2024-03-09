
import { useModel } from '@@/exports';
import { Avatar, Button, Card, message, Result } from 'antd';
import Search from 'antd/es/input/Search';
import { List } from 'antd/lib';
import React, { useEffect, useState } from 'react';
import {getMyChatListByPageUsingPOST} from "@/services/allen/chatAiController";

const MyChatPage: React.FC = () => {
  const initSearchParams = {
    current: 1,
    pageSize: 4,
    sortField: 'createTime',
    sortOrder: 'desc',
  };

  const [searchParams, setSearchParams] = useState<API.ChatQueryRequest>({ ...initSearchParams });
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  const [chatList, setChatList] = useState<API.Chat[]>();
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [count, setCount] = useState(0)

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getMyChatListByPageUsingPOST(searchParams);
      if (res.data) {
        setChatList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
      } else {
        message.error('获取我的提问失败');
      }
    } catch (e: any) {
      message.error('获取我的提问失败', e.message);
    }
    setLoading(false);
  };

  const handleClick = () => {
    setCount(count + 1); // 通过改变状态来触发重新渲染
  };
  /**
   * 该代码段是在使用React的useEffect钩子函数时调用的函数。
   * 它会在组件渲染时触发，并且会在搜索参数(searchParams)改变时触发。
   * 具体来说，当searchParams改变时，loadData函数会被调用，
   * 并且组件会重新加载。这种重载可以帮助您在搜索参数改变时更新组件的内容。
   */
  useEffect(() => {
    loadData();
  }, [searchParams]);

  return (
    <div className={'my-chat-page'}>
      <div>
        <Search
          placeholder="请输入问题内容或类型"
          enterButton
          loading={loading}
          onSearch={(value) => {
            setSearchParams({
              ...initSearchParams,
              question: value,
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
        dataSource={chatList}
        renderItem={(item: any) => (
          <List.Item key={item.id}>
            <Card
              style={{ width: '100%' }}
              bordered={false}
              // todo 完成编辑内容 和重新生成功能
              extra={
                <div>
                  <Button>编辑内容</Button>
                  <Button>重新生成</Button>
                </div>
              }
            >
              <List.Item.Meta
                avatar={<Avatar src={currentUser && currentUser.userAvatar} />}
                title={item.name}
                description={item.chatType ? '问题类型：' + item.chatType : undefined}
              />

              <>
                {item.chatStatus === 'wait' && (
                  <>
                    <Result status="warning" title="等待结果生成" />
                  </>
                )}
                {item.chatStatus === 'running' && (
                  <>
                    <Result status="info" title="结果生成中" />
                  </>
                )}

                {item.chatStatus === 'succeed' && (
                  <>
                    <div style={{ marginBottom: 16 }} />
                    <h4>{'问题：' + item.question}</h4>
                    <div style={{ marginBottom: 16 }} />
                    <h4>{'结果：' + item.genResult}</h4>
                    <div style={{ marginBottom: 16 }} />
                  </>
                )}
                {item.chatStatus === 'failed' && (
                  <>
                    <Result status="error" title="结果生成失败" subTitle={item.errorMessage} />
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
export default MyChatPage;
