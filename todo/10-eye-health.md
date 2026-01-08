# 眼健康功能扩展提案

**模块编号**: 10
**分类**: 通用功能扩展 - 眼健康
**状态**: ✅ 已完成
**优先级**: 中
**创建日期**: 2025-12-31
**完成日期**: 2026-01-06

---

## 功能概述

眼健康模块提供全面的视力、眼部检查和眼病筛查管理。

### 核心功能

1. **视力记录** - 裸眼视力、矫正视力、近视度数
2. **眼部检查记录** - 眼压、眼底检查
3. **眼病筛查** - 青光眼、白内障、黄斑变性
4. **用眼习惯** - 屏幕时间、户外活动、20-20-20法则

---

## 数据结构

```json
{
  "eye_health": {
    "vision": {
      "date": "2025-06-15",
      "left_eye": {
        "uncorrected": "0.5",
        "corrected": "1.0",
        "sphere": -3.50,
        "cylinder": -0.50,
        "axis": 180
      },
      "right_eye": {
        "uncorrected": "0.4",
        "corrected": "1.0",
        "sphere": -4.00,
        "cylinder": -0.75,
        "axis": 175
      }
    },

    "intraocular_pressure": {
      "left": 15,
      "right": 16,
      "reference": "10-21",
      "date": "2025-06-15"
    },

    "fundus_exam": {
      "date": "2025-06-15",
      "findings": "normal"
    },

    "screening_reminders": {
      "glaucoma": "2026-06-15",
      "diabetic_retinopathy": "2025-12-15"
    }
  }
}
```

---

## 命令接口

```bash
/vision record sphere -3.5 cylinder -0.5 # 记录视力检查
/vision iop 15 16                        # 记录眼压
/vision fundus normal                    # 记录眼底检查
/vision status                           # 查看眼健康状态
```

---

## 注意事项

- 定期眼部检查很重要
- 视力变化需及时就医
- 控制屏幕时间
- 户外活动保护眼睛

---

**文档版本**: v1.0
**最后更新**: 2025-12-31
**维护者**: WellAlly Tech
