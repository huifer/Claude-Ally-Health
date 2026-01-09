# 暖绿色健康管理系统 - 设计系统

## 设计原则

**单一暖绿色主题** - 简化、清爽、专业的医疗健康界面

我们使用 **142° 色相的绿色**，比 Emerald (158°) 更暖，更具健康治愈感。本设计系统采用单一亮色主题，专注于提供清晰、一致的用户体验。

#### Primary 色阶

| 色值 | 用途 | 示例 |
|------|------|------|
| `primary-50` `#F0FDF4` | 背景强调 | 卡片悬停状态 |
| `primary-100` `#DCFCE7` | 浅背景 | 次要背景 |
| `primary-200` `#BBF7D0` | 边框高亮 | 输入框边框 |
| `primary-300` `#86EFAC` | 禁用状态 | 禁用按钮背景 |
| `primary-400` `#4ADE80` | 轻量强调 | 图标背景 |
| `primary-500` `#22C55E` | 标准绿 | 次要按钮 |
| `primary-600` `#16A34A` | **主色** | 主要按钮、Logo |
| `primary-700` `#15803D` | 深色强调 | 深色背景文字 |
| `primary-800` `#166534` | 深色 | 导航栏深色 |
| `primary-900` `#14532D` | 最深色 | 页脚背景 |
| `primary-950` `#052E16` | 近黑 | 极深背景 |

### 语义色彩

#### Success (成功)
- **颜色**: `primary-600` (#16A34A)
- **用途**: 成功状态、正常指标、完成操作
- **示例**: ✓ 检查结果正常

#### Warning (警告)
- **颜色**: `#F59E0B` (Amber 500)
- **用途**: 警告状态、需要注意的指标
- **示例**: ⚠ 血糖偏高

#### Danger (危险)
- **颜色**: `#EF4444` (Red 500)
- **用途**: 危险状态、异常指标、删除操作
- **示例**: ⚠ 检查异常

#### Info (信息)
- **颜色**: `#06B6D4` (Cyan 500)
- **用途**: 信息提示、链接
- **示例**: ℹ 更多信息

### 中性色 (Gray)

完整的灰度色阶用于文本、边框、背景：

| 色值 | 用途 | 对比度 |
|------|------|--------|
| `gray-50` `#F9FAFB` | 浅背景 | 与深色文字 16.5:1 ✓ |
| `gray-100` `#F3F4F6` | 次要背景 | 与深色文字 13.8:1 ✓ |
| `gray-200` `#E5E7EB` | 边框 | 与深色文字 10.5:1 ✓ |
| `gray-400` `#9CA3AF` | 禁用文本 | 与白色背景 3.1:1 ✓ |
| `gray-500` `#6B7280` | 次要文本 | 与白色背景 5.3:1 ✓ |
| `gray-600` `#4B5563` | 标准文本 | 与白色背景 8.1:1 ✓ |
| `gray-900` `#111827` | 主要文本 | 与白色背景 16.8:1 ✓ |

## 使用指南

### 组件着色规则

#### ✅ 正确做法
```tsx
// 使用语义化色彩类名
<div className="bg-primary-600 text-white">主要按钮</div>
<div className="bg-success text-white">成功状态</div>
<div className="bg-warning text-white">警告</div>
<div className="bg-danger text-white">危险</div>
<div className="text-gray-900">主要文本</div>
```

#### ❌ 错误做法
```tsx
// 不要使用硬编码的颜色
<div className="bg-blue-500">错误</div>
<div className="bg-purple-500">错误</div>
<div className="bg-orange-500">错误</div>

// 不要使用混合的系统颜色
<div className="bg-emerald-500">错！用 primary-600</div>
<div className="bg-green-500">错！用 primary-500</div>
```

### 交互状态

#### 悬停 (Hover)
```tsx
// 所有可点击元素都应该有悬停状态
<button className="bg-primary-600 hover:bg-primary-700">
  按钮
</button>

<div className="hover:bg-primary-50 hover:border-primary-200 cursor-pointer">
  卡片
</div>
```

#### 焦点 (Focus)
```tsx
// 所有交互元素都应有明显的焦点状态
<input className="focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
```

### 暗色模式

所有组件都应支持暗色模式：

```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  自适应明暗模式的内容
</div>
```

### 对比度要求

根据 WCAG AA 标准：

- **普通文本**: 最小对比度 4.5:1
- **大文本 (18px+)**: 最小对比度 3:1
- **UI 组件**: 最小对比度 3:1

我们的颜色系统全部符合这些要求。

## 组件示例

### 按钮
```tsx
// 主要按钮
<Button className="bg-primary-600 hover:bg-primary-700 text-white">
  保存
</Button>

// 次要按钮
<Button className="bg-primary-500 hover:bg-primary-600 text-white">
  取消
</Button>

// 危险操作
<Button className="bg-danger hover:bg-red-600 text-white">
  删除
</Button>
```

### 卡片
```tsx
<Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all cursor-pointer">
  {/* 内容 */}
</Card>
```

### 状态标签
```tsx
// 正常
<Badge className="bg-success/10 text-success border-success/20">
  正常
</Badge>

// 警告
<Badge className="bg-warning/10 text-warning border-warning/20">
  偏高
</Badge>

// 危险
<Badge className="bg-danger/10 text-danger border-danger/20">
  异常
</Badge>
```

### 导航
```tsx
// 激活状态
<nav className="bg-primary-600 text-white">
  {/* 导航项 */}
</nav>

// 悬停状态
<nav className="hover:bg-primary-50 dark:hover:bg-gray-800">
  {/* 导航项 */}
</nav>
```

## 最佳实践

### 1. 一致性
- 始终使用 `primary-*` 色阶作为主要颜色
- 使用语义化颜色 (`success`, `warning`, `danger`)
- 不要在同一个组件中混合多种绿色

### 2. 可访问性
- 确保文本和背景有足够的对比度
- 所有交互元素都应有 `:hover` 和 `:focus` 状态
- 为色盲用户提供额外的视觉提示（图标 + 颜色）

### 3. 层次感
- 使用 `primary-50/primary-100` 创建层次
- 使用 `gray-*` 色阶创建视觉层次
- 避免使用过多鲜艳的颜色

### 4. 留白
- 使用充足的留白提升可读性
- 相关元素使用 `space-*` 工具类
- 使用 `p-*` 和 `m-*` 创建一致的间距

## 快速参考

### 常用组合

```tsx
// 登录/注册页面
bg-gradient-to-br from-primary-50 to-primary-100

// 数据卡片
bg-white border-gray-200 hover:border-primary-300 hover:shadow-lg

// 表格行
hover:bg-primary-50 border-b border-gray-100

// 输入框
border-gray-300 focus:border-primary-500 focus:ring-primary-500

// 进度条
bg-primary-600

// 图表
线条: primary-600
填充: primary-100
```

## 迁移指南

如果您发现项目中仍在使用旧的颜色系统，请按以下方式替换：

| 旧颜色 | 新颜色 |
|--------|--------|
| `bg-primary` | `bg-primary-600` |
| `text-primary` | `text-primary-600` |
| `bg-blue-*` | `bg-primary-*` |
| `bg-purple-*` | `bg-primary-*` |
| `bg-orange-*` | `bg-warning` 或 `bg-primary-*` |
| `bg-red-*` | `bg-danger` |
| `bg-emerald-*` | `bg-primary-*` |

---

**注意**: 本设计系统是医疗健康应用的标准，所有新功能都应遵循这些色彩和样式规范。
