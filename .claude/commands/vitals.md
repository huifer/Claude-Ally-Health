---
description: 快速记录血压、血糖等生命体征
arguments:
  - name: type
    description: 生命体征类型：bp(血压)/glucose(血糖)
    required: true
  - name: value
    description: 测量值（如128/82、5.8等）
    required: true
  - name: timing
    description: 测量时间（早上、晚上、空腹、餐后等）
    required: false
---

# 生命体征记录

快速记录家庭血压和血糖测量值。

## 使用方法

### 记录血压

**格式：** `/vitals bp [收缩压/舒张压] [时间描述]`

**示例：**
```
/vitals bp 128/82
/vitals bp 135/88 晚上
/vitals bp 125/80 早晨
/vitals bp 130/85 餐后
```

### 记录血糖

**格式：** `/vitals glucose [血糖值] [时机描述]`

**示例：**
```
/vitals glucose 5.8
/vitals glucose 6.5 空腹
/vitals glucose 8.2 餐后2小时
/vitals glucose 4.2 睡前
```

## 快速查看

### 查看今日记录

```
/vitals today
/vitals history today
```

### 查看本周记录

```
/vitals week
/vitals history week
```

### 查看血压历史

```
/vitals bp history
```

### 查看血糖历史

```
/vitals glucose history
```

## 测量规范

### 血压测量规范

✅ **正确做法：**
- 测量前静坐休息5分钟
- 坐位，脚平放地面，背部有支撑
- 手臂放在心脏水平位置
- 不要说话，保持安静
- 每天早晚各测量一次
- 早晨：起床后、服药前、早餐前
- 晚上：睡前、服药后

❌ **常见错误：**
- 测量前刚运动或吸烟
- 谈话或看手机
- 手臂位置过高或过低
- 袖带过松或过紧
- 膀胱充盈（憋尿）

### 血糖测量规范

✅ **正确做法：**
- 洗手并擦干（避免影响结果）
- 首滴血擦去，使用第二滴
- 血糖试纸未过期
- 血糖仪定期校准

⏰ **测量时机：**
- 空腹：至少8小时未进食
- 餐前：计划进食前测量
- 餐后2小时：从开始进餐计时2小时
- 睡前：准备睡觉前测量

## 数据存储

所有记录存储在：
- `data/vital-signs-logs/YYYY-MM/YYYY-MM-DD.json`

可通过 `/quality hypertension status` 或 `/quality diabetes status` 查看质量分析。

## 相关命令

- `/quality hypertension status` - 查看血压控制质量
- `/quality diabetes status` - 查看血糖控制质量
- `/quality trends` - 查看趋势分析
- `/quality recommendations` - 获取个性化建议
