---
name: admin-crud-scaffold
description: '快速搭建管理后台列表页的增删改查功能。当用户要求"创建XX管理页面"、"搭建XX的CRUD"、"新增列表页"、"做XX的增删改查"、"参考用户管理/角色管理做一个XX页面"、"给XX模块做前端页面"、"实现XX的查询新增编辑删除"时触发。自动生成与现有项目风格一致的API层、类型定义和页面组件（hooks/columns/modal/index）。'
---

# Admin CRUD Scaffold

## 目标

根据用户提供的 API 文档，快速生成一套与项目现有风格完全一致的增删改查页面。包含：类型定义、API 层、页面组件（拆分为 hooks / columns / Modal / index）。

## 技术栈约束（严格遵循）

- React 19.2+（函数式组件 + Hooks）
- TypeScript 5.5+（严格模式，禁用 `any`）
- Ant Design 6.3+（`App.useApp()` 获取 message，Modal 用 `destroyOnHidden`）
- React Router 7.x（仅从 `react-router` 导入）
- TanStack Query v5（`useQuery` 查询，`useMutation` 增删改）
- Tailwind CSS（原子类布局，禁止内联 style）
- 图标优先 `lucide-react`

## 工作流程

### 步骤 1：理解需求与读取 API 文档

1. 询问用户（或从上下文推断）：
   - 模块名称（如 menu、dict、log、config）
   - 所属分类（`system` 或 `toc`）
   - API 文档路径（`.md` 或 `.json`）
2. 读取 API 文档，提取以下信息：
   - VO 字段（列表展示用）
   - QueryDTO 字段（查询参数）
   - CreateDTO 字段（新增参数）
   - UpdateDTO 字段（修改参数）
   - 接口路径和方法（GET/POST/PUT/DELETE）
   - 响应成功判定标准（通常是 `code === 0` 或 `code === 200`）

### 步骤 2：分析并补充类型定义

在 `src/types/index.ts` 中补充对应接口。**字段名必须与 API 文档完全一致**。

示例结构：
```typescript
export interface SysXxxVO {
  id: number
  name: string
  // ... 与 API 文档对齐
}

export interface SysXxxQueryDTO {
  name?: string
  status?: number
  pageNum: number
  pageSize: number
}

export interface SysXxxCreateDTO {
  name: string
  status?: number
}

export interface SysXxxUpdateDTO {
  id: number
  name: string
  status?: number
}
```

### 步骤 3：生成 API 层

在 `src/api/{system|toc}/xxx.ts` 中创建 API 函数：

```typescript
import { get, post, put, del } from '../request'
import type { PageResult, SysXxxVO, SysXxxQueryDTO, SysXxxCreateDTO, SysXxxUpdateDTO } from '@/types'

export type { SysXxxVO }

export function getXxxPage(params: SysXxxQueryDTO) {
  return get<PageResult<SysXxxVO>>('/admin/v1/xxx/page', params)
}

export function getXxxDetail(id: number) {
  return get<SysXxxVO>(`/admin/v1/xxx/${id}`)
}

export function createXxx(data: SysXxxCreateDTO) {
  return post<void>('/admin/v1/xxx', data)
}

export function updateXxx(data: SysXxxUpdateDTO) {
  return put<void>('/admin/v1/xxx', data)
}

export function deleteXxx(id: number) {
  return del<void>(`/admin/v1/xxx/${id}`)
}
```

**必须检查**：项目 `request.ts` 的响应拦截器使用 `code !== 0` 还是 `code !== 200` 判定成功，API 层无需处理，但需确认接口返回格式与拦截器匹配。

### 步骤 4：生成页面组件

在 `src/views/{system|toc}/xxx/` 目录下创建 4 个文件。可参考 `references/` 目录下的模板文件进行代码生成：

- `template-hooks.ts` → `hooks.ts`
- `template-columns.tsx` → `columns.tsx`
- `template-modal.tsx` → `XxxModal.tsx`
- `template-index.tsx` → `index.tsx`

#### `hooks.ts` — 数据层

参考 [references/template-hooks.ts](references/template-hooks.ts)。核心结构：

```typescript
import { useState, useCallback } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getXxxPage, deleteXxx, updateXxx, createXxx } from '@/api/{system|toc}/xxx'
import type { SysXxxQueryDTO } from '@/types'

export function useXxxPageQuery() {
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 })
  const [searchParams, setSearchParams] = useState<Partial<SysXxxQueryDTO>>({
    // 各查询字段初始化为 undefined
  })

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['sys-xxx', 'page', pagination, searchParams],
    queryFn: () => {
      const params: SysXxxQueryDTO = {
        pageNum: pagination.current,
        pageSize: pagination.pageSize,
        ...searchParams,
      }
      return getXxxPage(params)
    },
  })

  const refreshList = useCallback(() => refetch(), [refetch])

  return { data, isLoading, pagination, setPagination, searchParams, setSearchParams, refreshList }
}

export function useXxxMutations() {
  const deleteMut = useMutation({ mutationFn: deleteXxx })
  const updateMut = useMutation({ mutationFn: updateXxx })
  const createMut = useMutation({ mutationFn: createXxx })
  return { deleteMut, updateMut, createMut }
}
```

