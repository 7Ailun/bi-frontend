import {listChartByPageUsingPOST} from '@/services/allen/chartController';
import {addUserUsingPOST} from '@/services/allen/userController';
import {history} from '@umijs/max';
import {
  Button, Card,
  Input,
  InputNumber,
  message,
  Select,
  UploadFile, UploadProps,
} from 'antd';
import {Form} from 'antd/lib';
import React, {useEffect, useState} from 'react';
import {SizeType} from "@ant-design/pro-form/es/BaseForm";
import Upload, {RcFile, UploadChangeParam} from "antd/lib/upload";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {reject} from "lodash";


const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.readAsDataURL(img);
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.onerror = error => reject(error);
};

/*const getBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};*/

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('您只能上传 JPG/PNG 文件！');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('图片大小必须小于 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const AddUser: React.FC = () => {

  const [componentSize, setComponentSize] = useState<SizeType | 'default'>('default');

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
    /*
        getBase64(info.file.originFileObj as File)
          .then((base64String) => {
            setLoading(false);
            setImageUrl(base64String);
          })

      };*/
  }
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined/> : <PlusOutlined/>}
        <div style={{marginTop: 8}}>Upload</div>
      </div>
    );

    const onFormLayoutChange = ({size}: { size: SizeType }) => {
      setComponentSize(size);
    };


    useEffect(() => {
      listChartByPageUsingPOST({}).then((res) => {
        console.error('res', res);
      });
    });

    const onFinish = async (values: any) => {

      // 对接后端上传数据
      const params = {
        ...values,
        userAvatar: undefined,
      };

      try {
        // 如果有上传的文件
        /*      if (values.userAvatar instanceof File) {
                const base64Image = await getBase64(values.userAvatar);
                values.userAvatar = base64Image;
              }
              console.log(values.file.file.originFileObj)*/
        // 添加
        console.log(values)
        const res = await addUserUsingPOST(params, {}, values.file.file.originFileObj);
        if (res.code === 0) {
          const defaultAddSuccessMessage = '添加成功！';
          message.success(defaultAddSuccessMessage);
          const urlParams = new URL(window.location.href).searchParams;
          history.push(urlParams.get('redirect') || '/admin/user_list');
          return;
        } else {
          message.error('添加失败,请重试！');
        }
      } catch (error) {
        const defaultAddFailureMessage = '添加失败，请重试！';
        console.log(error);
        message.error(defaultAddFailureMessage);
      }
    };
    return (
      <div className={'add-user'}>
        <Card title={'添加用户'}>
          <Form
            labelCol={{span: 4}}
            wrapperCol={{span: 14}}
            layout="horizontal"
            initialValues={{size: componentSize}}
            onValuesChange={onFormLayoutChange}
            size={componentSize as SizeType}
            style={{maxWidth: 600}}
            onFinish={onFinish}
          >
            <Form.Item name={"userName"} label="用户昵称：">
              <Input/>
            </Form.Item>

            <Form.Item name={"userAccount"} label="账户：">
              <Input/>
            </Form.Item>

            <Form.Item name={"userPassword"} label="密码：">
              <Input type={"password"}/>
            </Form.Item>

            <>
              <Upload
                name="userAvatar"
                listType="picture-circle"
                className="avatar-uploader"
                showUploadList={false}
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl ? <img src={imageUrl} alt="userAvatar" style={{width: '100%'}}/> : uploadButton}
              </Upload>
            </>

            <Form.Item name={"gender"} label="性别：" style={{}}>
              <Select style={{width: '100%'}}>
                <Select.Option value="男">男</Select.Option>
                <Select.Option value="女">女</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name={"userRole"} label="用户角色：" style={{}}>
              <Select style={{width: '100%'}}>
                <Select.Option value="user">用户</Select.Option>
                <Select.Option value="admin">管理员</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name={"age"} label="年龄">
              <InputNumber/>
            </Form.Item>
            <Form.Item>
              <Button htmlType={"submit"}>提交</Button>
            </Form.Item>
          </Form>
        </Card>
      </div>

    );
  };

  export default AddUser;
