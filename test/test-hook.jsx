import React from "react";
import ReactDOM from "react-dom";
// 内联loader
import "style-loader!css-loader!../css/styles.css";
import "style-loader!css-loader!../examples/example-styles.css";
typeof window !== "undefined" && (window.React = React); // for devtools

export default function makeLayout(Layout) {
  // Basic layout that mirrors the internals of its child layout by listening to `onLayoutChange`.
  // It does not pass any other props to the Layout.
  class ListeningLayout extends React.Component {
    state = { layout: [] };

    // 设置layout
    onLayoutChange = layout => {
      this.setState({ layout: layout });
    };

    // 将this.state.layout转成ReactNode数组
    stringifyLayout() {
      return this.state.layout.map(function (l) {
        const name = l.i === "__dropping-elem__" ? "drop" : l.i;
        return (
          <div className="layoutItem" key={l.i}>
            <b>{name}</b>
            {`: [${l.x}, ${l.y}, ${l.w}, ${l.h}]`}
          </div>
        );
      });
    }

    render() {
      return (
        // 严格模式
        <React.StrictMode>
          <div>
            <div className="layoutJSON">
              Displayed as <code>[x, y, w, h]</code>:
              <div className="columns">{this.stringifyLayout()}</div>
            </div>
            {/* 高阶函数传入的组件*/}
            <Layout onLayoutChange={this.onLayoutChange} />
          </div>
        </React.StrictMode>
      );
    }
  }

  function run() {
    const contentDiv = document.getElementById("content");
    const gridProps = window.gridProps || {};
    ReactDOM.render(
      React.createElement(ListeningLayout, gridProps),
      contentDiv
    );
  }
  if (!document.getElementById("content")) {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  return ListeningLayout;
}
