import jwt from "jsonwebtoken";

const adminAuth = async (req, res, next) => {
    try {
        const {token} = req.headers;
        if (!token) {
            return res.status(404).json({
                success: false,
                message: "Token not found"
            })
        }

        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET);
        console.log(tokenDecode);
        if (tokenDecode.role !== "admin") {
            return res.json({
                success:false,
                message: "Not authorized login"
            });
        }
     console.log("Success");
        next();
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
}

export default adminAuth;