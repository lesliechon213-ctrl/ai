# 超级员工本地版 MVP

这是从安装包反推后升级出的 Electron + SQLite 桌面版原型。

## 当前范围

- 工作台
- 客户库
- 任务库
- 素材库
- 本地 SQLite 持久化
- JSON 导入导出

## 明确不做

- 不登录
- 不请求远程 API
- 不接 OSS 上传
- 不接 AI 扣点
- 不接企微、BOSS、抖音、快手、小红书自动化

## 运行方式

首次使用先安装依赖：

```bash
npm install
```

启动桌面应用：

```bash
npm start
```

基础检查：

```bash
npm run check
npm run db:check
npm run smoke
```

## 数据库位置

Electron 正式运行时会把 SQLite 数据库放在系统用户数据目录，设置页会显示实际路径。

数据库文件名：

```text
super_employee_local.db
```

## 为什么先做这一版

原软件接口数量很多，直接删除 API 会导致大量功能不可用。这个版本先把产品压缩成“客户、任务、素材、工作台”四个核心模块，让项目先变成一个可理解、可运行、可保存数据的桌面应用。

## 后续路线

1. 把页面继续拆成组件。
2. 给 SQLite 增加编辑能力和更完整的查询。
3. 加打包脚本，生成 Windows 安装包。
4. 需要云端时，再单独增加 API 适配层。
