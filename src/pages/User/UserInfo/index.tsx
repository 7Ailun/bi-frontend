import React, {useEffect, useState} from "react";
import {
  Avatar,
  Button,
  Descriptions,
  DescriptionsProps,
  Divider,
  Form,
  message,
  Upload, UploadProps,
} from 'antd';
import {PageContainer} from "@ant-design/pro-components";
import {
  getPersonalInfoUsingGet,
  handleAvatarUploadUsingPost
} from "@/services/weiapi-backend/userController";
import moment from "moment";
import {useEmotionCss} from "@ant-design/use-emotion-css";
import {UploadOutlined} from "@ant-design/icons";


// private Long id;
// private String userName;
//
// private String userAvatar;
// private String userProfile;
// private String accessKey;
// private String secretKey;
// private String userRole;
// private Date createTime;

const UserInfo = () => {

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://pic.imgdb.cn/item/65ebffd49f345e8d03b03e5b.jpg')",
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

const getLoginUser = async () => {
  try {
    const res = await getPersonalInfoUsingGet();

    if (res.data) {
      setUser(res.data)
    }
  } catch (error: any) {
    message.error('请求失败,请重试' + error.message);
  }
}
useEffect(() => {
  getLoginUser()
}, [])
return (
  <PageContainer className={containerClassName}>
    <Divider/>
    <Avatar src={user?.userAvatar}
            size={200}


    />
    <Divider/>
    <Descriptions bordered={true}
                  column={2}
                  items={items}
                  title={'基本信息'}
    />
    <Divider/>
        <Upload {...props} name='file' maxCount={1} >
          <Button icon={<UploadOutlined/>}>点击上传头像</Button>
        </Upload>


  </PageContainer>
)


}
;
export default UserInfo;
