# 🚀 GitHub Pages 部署指南

## 📋 部署步骤

### 1. 创建GitHub仓库

1. **访问GitHub**：
   - 打开 https://github.com
   - 点击右上角的 "+" 按钮
   - 选择 "New repository"

2. **仓库设置**：
   - Repository name: `pigeon-reminder`
   - Description: `🕊️ 鸽子提醒器 - 用天体距离幽默提醒迟到的朋友们`
   - 选择 **Public**（GitHub Pages免费版需要公开仓库）
   - **不要**勾选 "Add a README file"（我们已经有了）
   - 点击 "Create repository"

### 2. 上传项目文件

#### 方法A：使用GitHub网页界面（推荐新手）

1. **批量上传**：
   - 在新建的仓库页面，点击 "uploading an existing file"
   - 将以下文件拖拽到页面：
     - `index.html`
     - `script.js`
     - `package.json`
     - `README.md`
     - `.gitignore`
     - `.github/workflows/deploy.yml`

2. **提交更改**：
   - Commit message: `Initial commit: 鸽子提醒器项目`
   - 点击 "Commit changes"

#### 方法B：使用Git命令行

```bash
# 克隆仓库
git clone https://github.com/你的用户名/pigeon-reminder.git
cd pigeon-reminder

# 复制项目文件到仓库目录
# 将本项目的所有文件复制到克隆的目录中

# 添加文件
git add .

# 提交
git commit -m "Initial commit: 鸽子提醒器项目"

# 推送
git push origin main
```

### 3. 启用GitHub Pages

1. **进入仓库设置**：
   - 在仓库页面点击 "Settings" 标签
   - 在左侧菜单中找到 "Pages"

2. **配置部署源**：
   - Source: 选择 "GitHub Actions"
   - 这将使用我们配置的自动部署流程

3. **等待部署**：
   - 部署通常需要1-3分钟
   - 可以在 "Actions" 标签中查看部署进度

### 4. 访问网站

部署完成后，你的网站将在以下地址可用：

```
https://你的用户名.github.io/pigeon-reminder/
```

## 📱 iOS访问测试

部署完成后，在iOS设备上：

1. **打开Safari浏览器**
2. **访问你的GitHub Pages地址**
3. **测试功能**：
   - 输入朋友名字和游戏名称
   - 设置等待时间
   - 点击"生成天体提醒明信片"
   - 测试明信片生成和下载功能

## 🔧 故障排除

### 如果网站无法访问：

1. **检查仓库设置**：
   - 确保仓库是Public
   - 确保Pages设置正确

2. **检查文件结构**：
   ```
   pigeon-reminder/
   ├── index.html          # 主页面
   ├── script.js           # 核心功能
   ├── package.json        # 项目配置
   ├── README.md           # 项目说明
   ├── .gitignore          # Git忽略文件
   └── .github/
       └── workflows/
           └── deploy.yml  # 自动部署配置
   ```

3. **检查部署状态**：
   - 进入仓库的 "Actions" 标签
   - 查看最新的部署是否成功
   - 如果失败，点击查看错误日志

### 如果部署失败：

1. **检查文件编码**：
   - 确保所有文件都是UTF-8编码
   - 特别是包含中文的文件

2. **检查文件权限**：
   - 确保所有文件都已正确上传
   - 检查是否有文件被.gitignore忽略

## 🎉 部署完成后的优势

- ✅ **HTTPS安全连接**：iOS完美支持
- ✅ **全球CDN加速**：访问速度快
- ✅ **完全免费**：无需付费
- ✅ **自动更新**：推送代码自动重新部署
- ✅ **移动设备友好**：iOS、Android都可以正常访问
- ✅ **分享方便**：可以直接分享链接给朋友

## 📞 需要帮助？

如果在部署过程中遇到问题：

1. 检查GitHub Actions的部署日志
2. 确认所有文件都已正确上传
3. 验证仓库设置是否正确
4. 等待几分钟让DNS传播生效

---

**祝你部署顺利！** 🚀✨

部署完成后，你就可以在任何设备（包括iOS）上访问你的鸽子提醒器了！