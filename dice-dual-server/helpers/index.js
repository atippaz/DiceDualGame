const responseData = (res, statusCode, data, customResCode = 200) => {
    return res.status(customResCode).json(createResponseObj(statusCode, data))
}
const createResponseObj = (statusCode, data) => {
    return { statusCode: statusCode, data: data }
}
export { responseData, createResponseObj }
