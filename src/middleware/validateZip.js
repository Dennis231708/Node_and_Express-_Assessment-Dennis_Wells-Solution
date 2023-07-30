// Updated validateZip middleware
function validateZip(req, res, next) {
  const zip = req.params.zip;
  const isAdmin = req.query.admin === "true"; // Check if admin parameter is "true"

  if (zip === "all") {
    if (!isAdmin) {
      const errorMessage = "You do not have access to that route.";
      const error = new Error(errorMessage);
      error.status = 403;
      return next(error);
    }
    // If zip is "all" and admin is "true", proceed to the next middleware
    return next();
  }

  if (zip.length !== 5 || isNaN(zip)) {
    const errorMessage = `Zip (${zip}) is invalid!`;
    const error = new Error(errorMessage);
    error.status = 400;
    return next(error);
  }

  next();
}

module.exports = validateZip;