import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// 渲染方法
function render(props) {
  const { container } = props;

  ReactDOM.createRoot(
    container
      ? container.querySelector("#root")
      : document.querySelector("#root")
  ).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

// 子应用接入qiankun
// 1. 导出三个必要的生命周期钩子函数
// bootstrap 渲染之前
// mount 渲染函数
// unmount 卸载函数

export async function bootstrap() {
  console.log("subapp bootstraped");
}

export async function mount(props) {
  console.log("mount subapp");
  render(props);
}

export async function unmount(props) {
  const { container } = props;
  if (ReactDOM.unmountComponentAtNode) {
    console.log("ddddd---===");
    ReactDOM.unmountComponentAtNode(
      container
        ? container.querySelector("#root")
        : document.querySelector("#root")
    );
  }
  // ReactDOM.unmount();
  // ReactDOM.hydrateRoot(
  //   container
  //     ? container.querySelector("#root")
  //     : document.querySelector("#root")
  // );
  // componentWillUnmount
  // ReactDOM.unmountComponentAtNode(document.getElementById("root"));
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
