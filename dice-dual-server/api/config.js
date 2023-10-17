import mongoose from 'mongoose'

const initial = async () => {
    console.log('Connecting to the database...')
    try {
        return await mongoose.connect(
            'mongodb+srv://nasakun13201:pan28060@badminton.bkjs5n4.mongodb.net/',
            {
                useNewUrlParser: true,
            }
        )
    } catch (error) {
        console.error('Connection error:', error)
        throw error // สามารถโยนข้อผิดพลาดออกไปเพื่อให้โค้ดที่เรียกใช้ initial จัดการกับมัน
    }
}

export default initial
