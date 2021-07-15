import React, { lazy, Suspense } from "react";

const AppRemotePage = lazy(() => import("app_remote/page"));

const Header = () => {
  return (
    <div
      style={{
        alignItems: "center",
        background: "#3498db",
        color: "#ecf0f1",
        flex: 1,
        display: "flex",
        fontFamily: "Arial",
        fontSize: 18,
        justifyContent: "center",
        lineHeight: "22px",
        padding: 32,
        textTransform: "uppercase",
      }}
    >
      App Host
    </div>
  );
};

type RemoteWrapperProps = {
  children: React.ReactNode;
};

const RemoteWrapper = ({ children }: RemoteWrapperProps) => {
  return (
    <div
      style={{
        alignItems: "center",
        background: "#e74c3c",
        color: "#ecf0f1",
        flex: 1,
        display: "flex",
        fontFamily: "Arial",
        fontSize: 18,
        justifyContent: "center",
        lineHeight: "22px",
        padding: 32,
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
};

export const AppHostPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Header />
      <Suspense fallback="Loading...">
        <RemoteWrapper>
          <AppRemotePage />
        </RemoteWrapper>
      </Suspense>
    </div>
  );
};
