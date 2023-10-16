import mongoose from 'mongoose'
const Schema = mongoose.Schema
const userSchema = new Schema(
    {
        name: {
            type: String,
        },
        password: {
            type: String,
        },
        username: {
            type: String,
            unique: true,
        },
        userId: {
            type: String,
            unique: true,
        },
    },
    { versionKey: false }
)

const User = mongoose.model('user', userSchema)
export default User
