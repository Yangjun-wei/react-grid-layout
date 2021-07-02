import 'react-hot-loader';
import { hot } from 'react-hot-loader/root'; // 热更新包
import DevLayout from './examples/0-showcase.jsx';
import makeLayout from './test-hook';

// 高阶组件函数，根据传入的组件返回一个新的组件
// 一旦bundle.js被加载，就会执行这行语句，挂在组件到id为content的div里
const Layout = makeLayout(DevLayout);

export default hot(Layout);
