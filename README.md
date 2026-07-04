# 超级员工本地版

这是从原安装包反推后重建的本地优先桌面版 MVP。

当前重点不是复刻原软件所有云端能力，而是先保留一个可维护、可运行、无远程 API 的基础版本：

- Electron 桌面应用
- SQLite 本地数据库
- 工作台
- 客户库
- 任务库
- 素材库
- JSON 导入导出

## 项目目录

```text
super-employee-local-mvp/
```

## 运行方式

```bash
cd super-employee-local-mvp
npm install
npm start
```

## 检查命令

```bash
npm run check
npm run db:check
npm run smoke
```

## 当前边界

当前版本不包含：

- 登录
- 远程 API
- OSS 上传
- AI 扣点
- 企微、BOSS、抖音、快手、小红书自动化

这些能力应该等本地 MVP 稳定后，再按模块逐步扩展。
