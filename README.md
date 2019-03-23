## 所用的库

[vue](https://cn.vuejs.org/v2/guide/)  
[Vant](https://youzan.github.io/vant/#/zh-CN/intro)  
[axios](https://github.com/axios/axios)  
[vue-cli](https://cli.vuejs.org/config/)

## 构建方法

1. 安装 node
2. `npm install` 安装依赖
3. `npm run build` 构建项目

## 部署

将生成的 `dist` 目录下的静态文件放到域名的根路径, 
配置指向 `index.html` 文件路径.

nginx 示例:
```nginx
location / {
  root /dist;
  index index.html;
}
```

如果需放到子目录, 可以到 `vue.config.js` 里面修改 `publicPath` .

