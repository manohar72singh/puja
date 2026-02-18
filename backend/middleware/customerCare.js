export const customerCareOnly = (req, res, next) => {
    if (req.user && req.user.role === "customerCare") {
        next();
    }
    else{
        res.status(403).json({
      success: false,
      message: "customer care access required"
    });
    }
}