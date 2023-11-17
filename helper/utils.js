module.exports = {
    templateResponse : (rc, success, message, result, error) => {
        return {
            rc,
            success,
            message,
            error,
            result
        };
    },
};