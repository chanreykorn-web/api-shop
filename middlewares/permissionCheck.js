export const checkPermission = (requiredPerm) => {
    return (req, res, next) => {
      if (!req.user?.permissions?.includes(requiredPerm)) {
        return res.status(403).json({ message: 'Access denied: insufficient permission' });
      }
      next();
    };
};
  