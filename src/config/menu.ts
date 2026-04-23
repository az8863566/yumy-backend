export interface MenuConfig {
  key: string
  label: string
  icon?: string
  path?: string
  children?: MenuConfig[]
  permission?: string
}

export const menuConfig: MenuConfig[] = [
  {
    key: 'system',
    label: '系统管理',
    icon: 'Settings',
    children: [
      { key: 'system-user', label: '用户管理', path: '/system/user', icon: 'Users', permission: 'system:user:view' },
      { key: 'system-role', label: '角色管理', path: '/system/role', icon: 'ShieldCheck', permission: 'system:role:view' },
      { key: 'system-menu', label: '菜单管理', path: '/system/menu', icon: 'Menu', permission: 'system:menu:view' },
      { key: 'system-log', label: '操作日志', path: '/system/log', icon: 'FileText', permission: 'system:log:view' },
      { key: 'system-dict', label: '数据字典', path: '/system/dict', icon: 'BookOpen', permission: 'system:dict:view' },
      { key: 'system-config', label: '系统配置', path: '/system/config', icon: 'SlidersHorizontal', permission: 'system:config:view' },
    ],
  },
  {
    key: 'toc',
    label: 'TOC管理',
    icon: 'LayoutDashboard',
    children: [
      { key: 'toc-category', label: '分类管理', path: '/toc/category', icon: 'FolderTree', permission: 'toc:category:view' },
      { key: 'toc-recipe', label: '菜谱管理', path: '/toc/recipe', icon: 'FileText', permission: 'toc:recipe:view' },
      { key: 'toc-user', label: '用户管理', path: '/toc/user', icon: 'Users', permission: 'toc:user:view' },
      { key: 'toc-review', label: '评论管理', path: '/toc/review', icon: 'MessageSquare', permission: 'toc:review:view' },
      { key: 'toc-carousel', label: '轮播图管理', path: '/toc/carousel', icon: 'Image', permission: 'toc:carousel:view' },
    ],
  },
]
