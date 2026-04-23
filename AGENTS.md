## 一、技术架构

本项目采用 React 现代化前端技术栈，严格基于以下版本生成代码：

| 领域 | 技术 | 关键约束 |
|------|------|----------|
| 框架 | React 19.2+ | 函数式组件 + Hooks；可用 `use` Hook、`<Activity>` 等新特性 |
| 语言 | TypeScript 5.5+ | 严格类型检查，禁止隐式 `any` |
| 构建 | Vite 8.0+ | Node >= 20.19 |
| UI 库 | Ant Design 6.3+ | CSS-in-JS + CSS Variables 混合架构，弃用 v5 遗留写法 |
| 路由 | React Router 7.x | 仅从 `react-router` 导入，**禁止** `react-router-dom` |
| 状态 | Zustand 5.0+ | 仅存全局用户信息、权限、字典；局部状态用 `useState` |
| 数据 | TanStack Query v5 + Axios | `useQuery` 查询 / `useMutation` 增删改 + `invalidateQueries` 刷新 |
| 样式 | Tailwind CSS + Design Token | 原子类布局 + Token 主题定制 |

## 二、目录结构

按功能特性（Feature-based）划分：

```text
src/
├── api/                  # Axios 实例、拦截器、各模块 API 函数
├── assets/               # 静态资源
├── components/           # 全局公共组件 (PageContainer, Access 等)
├── config/               # 全局配置 (常量、环境变量、菜单)
├── hooks/                # 全局 Hooks (useAuth, useAccess)
├── layouts/              # 布局组件 (Sidebar, Header)
├── router/               # 路由配置 (createBrowserRouter)
├── store/                # Zustand Store (useUserStore)
├── types/                # 全局 TypeScript 接口 (.d.ts)
├── utils/                # 纯函数工具
└── views/                # 页面视图
    ├── login/            # 登录
    ├── system/           # 系统管理 (user/ role/ menu/ dict/ log/ config)
    └── toc/              # TOC 业务 (recipe/ category/ carousel/ review/ user)
```

## 三、编码规范

### 3.1 命名

| 场景 | 规范 | 示例 |
|------|------|------|
| 组件文件 | `.tsx`，PascalCase | `UserManagement.tsx` |
| 逻辑文件 | `.ts`，camelCase | `useAuth.ts` |
| 变量/函数 | camelCase | `fetchUserList` |
| 常量 | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |

### 3.2 类型安全

- 前后端交互必须定义 `Request` / `Response` Interface。
- 禁用 `any`；无法推导时用 `unknown` + 类型断言。
- `request.ts` 的 `get` 函数参数类型用 `object`，**禁用** `Record<string, unknown>`（否则所有调用方被迫写 `as unknown`）。
- 组件状态**禁用** `Record<string, unknown>` 做万能类型，必须用明确 Interface 或联合类型。

### 3.3 组件与 UI

- 复杂页面必须将数据逻辑抽离到 `hooks.ts`（TanStack Query + Zustand/useState）。
- Props 必须定义 Interface。
- `Table.columns` 必须用 `useMemo` 包裹；columns 内引用的函数必须用 `useCallback` 稳定引用。
- 所有按钮必须绑定 `onClick`，禁止占位按钮。
- 表单与表格复用 Ant Design `<Form>` / `<Table>`，列表页用服务端分页。
- 图标优先 `lucide-react` 或 Ant Design 图标库。
- 单文件不超过 **300 行**，超标必须拆分子组件。
- 交互状态（`collapsed` / `open` / `loading`）必须用 `useState` 管理并提供切换机制，禁止写死为常量。
- `Table` 的 `showTotal` 禁止写死显示范围，用动态 `total`：`showTotal: (total) => \`共 ${total} 条记录\``。

### 3.4 API 与数据层

- 所有 API 调用**必须**通过 `api/request.ts` 封装层或 `api/**/*.ts` 中定义的函数，**禁止**页面内直接 `import axios`（否则 401 跳转、错误提示、Cookie 携带全部失效）。
- 查询用 `useQuery`；增删改用 `useMutation`，成功后 `invalidateQueries` 刷新列表。
- **禁止** `MOCK_XXX` 硬编码数据，必须对接真实 API。

### 3.5 样式

- 禁止大量内联 `style={{ marginTop: '20px' }}`，统一用 Tailwind 原子类（`className="mt-5"`）。

### 3.6 权限与错误处理

- 认证模式：**Session + Cookie**（非 JWT Token）。
- 路由级：后端权限列表动态过滤路由渲染树。
- 按钮级：`<Access permission="system:user:add">` 或 `useAccess()` 控制显隐。
- 全局拦截：401（Session 过期→跳登录页）、403（无权限）、500（Message 报错）。
- 页面包裹 ErrorBoundary。

## 四、禁止事项

以下为硬性红线，违反即视为 Bug：

1. **类组件 / 生命周期** — 全部使用函数式组件 + Hooks，禁止 `Class Component`、`componentWillMount` 等。
2. **`react-router-dom`** — 统一从 `react-router` 导入，优先 `createBrowserRouter`。
3. **Zustand 存局部状态** — 表单输入值、弹窗开关等随组件销毁即清除的状态用 `useState`。
4. **`Record<string, unknown>` 偷懒** — 无论是 `request.ts` 参数还是组件状态，都必须用明确类型。
5. **页面直接 `import axios`** — 必须走封装层。
6. **`Table.columns` 不包 `useMemo`** — 必须包裹，内部函数用 `useCallback`。
7. **`MOCK_XXX` 硬编码数据** — 必须对接真实 API。
8. **占位按钮无 `onClick`** — 所有按钮必须绑定事件。
9. **`showTotal` 写死范围** — 如 `显示 1 至 ${data.length} 条`，必须用动态 `total`。
10. **交互状态写死常量** — `collapsed` / `open` / `loading` 必须用 `useState` + 切换。
11. **巨石组件** — 单文件 > 300 行必须拆分。
12. **长篇内联样式** — 用 Tailwind 原子类替代。