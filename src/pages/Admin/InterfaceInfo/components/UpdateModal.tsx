import { ProColumns,} from '@ant-design/pro-components';
import {Modal} from "antd";
import {ProTable} from "@ant-design/pro-table/lib";
import React, {useEffect, useRef} from "react";
import {ProFormInstance} from "@ant-design/pro-form/lib";

export type Props = {
  values: API.InterfaceInfoVO;
  columns: ProColumns<API.InterfaceInfoVO>[]
  onCancel: () => void;
  onSubmit: (values: API.InterfaceInfoVO) => Promise<void>;
  visible: boolean

};
const UpdateModal: React.FC<Props> = (props) => {
  const {values, visible, columns, onCancel, onSubmit} = props;
  const formRef = useRef<ProFormInstance>()

  useEffect(() => {
    if (formRef) {
      formRef.current?.setFieldsValue(values);
    }
  }, [values])
  return (
    <Modal visible={visible} footer={false} onCancel={() => onCancel?.()}>
      <ProTable
        type="form"
        columns={columns}
        formRef={formRef}
        onSubmit={async (value) => {
          onSubmit?.(value)
        }}/>
    </Modal>
  );
};
export default UpdateModal;
