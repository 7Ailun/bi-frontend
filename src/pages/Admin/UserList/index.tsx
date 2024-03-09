import { deleteUserUsingPOST, listUserVOByPageUsingPOST } from '@/services/allen/userController';
import {message, Pagination, PaginationProps, Space, Table} from 'antd';
import { Button } from 'antd/lib';
import Column from 'antd/lib/table/Column';
import React, { useEffect, useState } from 'react';

const UserList: React.FC = () => {
  const [userList, setUserList] = useState<API.UserVO[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);

  const handlePageChange: PaginationProps['onChange'] = async (page: number, pageSize?: number) => {
    setCurrentPage(page);
    setPageSize(pageSize || 5); // 如果传入了pageSize参数，则更新pageSize，否则保持当前pageSize
  };

  /**
   * 获取用户列表
   */
  const loadData = async () => {
    try {
      const res = await listUserVOByPageUsingPOST({
        current: currentPage,
        pageSize: pageSize,
      });

      if (res.data) {
        if (res.data.records) {
          console.log(res.data);
          setUserList(res.data.records ?? []);
          setTotal(res.data.total ?? 0);
          console.log('res.data.total' + res.data.total);
        }
      } else {
        message.error('获取用户列表失败');
      }
    } catch (e: any) {
      message.error('获取用户列表失败', e.message);
    }
  };

  /**
   * 删除
   * @param userId
   */
  const handleDelete = async (userId: number | undefined) => {
    try {
      // 调用删除用户的后端接口
      const response = await deleteUserUsingPOST({ id: userId });

      if (response.data) {
        message.success('删除成功');
        // 刷新用户列表
        loadData();
      } else {
        message.error('删除失败');
      }
    } catch (error) {
      message.error('删除请求失败');
    }
  };

  useEffect(() => {
    loadData();
  }, [currentPage, pageSize]);

  return (
    <div className={'user-list-page'}>
      <Table dataSource={userList} pagination={false}>
        <Column title="用户名称" dataIndex="userName" key="userName" />
        <Column
          title="用户头像"
          dataIndex="userAvatar"
          key="userAvatar"
          render={(avatar: string) => (
            <img src={avatar} alt="头像" style={{ width: 50, borderRadius: '50%' }} />
          )}
        />
        <Column
          title="角色"
          dataIndex="userRole"
          key="userRole"
          render={(userRole: string) => (
            <span>
              {userRole === 'user' ? '用户' : userRole === 'admin' ? '管理员' : '未知角色'}
            </span>
          )}
        />
        <Column
          title="创建时间"
          dataIndex="createTime"
          key="createTime"
          render={(createTime: string) => <span>{new Date(createTime).toLocaleString()}</span>}
        />
        <Column
          title="操作"
          key="action"
          render={(_: any, record: API.UserVO) => (
            <Space size="middle">
              <a>修改</a>
              {/* 删除按钮 */}
              <Button type="link" onClick={() => handleDelete(record.id)}>
                删除
              </Button>
            </Space>
          )}
        />
      </Table>

      <div style={{ textAlign: 'right' }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={total}
          onChange={handlePageChange}
          // showSizeChanger
          onShowSizeChange={(current, size) => {
            setPageSize(size);
          }}
        />
      </div>

    </div>
  );
};
export default UserList;
