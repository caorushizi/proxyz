import React from "react";
import PageView from "../components/PageView";
import {
  ProForm,
  ProFormCheckbox,
  ProFormSelect,
} from "@ant-design/pro-components";
import { Button, Checkbox } from "antd";

const Settings = () => {
  return (
    <PageView title="设置">
      <ProForm>
        <ProForm.Group title="其他设置">
          <ProFormCheckbox>删除切换条件时需要确认。</ProFormCheckbox>
          <ProFormCheckbox>当更改情景模式时刷新当前标签。</ProFormCheckbox>
          <ProFormCheckbox>
            右键菜单中，可检查网页元素所使用的代理。
          </ProFormCheckbox>
          <ProFormCheckbox>
            把以弹出菜单创建的规则添加到列表末尾。
          </ProFormCheckbox>
        </ProForm.Group>
        <ProForm.Group title="键盘快捷键">
          <ProForm.Item
            label={<Button>123</Button>}
            help="弹出菜单中的菜单项也可以用键盘进行选择。在弹出菜单中按下? (问号键，或/斜杠键) 查看帮助。"
          >
            删除切换条件时需要确认。
          </ProForm.Item>
        </ProForm.Group>
        <ProForm.Group title="切换选项">
          <ProFormSelect label="初始情景模式" />
          <ProForm.Item help="解锁一些新种类的、功能强大的但难以掌握的切换条件。对于大多数情况来说，基本条件类型应该就足够，因此不推荐该选项。">
            <Checkbox>显示高级切换条件</Checkbox>
          </ProForm.Item>
          <ProFormCheckbox>快速切换</ProFormCheckbox>
        </ProForm.Group>
        <ProForm.Group title="网络请求">
          <ProFormCheckbox help="启用此选项后，如有资源加载失败，则图标上会显示数字提示。此时，您可以通过弹出菜单一次设置这些资源使用的情景模式，操作十分便捷。">
            在图标上显示当前页面中由于网络原因而未加载的资源数量。
          </ProFormCheckbox>
        </ProForm.Group>
        <ProForm.Group title="下载选项">
          <ProFormSelect
            label="更新时间"
            help="设置规则列表和PAC脚本的更新间隔。"
          ></ProFormSelect>
        </ProForm.Group>
        <ProForm.Group title="冲突">
          <ProFormCheckbox help="启用此选项后，如有资源加载失败，则图标上会显示数字提示。此时，您可以通过弹出菜单一次设置这些资源使用的情景模式，操作十分便捷。">
            在图标上显示当前页面中由于网络原因而未加载的资源数量。
          </ProFormCheckbox>
        </ProForm.Group>
        <ProForm.Group title="下载选项">
          <ProFormCheckbox help="选择了  [系统代理] 的情况下，您可以在弹出菜单中选择  (外部情景模式) 来导入其他应用提供的代理设置。导入的设置将会成为一个新的情景模式，其名称由您决定。请注意导入的情景模式只是当时的一个快照，导入后不会随着原来的应用更新。">
            在弹出菜单中显示菜单项，以导入其他应用提供的代理设置。
          </ProFormCheckbox>
        </ProForm.Group>
        <ProForm.Group title="冲突">
          <ProFormCheckbox
            help="启用此选项后，如有资源加载失败，则图标上会显示数字提示。
此时，您可以通过弹出菜单一次设置这些资源使用的情景模式，操作十分便捷。"
          >
            在图标上显示当前页面中由于网络原因而未加载的资源数量。
          </ProFormCheckbox>
        </ProForm.Group>
        <ProForm.Group title="下载选项">
          <ProFormCheckbox help="如果您需要发布规则列表给那些软件的用户，请启用此选项。建议您提醒订阅者升级到 SwitchyOmega 以享受新版功能。">
            导出规则列表时使用 Proxy Switchy!/SwitchyPlus/SwitchySharp
            兼容格式。
          </ProFormCheckbox>
        </ProForm.Group>
        <ProForm.Group title="选项">
          <ProFormCheckbox help="如果您需要发布规则列表给那些软件的用户，请启用此选项。建议您提醒订阅者升级到 SwitchyOmega 以享受新版功能。">
            导出规则列表时使用 Proxy Switchy!/SwitchyPlus/SwitchySharp
            兼容格式。
          </ProFormCheckbox>
        </ProForm.Group>
        <ProForm.Group title="选项同步">
          <ProFormCheckbox help="如果您需要发布规则列表给那些软件的用户，请启用此选项。建议您提醒订阅者升级到 SwitchyOmega 以享受新版功能。">
            导出规则列表时使用 Proxy Switchy!/SwitchyPlus/SwitchySharp
            兼容格式。
          </ProFormCheckbox>
        </ProForm.Group>
      </ProForm>
    </PageView>
  );
};

export default Settings;
