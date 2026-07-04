# 上传状态

本仓库已通过 Codex GitHub 插件上传 Electron + SQLite 本地版 MVP 的核心源码。

## 已上传

- 根目录 README
- 根目录 `.gitignore`
- `super-employee-local-mvp/package.json`
- `super-employee-local-mvp/index.html`
- `super-employee-local-mvp/README.md`
- `super-employee-local-mvp/.gitignore`
- `super-employee-local-mvp/electron/main.js`
- `super-employee-local-mvp/electron/preload.js`
- `super-employee-local-mvp/electron/database.js`
- `super-employee-local-mvp/scripts/check-db.js`
- `super-employee-local-mvp/scripts/electron-smoke.js`
- `super-employee-local-mvp/app.js`
- `super-employee-local-mvp/styles.css`

## 未上传

- `node_modules/`
- `analysis/`
- `output/`
- SQLite 数据库运行文件
- 安装包解包产物
- `package-lock.json`

## 说明

本机 HTTPS 连接 GitHub 失败，SSH 443 可达但本机没有授权 SSH key，因此没有完成标准 `git push`。当前文件是通过 GitHub 插件逐个写入仓库的。

项目可以通过以下方式安装依赖并运行：

```bash
cd super-employee-local-mvp
npm install
npm start
```
