

module.exports = (req, res, next) => {
  const err = new Error('not found');
  
  res.status(err.status);
  
  
  err.status = 404;
  next(err);
};
