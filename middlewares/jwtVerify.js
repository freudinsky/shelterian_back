import jwt from "jsonwebtoken"
import asyncHandler from "../utils/asyncHandler.js"
import ErrorResponse from "../utils/ErrResp.js"

const jwtVerify = asyncHandler(async (req, res, next) => {
    const token = req.cookie.authtoken

    if(!token){
        throw new ErrorResponse("Not logged in", 204)
    }

    const jwtDecoded = jwt.verify(token, process.env.JWT_SECRET)
    req.uid = jwtDecoded.uid
    next()
})

export default jwtVerify