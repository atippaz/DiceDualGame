import { GetRequest, ApiResult } from './IApi'
const path = import.meta.env.VITE_API_PATH || ''

const Api = () => {
    return {
        get<T>(
            controller: string,
            query?: GetRequest
        ): Promise<ApiResult<T>> | null {
            let queryString = ''
            if (path == null) return null
            return fetch(`${path}/${controller}?${queryString}`).then((e) =>
                e.json()
            )
        },
    }
}
export default Api
