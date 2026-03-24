const roleMiddleware = (allowedRoles) => {
  // Handle both string and array of roles
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Unauthorized' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        error: `Forbidden: Required role: ${roles.join(' or ')}` 
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
