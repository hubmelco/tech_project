function handleServiceError(error, res) {
    console.error(error);

    let statusCode = error.name;
    let message = error.message;
    if (typeof error.name != "number") {
        statusCode = 500;
        message = "Internal Server Error";
    }

    res.status(statusCode).json({
        message
    });
}

module.exports = {
    handleServiceError
};