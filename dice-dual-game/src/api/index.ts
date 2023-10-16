import room from '@/api/room/index'
import mqqt from '@/api/mqqt/index'
import xoGame from '@/api/xoGame/index'
import account from '@/api/account/index'

const roomApi = room()
const mqqtApi = mqqt()
const xoGameApi = xoGame()
const accountApi = account()
export { roomApi, mqqtApi, xoGameApi, accountApi }
