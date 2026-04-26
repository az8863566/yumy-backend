/* ========== 通用响应类型 ========== */

export interface ApiResponse<T> {
  code: number
  msg: string
  data: T
  ok: boolean
  fail: boolean
}

export interface PageResult<T> {
  records: T[]
  total: number
  current: number
  size: number
}

/* ========== 认证相关 ========== */

export interface AuthLoginDTO {
  username: string
  password: string
}

export interface AuthLoginVO {
  token: string
  username: string
  nickname: string
  permissions: string[]
}

/* ========== 系统角色 ========== */

export interface SysRoleVO {
  roleId: string
  roleName: string
  roleCode: string
  status: number
  createTime?: string
  remark?: string
}

export interface SysRoleQueryDTO {
  roleName?: string
  roleCode?: string
  status?: number
  pageNum: number
  pageSize: number
}

export interface SysRoleCreateDTO {
  roleName: string
  roleCode: string
  status?: number
  remark?: string
}

export interface SysRoleUpdateDTO {
  roleId: string
  roleName: string
  roleCode: string
  status?: number
  remark?: string
}

/* ========== 系统菜单 ========== */

export interface SysMenuVO {
  menuId: string
  parentId?: string
  menuName: string
  menuType: number
  path?: string
  component?: string
  perms?: string
  icon?: string
  sortOrder?: number
  visible?: number
  status?: number
  createTime?: string
  remark?: string
  children?: SysMenuVO[]
}

export interface SysMenuQueryDTO {
  menuName?: string
  status?: number
}

export interface SysMenuCreateDTO {
  parentId?: string
  menuName: string
  menuType: number
  path?: string
  component?: string
  perms?: string
  icon?: string
  sortOrder?: number
  visible?: number
  status?: number
  remark?: string
}

export interface SysMenuUpdateDTO {
  menuId: string
  parentId?: string
  menuName: string
  menuType: number
  path?: string
  component?: string
  perms?: string
  icon?: string
  sortOrder?: number
  visible?: number
  status?: number
  remark?: string
}

/* ========== 系统用户 ========== */

export interface SysUserVO {
  userId: string
  username: string
  nickname: string
  avatar?: string
  email?: string
  phone?: string
  status: number
  createTime?: string
  remark?: string
  roleNames?: string
  roleIds?: string[]
}

export interface SysUserQueryDTO {
  username?: string
  nickname?: string
  phone?: string
  status?: number
  roleId?: string
  keyword?: string
  pageNum: number
  pageSize: number
}

export interface SysUserCreateDTO {
  username: string
  password: string
  nickname: string
  avatar?: string
  email?: string
  phone?: string
  status?: number
  remark?: string
  roleIds?: string[]
}

export interface SysUserUpdateDTO {
  userId: string
  nickname?: string
  avatar?: string
  email?: string
  phone?: string
  status?: number
  remark?: string
  roleIds?: string[]
}

/* ========== 分类管理 ========== */

export interface TocCategoryTreeVO {
  categoryId: string
  name: string
  sortOrder: number
  createTime?: string
  subCategories: TocSubCategoryItemVO[]
}

export interface TocSubCategoryItemVO {
  categoryId: string
  parentId: string
  name: string
  image?: string
  sortOrder: number
  createTime?: string
}

export interface TocParentCategoryCreateDTO {
  name: string
  sortOrder?: number
}

export interface TocParentCategoryUpdateDTO {
  categoryId: string
  name: string
  sortOrder?: number
}

export interface TocSubCategoryCreateDTO {
  parentId: string
  name: string
  image: string
  sortOrder?: number
}

export interface TocSubCategoryUpdateDTO {
  categoryId: string
  parentId: string
  name: string
  image: string
  sortOrder?: number
}

/* ========== 菜谱管理 ========== */

export interface TocRecipeVO {
  recipeId: string
  title: string
  description?: string
  image?: string
  categoryId?: string
  likes?: number
  difficulty?: string
  time?: string
  servings?: number
  recommendSort?: number
}

export interface TocRecipeDetailVO extends TocRecipeVO {
  ingredients: IngredientVO[]
  steps: StepVO[]
}

export interface IngredientVO {
  name: string
  amount: string
}

export interface StepVO {
  id: string
  description: string
  image?: string
  ingredientsUsed?: string[]
}

export interface IngredientItem {
  name: string
  amount: string
  sortOrder?: number
}

export interface StepItem {
  stepNumber: number
  description: string
  image?: string
  ingredientsUsed?: string[]
}

