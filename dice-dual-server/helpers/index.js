const responseData = (res, statusCode, data, customResCode = 200) => {
    return res
        .status(customResCode)
        .json({ statusCode: statusCode, data: data })
}
export { responseData }
