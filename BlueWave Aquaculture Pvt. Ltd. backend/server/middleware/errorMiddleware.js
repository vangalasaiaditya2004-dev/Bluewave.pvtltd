// Central error middleware:
// Keeps error responses consistent across the backend.

function errorMiddleware(error, req, res, next) {
  console.error(error.message);

  // SQLite duplicate or foreign key errors usually use SQLITE_CONSTRAINT.
  if (error.code === "SQLITE_CONSTRAINT") {
    if (error.message.includes("UNIQUE")) {
      return res.status(409).json({
        success: false,
        message: "Duplicate value found. Please use a different value.",
      });
    }

    if (error.message.includes("FOREIGN KEY")) {
      return res.status(400).json({
        success: false,
        message: "Related record not found. Please check the provided id.",
      });
    }

    return res.status(400).json({
      success: false,
      message: "A database rule was violated. Please check your input.",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
  });
}

module.exports = errorMiddleware;
