export interface GetRequest<T = null> {
    payload: T
}
export interface ApiResult<T = null> {
    data: T
    statusCode: number
}
