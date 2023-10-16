const responseData = (res, statusCode, data) => {
    return res.status(200).json({ statusCode: statusCode, data: data })
}
export { responseData }