#### `columns.tsx` — 表格列

参考 [references/template-columns.tsx](references/template-columns.tsx)。规范要点：

- 使用 `ColumnsType<SysXxxVO>`
- 状态列用绿色/灰色圆点 + 文字
- 操作列放「编辑」「删除」按钮
- 导出纯函数 `getXxxColumns`，接收 `onEdit` 和 `onDelete` 回调
- **必须用 `useMemo` 包裹 columns 引用**（在 index.tsx 中做）

#### `XxxModal.tsx` — 弹窗表单

参考 [references/template-modal.tsx](references/template-modal.tsx)。规范要点：

- Props 定义 Interface：`open`, `isEdit`, `initialValues`, `confirmLoading`, `onOk`, `onCancel`
- 使用 `Form.useForm()` + `useEffect` 在 `open` 时回显初始值
- 表单 `layout="vertical"`，`preserve={false}`
- Modal 使用 `destroyOnHidden`（Ant Design v6）
- `onOk` 中先 `validateFields()`，再调用外部 `onOk`

#### `index.tsx` — 页面组装层

参考 [references/template-index.tsx](references/template-index.tsx)。页面结构必须遵循以下布局：

```tsx
<PageContainer>
  {/* 搜索区域 */}
  <Card className="mb-5 rounded-xl shadow-sm border-slate-100 overflow-hidden">
    <SearchArea form={searchForm} onSearch={handleSearch} onReset={handleReset} loading={isLoading} defaultVisibleCount={3}>
      {/* 条件项：默认展示 3 个，其余折叠到 Popover */}
    </SearchArea>
  </Card>

  {/* 列表区域 */}
  <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
    <div className="flex justify-between items-center px-6 py-4 border-b border-slate-50">
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 bg-blue-500 rounded-full" />
        <span className="text-base font-semibold text-slate-800">XX列表</span>
      </div>
      <Button type="primary" icon={<Plus size={14} />} onClick={openCreate} className="rounded-lg h-9 px-4 shadow-sm">
        新增XX
      </Button>
    </div>
    <div className="p-6">
      <Table ... />
    </div>
  </div>

  <XxxModal ... />
</PageContainer>
```

### 步骤 5：交互逻辑规范

**删除：**
```typescript
Modal.confirm({
  title: '确认删除',
  content: '删除后该数据将无法恢复，是否确认删除？',
  okText: '确认删除',
  okType: 'danger',
  cancelText: '取消',
  onOk: async () => {
    await deleteMut.mutateAsync(id)
    message.success('删除成功')
    await refreshList()
  },
})
```

**编辑回显：**
1. 打开弹窗 → 显示 loading → 请求详情接口
2. 成功：`setModalInitialValues(detail)`
3. 失败：`message.warning('详情加载失败，已使用列表数据回显')`，用列表 record 兜底

**提交成功：**
```typescript
const handleModalOk = async (values) => {
  if (isEdit) {
    await updateMut.mutateAsync(payload)
    message.success('更新成功')
  } else {
    await createMut.mutateAsync(payload)
    message.success('新增成功')
  }
  setModalOpen(false)
  await refreshList()
}
```

**查询与重置：**
- `handleSearch` 从 form 取值，空值不传，非空值写入 `searchParams`，同时重置 `pagination.current = 1`
- `handleReset` 清空 form 和 searchParams，重置页码

### 步骤 6：TypeScript 编译检查

生成完成后必须运行：
```bash
npx tsc --noEmit
```
确保零类型错误。

## 禁止事项（红线）

1. 禁用 `any`，无法推导时用 `unknown` + 类型断言
2. 禁用 `Record<string, unknown>` 做万能类型
3. 页面内禁止直接 `import axios`，必须走 `api/request.ts` 封装层
4. 禁止 `MOCK_XXX` 硬编码假数据
5. 单文件超过 300 行必须拆分
6. `Table.columns` 必须用 `useMemo` 包裹
7. 禁止内联 `style={{...}}`，统一 Tailwind 原子类
8. 禁用 `react-router-dom`，统一从 `react-router` 导入
9. 弹窗禁用 `destroyOnClose`，改用 `destroyOnHidden`
10. Zustand 只存全局状态，局部状态用 `useState`

## 输出清单

生成完成后，向用户汇报：
1. 新增/修改的文件列表
2. 各文件职责说明
3. 类型定义与 API 文档的对齐情况
4. TypeScript 编译结果
