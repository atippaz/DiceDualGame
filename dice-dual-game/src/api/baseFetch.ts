import { GetRequest, ApiResult } from './IApi'
const path = import.meta.env.VITE_API_PATH || ''
const token = localStorage.getItem('userToken') || ''
const Api = () => {
    return {
        get<T>(
            controller: string,
            param?: string,
            query?: GetRequest
        ): Promise<ApiResult<T>> | null {
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
                .then((e) => e.json())
                .catch((er) => console.log(er))
        },
        post(controller: string, payload: any) {
            return fetch(`${path}/${controller}`, {
                method: 'post',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },

                //make sure to serialize your JSON body
                body: JSON.stringify(payload),
            }).then(
                (response) => response.json()
                //do something awesome that makes the world a better place
            )
        },
    }
}
export default Api
