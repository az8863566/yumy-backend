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
  username: string
  nickname: string
  permissions: string[]
}

/* ========== 系统用户 ========== */

export interface SysUserVO {
  userId: number
  username: string
  nickname: string
  avatar?: string
  email?: string
  phone?: string
  status: number
  createTime?: string
  remark?: string
}

export interface SysUserQueryDTO {
  username?: string
  nickname?: string
  phone?: string
  status?: number
  pageNum: number
  pageSize: number
}

/* ========== 分类管理 ========== */

export interface TocCategoryTreeVO {
  categoryId: number
  name: string
  sortOrder: number
  createTime?: string
  subCategories: TocSubCategoryItemVO[]
}

export interface TocSubCategoryItemVO {
  categoryId: number
  parentId: number
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
  categoryId: number
  name: string
  sortOrder?: number
}

export interface TocSubCategoryCreateDTO {
  parentId: number
  name: string
  image: string
  sortOrder?: number
}

export interface TocSubCategoryUpdateDTO {
  categoryId: number
  parentId: number
  name: string
  image: string
  sortOrder?: number
}

/* ========== 菜谱管理 ========== */

export interface TocRecipeVO {
  recipeId: number
  title: string
  description?: string
  image?: string
  categoryId?: number
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
  id: number
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
  categoryId?: number
  keyword?: string
  pageNum: number
  pageSize: number
}

export interface TocRecipeCreateDTO {
  title: string
  description: string
  image: string
  categoryId: number
  difficulty: string
  time: string
  servings?: number
  recommendSort?: number
  ingredients?: IngredientItem[]
  steps?: StepItem[]
}

export interface TocRecipeUpdateDTO extends TocRecipeCreateDTO {
  recipeId: number
}

export interface TocRecipeRecommendDTO {
  recommendSort: number
}

/* ========== C端用户管理 ========== */

export interface TocUserVO {
  userId: number
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
  commentId: number
  recipeId: number
  userId: number
  username: string
  avatar?: string
  text: string
  images?: string[]
  createTime?: string
}

export interface TocCommentQueryDTO {
  recipeId?: number
  userId?: number
  text?: string
  pageNum: number
  pageSize: number
}

/* ========== 轮播图管理 ========== */

export interface TocBannerVO {
  bannerId: number
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
  bannerId: number
}

/* ========== 文件上传 ========== */

export interface UploadVO {
  fileId: number
  url: string
  originalName: string
  storedName: string
  size: number
}
