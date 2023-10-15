const responseData = (res, statusCode, data) => {
    return res.statusCode(200).json({ statusCode: statusCode, data: data })
}
export { responseData }
