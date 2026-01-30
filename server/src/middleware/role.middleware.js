export const mentorOnly = (req, res, next) => {
  if (req.user.role !== "mentor")
    return res.status(403).json({ message: "Mentor only" });
  next();
};

export const studentOnly = (req, res, next) => {
  if (req.user.role !== "student")
    return res.status(403).json({ message: "Student only" });
  next();
};
