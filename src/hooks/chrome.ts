import { useAppDispatch } from ".";
import { ProfileType } from "../helper/constant";
import { setActiveId } from "../store/popupSlice";

interface InvokeParams<T = unknown> {
  message: string;
  params?: T;
}

interface InvokeResponse<T = unknown> {
  status: number;
  message: string;
  data: T;
}

export async function invoke<T extends InvokeParams, R extends InvokeResponse>(
  req: T,
) {
  const resp = await chrome.runtime.sendMessage<T, R>(req);
  if (!resp) throw new Error("error");
  const { status, message, data } = resp;

  if (status !== 0) {
    throw new Error(message || "error");
  }

  return data;
}

export default function useChrome() {
  const dispatch = useAppDispatch();

  // 设置直接连接
  async function setDirect(activeId: string | number) {
    dispatch(setActiveId(`${activeId}`));
    await chrome.storage.local.set({ activeId });
    return invoke({ message: "setDirect" });
  }

  // 设置系统代理
  async function setSystem(activeId: string | number) {
    dispatch(setActiveId(`${activeId}`));
    await chrome.storage.local.set({ activeId });
    return invoke({ message: "setSystem" });
  }

  // 通过配置设置代理
  async function setProfile(profile: ProfileType) {
    const activeId = `${profile.id}`;
    dispatch(setActiveId(activeId));
    await chrome.storage.local.set({ activeId });
    return invoke({ message: "setProfile", params: profile });
  }

  return {
    setDirect,
    setSystem,
    setProfile,
  };
}
