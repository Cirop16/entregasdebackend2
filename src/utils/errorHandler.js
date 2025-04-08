const errorHandler = (res, error, status = 500) => {
    console.error(error);
    res.status(status).json({ message: error.message || 'Error interno del servidor' });
};

export default errorHandler;