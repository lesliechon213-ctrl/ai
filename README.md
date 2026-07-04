# 超级员工无 API 开发者版

这是 `AI超级员工系统` 的无 API 开发者版桌面框架。

当前版本只保留 Electron 软件外壳、本地导航、本地页面骨架和开发调试能力。远程接口、云端业务入口、账号激活、算力消费和依赖远程服务的模块已从源码删除。

## 运行

```bash
npm install
npm start
```

## 检查

```bash
npm run check
npm run scan:no-api
npm run smoke
```

## 打包

```bash
npm run package:win
```

打包产物会生成在 `dist/`，不提交到 Git。仓库中的 CI 会在 Windows 环境自动构建并上传 artifact。
