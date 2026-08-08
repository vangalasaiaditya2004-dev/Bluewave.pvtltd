// Role middleware:
// Use this later when a route should only be available to specific roles.

function roleMiddleware(allowedRoles) {
  return function (req, res, next) {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this route",
      });
    }

    next();
  };
}

module.exports = roleMiddleware;
