# AstroSoul 前端设置指南 ✨

## 快速开始

### 0. 切换到前端目录

> 提示：如果你刚从 Git 克隆仓库，请先进入 `AI-zhanbu` 项目根目录，再切换到前端工程。

```bash
cd path/to/AI-zhanbu/frontend
```

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

然后在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── page.tsx           # 首页
│   │   ├── birth-info/        # 出生信息输入页
│   │   ├── dashboard/         # 命盘仪表盘
│   │   ├── report/
│   │   │   └── spouse/        # 灵魂伴侣报告
│   │   ├── globals.css        # 全局样式
│   │   └── layout.tsx         # 根布局
│   ├── components/
│   │   ├── ui/                # UI 组件库
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Skeleton.tsx
│   │   ├── animations/        # 动画组件
│   │   │   ├── Confetti.tsx
│   │   │   └── FloatingElements.tsx
│   │   └── particles/         # 粒子系统
│   │       └── StarField.tsx
├── public/                    # 静态资源
├── package.json
├── tsconfig.json
├── tailwind.config.js         # Tailwind 配置
└── next.config.js             # Next.js 配置
```

## 设计系统

### 暮光女神配色

```css
/* 主背景 */
--twilight-deep: #1a1430      /* 深紫罗兰 */
--twilight-mystic: #2d1b4e    /* 神秘紫 */

/* 强调色 */
--rose-gold: #E3B37C          /* 天体金 */
--rose-pink: #EAA5C8          /* 玫瑰粉 */
--lavender-light: #BA94FF     /* 薰衣草紫 */
--coral-pink: #FF9AA2         /* 珊瑚粉 */

/* 文本 */
--text-primary: #FFF5F7       /* 温暖的白 */
--text-secondary: #E8C4D8     /* 柔和的粉白 */
--text-muted: #B8A4C9         /* 淡紫灰 */
```

### 字体层级

```css
/* 标题 - Playfair Display */
font-family: 'Playfair Display', serif;

/* 正文 - Inter */
font-family: 'Inter', sans-serif;

/* 装饰/手写 - Dancing Script */
font-family: 'Dancing Script', cursive;
```

## 核心功能

### 🌟 星空粒子背景

使用 `<StarField />` 组件创建动态星空：

```tsx
import StarField from '@/components/particles/StarField';

<div className="relative">
  <StarField />
  <div className="relative z-10">
    {/* 你的内容 */}
  </div>
</div>
```

### 🌸 微动画效果

所有组件都内置了柔和的动画：

- **按钮**: hover 放大 + 发光
- **卡片**: 淡入向上 + hover 上浮
- **输入框**: 聚焦边框渐变
- **加载**: 花瓣绽放动画

### 💕 情感化文案

遵循"像闺蜜，不像专家"的原则：

❌ "您的命盘计算已完成"
✅ "太棒了！你的星盘已经生成了！✨"

## 开发规范

### 1. 组件使用

```tsx
// Button
<Button 
  icon="🌸"
  onClick={handleClick}
  size="lg"
  variant="primary"
>
  开启我的星盘之旅
</Button>

// Card
<Card glow="pink" hover delay={0.2}>
  <h3>标题</h3>
  <p>内容</p>
</Card>

// Input
<Input
  label="你的名字"
  icon={<FiUser />}
  value={name}
  onChange={(e) => setName(e.target.value)}
  error={errors.name}
/>
```

### 2. 颜色使用

```tsx
// 渐变文字
<h1 className="gradient-text">AstroSoul</h1>

// 发光效果
<div className="shadow-glow-pink">...</div>

// 玻璃拟态卡片
<div className="glass-card">...</div>
```

### 3. 动画使用

```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  内容
</motion.div>
```

## 性能优化

- ✅ 使用 Next.js 14 App Router
- ✅ 自动代码分割
- ✅ 骨架屏加载状态
- ✅ 懒加载图片和组件
- ✅ Tailwind CSS 树摇优化

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 常见问题

### Q: 粒子效果不显示？
A: 确保安装了 `tsparticles` 和 `tsparticles-slim`

### Q: 渐变动画不流畅？
A: 检查 `background-size` 和 `animation` 配置

### Q: 字体没有加载？
A: 确认 Google Fonts 链接在 `layout.tsx` 中正确引入

## 下一步

- [ ] 连接后端 API
- [ ] 实现真实的星盘计算
- [ ] 添加支付功能（Stripe）
- [ ] 实现分享功能
- [ ] 添加更多报告类型

---

💫 **祝你开发愉快！让我们一起创造一个温暖、美丽的灵魂探索之地** ✨



