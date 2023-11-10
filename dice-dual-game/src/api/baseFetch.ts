import { GetRequest, ApiResult } from './IApi'
const path = import.meta.env.VITE_API_PATH || ''
import { getContext } from '@/context'
import { contextPluginSymbol } from '@/plugins/context'

const Api = () => {
    const context = getContext().inject(contextPluginSymbol)

    return {
        get<T>(
            controller: string,
            param?: string,
            query?: GetRequest
        ): Promise<ApiResult<T>> | null {
            context.syncToken()
            const token = context.token.value
            let queryString = ''
            if (path == null) return null
            return fetch(
                `${path}/${controller}${
                    param != null ? '/' + param : ''
                }?${queryString}`,
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            )
                .then(async (response) => {
                    const res: any = await response.json()

                    if (res.status === 401) {
                        localStorage.removeItem('userToken')
                        getContext().router.push({ name: 'Login' })
                        return { data: null, statusCode: null }
                    } else {
                        return res
                    }
                })
                .catch((er) => {
                    console.log(er)
                    return { data: null, statusCode: null }
                })
        },
        post(controller: string, payload: any) {
            context.syncToken()
            const token = context.token.value
            return fetch(`${path}/${controller}`, {
                method: 'post',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },

                //make sure to serialize your JSON body
                body: JSON.stringify(payload),
            })
                .then(async (response) => {
                    const res: any = await response.json()
                    // alert(res)

                    if (res.status === 401) {
                        localStorage.removeItem('userToken')
                        getContext().router.push({ name: 'Login' })
                        return { data: null, statusCode: null }
                    } else {
                        return res
                    }
                })
                .catch((er) => {
                    console.log(er)
                    return { data: null, statusCode: null }
                })
        },
    }
}
export default Api
