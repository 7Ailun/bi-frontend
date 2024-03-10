import {
  genAkSkUsingPost,
  getPersonalInfoUsingGet,
} from '@/services/weiapi-backend/userController';
import { UploadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import {
  Avatar,
  Button,
  Descriptions,
  DescriptionsProps,
  Divider,
  message,
  Upload,
  UploadProps,
} from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';

const UserInfo = () => {
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

  const [user, setUser] = useState<API.UserVO>();
  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '用户昵称',
      children: user?.userName,
    },
    {
      key: '2',
      label: 'accessKey',
      children: user?.accessKey,
    },
    {
      key: '3',
      label: '用户权限',
      children: user?.userRole === 'admin' ? '管理员' : '用户',
    },
    {
      key: '4',
      label: 'secretKey',
      children: user?.secretKey,
    },
    {
      key: '5',
      label: '注册时间',
      children: moment(user?.createTime).format('YYYY年-MM月-DD日 HH:mm:ss'),
    },
  ];
  const props: UploadProps = {
    name: 'file',
    action: 'http://localhost:8081/api/user/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const onClick = async () => {
    try {
      const result = await genAkSkUsingPost();
      if (result) {
        message.success('生成成功');
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        getLoginUser();
      }
    } catch (e: any) {
      message.error('生成失败');
    }
  };
  const getLoginUser = async () => {
    try {
      const res = await getPersonalInfoUsingGet();

      if (res.data) {
        setUser(res.data);
      }
    } catch (error: any) {
      message.error('请求失败,请重试' + error.message);
    }
  };
  useEffect(() => {
    getLoginUser();
  }, []);
  return (
    <PageContainer className={containerClassName}>
      <Divider />
      <Avatar src={user?.userAvatar} size={200} />
      <Divider />
      <Descriptions bordered={true} column={2} items={items} title={'基本信息'} />
      <Divider />
      <div className={'button-row'}>
        <Upload {...props} name="file" maxCount={1}>
          <Button icon={<UploadOutlined />}>点击上传头像</Button>
        </Upload>
        <Button type="primary" style={{ marginLeft: 'auto' }} onClick={onClick}>
          重新生成
        </Button>
      </div>
    </PageContainer>
  );
};
export default UserInfo;
