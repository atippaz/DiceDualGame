import Api from "../baseFetch"
const api = Api()
const controller = 'gameRoom'
const roomApi = () =>{
    return{
    getAll:()=>{
        return api.get(controller)!
    },
    createRoom:()=>{
        return api.get(controller)!
    }
}
}
export default roomApi