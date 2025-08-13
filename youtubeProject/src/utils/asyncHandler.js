export const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res ,next)).catch((err) => next(err))
    }
}

// here we are accepting a parameter as a function and return a function.
// so instead of try-catch block we are using Promise