export interface TocRecipeQueryDTO {
  categoryId?: string
  keyword?: string
  pageNum: number
  pageSize: number
}

export interface TocRecipeCreateDTO {
  title: string
  description: string
  image: string
  categoryId: string
  difficulty: string
  time: string
  servings?: number
  recommendSort?: number
  ingredients?: IngredientItem[]
  steps?: StepItem[]
}

export interface TocRecipeUpdateDTO extends TocRecipeCreateDTO {
  recipeId: string
}

export interface TocRecipeRecommendDTO {
  recommendSort: number
}

/* ========== C端用户管理 ========== */

export interface TocUserVO {
  userId: string
  username: string
  nickname?: string
  avatar?: string
  signature?: string
  status?: number
}

export interface TocUserQueryDTO {
  username?: string
  nickname?: string
  status?: number
  pageNum: number
  pageSize: number
}

export interface TocUserStatusDTO {
  status: number
}

/* ========== 评论管理 ========== */

export interface TocCommentVO {
  commentId: string
  recipeId: string
  userId: string
  username: string
  avatar?: string
  text: string
  images?: string[]
  createTime?: string
}

export interface TocCommentQueryDTO {
  recipeId?: string
  userId?: string
  text?: string
  pageNum: number
  pageSize: number
}

/* ========== 轮播图管理 ========== */

export interface TocBannerVO {
  bannerId: string
  title: string
  subtitle?: string
  image: string
  linkType: number
  linkValue?: string
  sortOrder?: number
  status?: number
}

export interface TocBannerQueryDTO {
  title?: string
  status?: number
  pageNum: number
  pageSize: number
}

export interface TocBannerCreateDTO {
  title: string
  image: string
  status: number
  subtitle?: string
  linkType?: number
  linkValue?: string
  sortOrder?: number
}

export interface TocBannerUpdateDTO extends TocBannerCreateDTO {
  bannerId: string
}

/* ========== 操作日志 ========== */

export interface SysOperLogVO {
  operId: number
  title: string
  businessType: number
  method: string
  requestMethod: string
  operName: string
  operUrl: string
  operIp: string
  status: number
  errorMsg?: string
  operTime: string
  costTime: number
}

export interface SysOperLogQueryDTO {
  title?: string
  businessType?: number
  operName?: string
  status?: number
  pageNum: number
  pageSize: number
}

/* ========== 文件上传 ========== */

export interface UploadVO {
  fileId: string
  url: string
  originalName: string
  storedName: string
  size: number
}

/* ========== 字典类型 ========== */

export interface SysDictTypeVO {
  dictId: string
  dictName: string
  dictType: string
  status: number
  createTime?: string
  remark?: string
}

export interface SysDictTypeQueryDTO {
  dictName?: string
  dictType?: string
  status?: number
  pageNum: number
  pageSize: number
}

export interface SysDictTypeCreateDTO {
  dictName: string
  dictType: string
  status?: number
  remark?: string
}

export interface SysDictTypeUpdateDTO {
  dictId: string
  dictName: string
  dictType: string
  status?: number
  remark?: string
}

/* ========== 字典数据 ========== */

export interface SysDictDataVO {
  dictCode: string
  dictSort?: number
  dictLabel: string
  dictValue: string
  dictType: string
  cssClass?: string
  listClass?: string
  isDefault?: number
  status: number
  createTime?: string
  remark?: string
}

export interface SysDictDataQueryDTO {
  dictType?: string
  dictLabel?: string
  status?: number
  pageNum: number
  pageSize: number
}

export interface SysDictDataCreateDTO {
  dictSort?: number
  dictLabel: string
  dictValue: string
  dictType: string
  cssClass?: string
  listClass?: string
  isDefault?: number
  status?: number
  remark?: string
}

export interface SysDictDataUpdateDTO {
  dictCode: string
  dictSort?: number
  dictLabel: string
  dictValue: string
  dictType: string
  cssClass?: string
  listClass?: string
  isDefault?: number
  status?: number
  remark?: string
}

/* ========== 参数配置 ========== */

export interface SysConfigVO {
  configId: number
  configName: string
  configKey: string
  configValue?: string
  configType: number
  createTime?: string
  remark?: string
}

export interface SysConfigQueryDTO {
  configName?: string
  configKey?: string
  configType?: number
  pageNum: number
  pageSize: number
}

export interface SysConfigCreateDTO {
  configName: string
  configKey: string
  configValue?: string
  configType?: number
  remark?: string
}

export interface SysConfigUpdateDTO {
  configId: number
  configName: string
  configKey: string
  configValue?: string
  configType?: number
  remark?: string
}
