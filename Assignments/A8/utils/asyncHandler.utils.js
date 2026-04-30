// Wraps async route handlers so we don't need try/catch in every controller.
// Any thrown error is forwarded to the global error middleware via next().
// Same pattern as project/backend/utils/asyncHandler.utils.js
const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
