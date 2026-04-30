// Wraps async route handlers so we don't need try/catch in every controller.
// Any thrown error is forwarded to the global error middleware via next().
const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
