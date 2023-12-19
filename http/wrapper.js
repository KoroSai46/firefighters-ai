class Wrapper {
    success(data, message = 'Operation successful', code = 200) {
        return {
            code,
            success: true,
            message,
            data,
        }
    }

    error(message = 'Operation failed', code = 400) {
        return {
            code,
            success: false,
            message,
        }
    }
}

module.exports = new Wrapper();