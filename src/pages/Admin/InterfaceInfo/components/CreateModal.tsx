import {
  ProColumns,
} from '@ant-design/pro-components';
import {Modal} from "antd";
import {ProTable} from "@ant-design/pro-table/lib";
import React from "react";

export type Props = {
  columns: ProColumns<API.InterfaceInfoVO>[]
  onCancel: () => void;
  onSubmit: (values: API.InterfaceInfoVO) => Promise<void>;
  visible: boolean
};
const CreateModal: React.FC<Props> = (props) => {
  const {visible, columns, onCancel, onSubmit} = props;
  return (
    <Modal visible={visible} footer={null} onCancel={() => onCancel?.()}>
      <ProTable type="form" columns={columns} onSubmit={async (value) => {
        onSubmit(value)
      }}/>
    </Modal>
  );
};
export default CreateModal;
