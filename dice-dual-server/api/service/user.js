import User from '../model/users.js'
const getUserAll = async () => {
    return await User.find().select('-password')
}
const getUserOne = async (param) => {
    const user = await User.findOne(param).select('-password')
    return user
}
const createUser = async (data) => {
    try {
        const doc = await User.create({ ...data })
        return doc
    } catch (er) {
        console.error(er)
    }
}

export { getUserAll, getUserOne, createUser }
