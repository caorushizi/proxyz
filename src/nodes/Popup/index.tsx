import { Skeleton, Space } from "antd";
import React, { Suspense, lazy, useEffect } from "react";
import { initPopup, selectPopupState } from "../../store/popupSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { PopupPageType } from "../../helper/constant";
import { initProfilesAction } from "../../store/profilesSlice";

const PopupMenu = lazy(() => import("./components/PopupMenu"));
const FailedToLoad = lazy(() => import("./components/FailedToLoad"));
const AddConditions = lazy(() => import("./components/AddConditions"));

const renderSkeleton = (width: number = 230) => {
  return (
    <Space direction="vertical" style={{ width, padding: 10 }} size="large">
      <Skeleton.Input size="large" active block />
      <Skeleton.Input size="large" active block />
      <Skeleton.Input size="large" active block />
      <Skeleton.Input size="large" active block />
    </Space>
  );
};

const Popup = () => {
  const dispatch = useAppDispatch();
  const popupState = useAppSelector(selectPopupState);

  useEffect(() => {
    dispatch(initProfilesAction());
    dispatch(initPopup());
  }, []);

  return (
    <>
      {popupState.page === PopupPageType.PopupMenu && (
        <Suspense fallback={renderSkeleton()}>
          <PopupMenu />
        </Suspense>
      )}
      {popupState.page === PopupPageType.FailedToLoad && (
        <Suspense fallback={renderSkeleton(380)}>
          <FailedToLoad />
        </Suspense>
      )}
      {popupState.page === PopupPageType.AddConditions && (
        <Suspense fallback={renderSkeleton(380)}>
          <AddConditions />
        </Suspense>
      )}
    </>
  );
};

export default Popup;
