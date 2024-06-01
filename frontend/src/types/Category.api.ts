import { CategoryT, CategoryFormT, ListCategoryOptionT, GetCategoryOptionT } from "./Category";


// (GET) /
export type ListRqs = ListCategoryOptionT
export type ListRsp = ListData<CategoryT>


// (POST) /
export type CreateRqs = {form: CategoryFormT}
export type CreateRsp = CategoryT

// (GET) /:id
export type GetRqs = GetCategoryOptionT
export type GetRsp = GetData<CategoryT>

// (PATCH) /:id
export type UpdateRqs = {form: Partial<CategoryFormT>}
export type UpdateRsp = CategoryT

// (DELETE) /:id
export type DeleteRqs = null
export type DeleteRsp = CategoryT

// (PUT) /rerank
export type RerankRqs = {groupId: idT, categoryIds: idT[]}
export type RerankRsp = CategoryT[]
