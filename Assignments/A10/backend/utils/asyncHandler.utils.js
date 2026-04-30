// Express 5 natively catches async errors — this wrapper is kept for
// compatibility but simply passes through the function unchanged.
const asyncHandler = (fn) => fn;

export default asyncHandler;
