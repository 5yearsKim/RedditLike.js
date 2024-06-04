
type idT = number

type ListData<T> = {
  data: T[],
  nextCursor: string | null,
}

type GetData<T> = {
  data: T
}