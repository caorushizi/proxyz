import { Button, Form, message } from "antd";
import React, { FC, ReactNode, useEffect } from "react";
import { ProForm, ProFormSelect } from "@ant-design/pro-components";
import { Profile, ProxyMode, initialDirect } from "../../../helper/constant";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import {
  selectProfiles,
  updateProfileAction,
} from "../../../store/profilesSlice";
import SelectItem from "../../../components/SelectItem";
import { produce } from "immer";

interface VirtualProps {
  profile: Profile<ProxyMode.Virtual>;
}

interface VirtualForm {
  profileId: string;
}

const Virtual: FC<VirtualProps> = ({ profile }) => {
  const [form] = Form.useForm<VirtualForm>();
  const profiles = useAppSelector(selectProfiles);
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();

  useEffect(() => {
    form.setFieldsValue({
      profileId: String(profile.options.profileId),
    });
  }, []);

  const selectOptions = [...profiles, initialDirect]
    .filter((i) => i.type !== ProxyMode.Virtual && i.type !== ProxyMode.Auto)
    .map((i) => ({
      label: <SelectItem profile={i} />,
      value: i.id,
    }))
    .reduce<Record<string, ReactNode>>((acc, cur) => {
      acc[cur.value] = cur.label;
      return acc;
    }, {});

  const onFinish = (values: VirtualForm) => {
    const nextState = produce(profile, (draft) => {
      draft.options.profileId = Number(values.profileId);
    });
    dispatch(updateProfileAction(nextState));
    messageApi.success("保存成功");
  };

  return (
    <>
      {contextHolder}
      <ProForm<VirtualForm>
        form={form}
        autoComplete="off"
        onFinish={onFinish}
        layout="vertical"
      >
        <ProFormSelect
          name="profileId"
          label="虚拟情景模式"
          tooltip="当使用此情景模式时，相当于使用了以下情景模式："
          valueEnum={selectOptions}
          placeholder="请选择虚拟情景模式"
          rules={[{ required: true, message: "请选择虚拟情景模式" }]}
          required
          allowClear={false}
        />
      </ProForm>
      <div>
        <div>一键替换情景模式</div>
        <div>
          通过此功能可以更改现有的选项，使用此虚情景模式来取代
          。此功能会把所有和
          相关的切换规则改为使用此虚情景模式。这样一来，就可以通过此虚情景模式来控制那些切换条件对应的结果。
        </div>
        <div>您确定要使用 oProfile 来代替 吗?</div>
        <div> proxy1 {">"} 虚情景模式</div>
        <div>
          如果继续操作，则和 proxy1 有关的切换规则将改为使用 虚情景模式
          来代替。此外，启动情景模式、快速切换等设置也会做相应调整。但请注意，此操作不影响这两个情景模式本身。
        </div>
        <div>
          <Button>替换</Button>
        </div>
      </div>
    </>
  );
};

export default Virtual;
