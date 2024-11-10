## 安装
```
npm install element-plus
```

## 配置
```
import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'; // 引入 Element Plus 的样式
import * as ElementPlusIconsVue from '@element-plus/icons-vue'; // 引入图标库

const app = createApp(App);

// 注册 Element Plus
app.use(ElementPlus);

// 注册 Element Plus 的图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount('#app');
```