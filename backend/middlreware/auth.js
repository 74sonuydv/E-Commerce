import jwt from 'jsonwebtoken';
import 'dotenv/config';

const authUser = async (req, res, next) => {
    try {
        const {token} = req.headers;

        if (!token) {
            return res.status(404).json({
                success: false,
                message: "Token not found"
            });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
}

export default authUser;