# B2B Customer Intelligence MVP v1.0

基于AI的B2B客户情报分析系统，专注于欧洲LED照明市场。自动抓取客户网站、搜索商业情报、生成完整的11部分专业分析报告。

## 功能特性

- **智能数据采集**：自动抓取客户网站 + Tavily多维度搜索补充
- **11部分分析框架**：执行摘要、公司概况、产品业务、市场客户、制造供应链、财务状况、竞争格局、决策者地图、产品匹配、成交策略、行动计划
- **产品匹配评估**：4类产品（Universal Replacement / GR6D / LITA Track / LED Trunking）精准匹配
- **成交概率预测**：基于多维度数据智能评估
- **一键部署**：支持Vercel一键部署上线

## 技术栈

- **前端**：Next.js 14 + React + TypeScript + Tailwind CSS
- **后端**：Next.js API Routes (Serverless)
- **AI引擎**：OpenAI GPT-4o (via Vercel AI SDK)
- **搜索**：Tavily API
- **网页抓取**：原生fetch + Cheerio
- **部署**：Vercel

---

## 新手小白操作指南（详细步骤）

### 前置条件

你需要：
1. **Node.js** (版本 18 或更高) - [下载地址](https://nodejs.org/)
2. **Git** (可选，用于版本控制) - [下载地址](https://git-scm.com/)
3. **OpenAI API Key** - [获取地址](https://platform.openai.com/api-keys)
4. **Tavily API Key** - [获取地址](https://app.tavily.com/home)

### 步骤1：获取API密钥

#### 1.1 获取 OpenAI API Key
1. 访问 https://platform.openai.com/api-keys
2. 登录/注册 OpenAI 账号
3. 点击 "Create new secret key"
4. 复制生成的密钥（以 `sk-` 开头）
5. **重要**：新账号有 $5 免费额度，足够测试使用

#### 1.2 获取 Tavily API Key
1. 访问 https://app.tavily.com/home
2. 用邮箱注册账号
3. 进入 Dashboard，点击 "API Keys"
4. 复制 API Key（以 `tvly-` 开头）
5. **重要**：免费版每月 1,000 次搜索，足够使用

### 步骤2：安装依赖

打开终端（Windows按 `Win+R`，输入 `cmd` 回车），执行：

```bash
# 进入项目目录
cd b2b-customer-intelligence-mvp

# 安装依赖（需要Node.js 18+）
npm install
```

等待安装完成（大约1-3分钟）。

### 步骤3：配置环境变量

1. 在项目根目录找到 `.env.example` 文件
2. 复制一份，重命名为 `.env.local`
3. 用记事本打开 `.env.local`
4. 填入你的API密钥：

```env
OPENAI_API_KEY=sk-你的OpenAI-API-Key
TAVILY_API_KEY=tvly-你的Tavily-API-Key
```

5. 保存并关闭文件

### 步骤4：本地运行测试

在终端中执行：

```bash
npm run dev
```

等待出现以下提示：
```
> ready on http://localhost:3000
```

打开浏览器，访问 http://localhost:3000

你应该看到系统首页。输入一个测试客户：
- 客户名称: `DOTLUX GmbH`
- 官方网站: `dotlux.de`
- 国家/地区: `Germany`

点击"生成情报分析报告"，等待30-60秒，查看报告输出。

### 步骤5：部署到Vercel（上线）

#### 5.1 注册Vercel账号
1. 访问 https://vercel.com/signup
2. 用GitHub账号或邮箱注册

#### 5.2 安装Vercel CLI（命令行工具）

在终端中执行：

```bash
# 全局安装Vercel CLI
npm install -g vercel

# 登录Vercel（会打开浏览器让你授权）
vercel login
```

#### 5.3 部署项目

```bash
# 在项目根目录执行
vercel
```

按照提示操作：
- 确认项目路径（按回车）
- 确认或修改项目名称（按回车）
- 选择范围（按回车）

等待部署完成，你会得到一个线上URL，例如：
```
https://b2b-customer-intelligence-mvp-xxx.vercel.app
```

#### 5.4 配置环境变量（线上）

1. 访问 https://vercel.com/dashboard
2. 找到你的项目，点击进入
3. 点击顶部 "Settings" 标签
4. 左侧菜单点击 "Environment Variables"
5. 添加两个环境变量：
   - Name: `OPENAI_API_KEY` → Value: 你的OpenAI Key
   - Name: `TAVILY_API_KEY` → Value: 你的Tavily Key
6. 点击 "Save"
7. 回到项目页面，点击 "Redeploy" 重新部署

#### 5.5 完成

现在你的B2B客户情报分析系统已经上线了！

访问你的Vercel URL即可使用。可以分享给同事或客户。

---

## 常见问题

### Q: 安装依赖时报错？
A: 确保Node.js版本 >= 18。在终端执行 `node -v` 查看版本。如果版本过低，去 https://nodejs.org/ 下载最新LTS版本。

### Q: 分析时报错 "API Key无效"？
A: 检查 `.env.local` 文件中的API Key是否正确复制，不要有多余的空格。OpenAI Key以 `sk-` 开头，Tavily Key以 `tvly-` 开头。

### Q: 网页抓取失败？
A: 某些网站有反爬虫机制。系统会自动处理大部分情况。如果特定网站总是失败，可以尝试手动搜索补充信息。

### Q: 报告生成很慢？
A: 正常。整个流程涉及网页抓取（5-10秒）+ 多次搜索（10-20秒）+ AI生成（15-30秒），总计30-60秒。

### Q: 免费额度用完了怎么办？
A: OpenAI $5免费额度大约可以生成50-80份报告。用完后需要充值（按量付费，GPT-4o约 $0.005/1K tokens，每份报告约 $0.10-0.30）。Tavily免费版每月1,000次搜索，通常够用。

---

## 进阶配置

### 自定义提示词
编辑 `lib/prompts.ts` 中的 `SYSTEM_PROMPT` 可以调整AI的分析风格和输出格式。

### 添加更多搜索查询
编辑 `app/api/analyze/route.ts` 中的 `searchQueries` 数组，添加针对特定行业或客户的搜索策略。

### 更换AI模型
在 `app/api/analyze/route.ts` 中，将 `openai('gpt-4o')` 改为其他模型：
- `openai('gpt-4o-mini')` - 更快更便宜
- `openai('gpt-4-turbo')` - 更高质量但更贵

---

## 项目结构

```
b2b-customer-intelligence-mvp/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts      # 核心分析API
│   ├── globals.css            # 全局样式
│   ├── layout.tsx             # 根布局
│   └── page.tsx               # 首页
├── components/
│   ├── AnalysisForm.tsx       # 输入表单
│   ├── LoadingState.tsx       # 加载动画
│   └── ReportView.tsx         # 报告展示
├── lib/
│   ├── prompts.ts             # AI提示词
│   └── tools.ts               # 网页抓取/搜索工具
├── .env.example               # 环境变量模板
├── next.config.js             # Next.js配置
├── package.json               # 依赖配置
├── tailwind.config.ts         # Tailwind配置
└── README.md                  # 本文件
```

---

## 许可证

MIT License - 可自由使用、修改、分发。
