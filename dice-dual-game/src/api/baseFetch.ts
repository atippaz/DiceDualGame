import { GetRequest, ApiResult } from './IApi'
const path = import.meta.env.VITE_API_PATH || ''

const Api = () => {
    return {
        get<T>(
            controller: string,
            param?:string,
            query?: GetRequest
        ): Promise<ApiResult<T>> | null {
            let queryString = ''
            if (path == null) return null
            return fetch(`${path}/${controller}${param!=null?'/'+param:''}?${queryString}`).then((e) =>
                e.json()
            )
        },
        post(){
            return  fetch("http://example.com/api/endpoint/", {
  method: "post",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },

  //make sure to serialize your JSON body
  body: JSON.stringify()
})
.then( (response) => { 
   //do something awesome that makes the world a better place
});
        }
    }
}
export default Api
