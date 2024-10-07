function handleServiceError(error, res) {
    console.error(error);

    const statusCode = error.status;
    if (!statusCode) {
        return res.status(500).json({message: "Internal Server error"})
    }
    const message = error.message;
    return res.status(statusCode).json({message});
}

module.exports = {
    handleServiceError
};