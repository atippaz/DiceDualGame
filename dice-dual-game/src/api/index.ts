import room from '@/api/room/index'
import mqqt from '@/api/mqqt/index'
import xoGame from '@/api/xoGame/index'

const roomApi = room()
const mqqtApi = mqqt()
const xoGameApi = xoGame()
export { roomApi, mqqtApi, xoGameApi }
