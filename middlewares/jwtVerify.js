import jwt from "jsonwebtoken"
import asyncHandler from "../utils/asyncHandler.js"
import ErrorResponse from "../utils/ErrResp.js"

const jwtVerify = asyncHandler(async (req, res, next) => {
    const token = req.cookies.authtoken

    if(!token){
        return
    }

    const jwtDecoded = jwt.verify(token, process.env.JWT_SECRET)
    req.uid = jwtDecoded.uid
    next()
})

export default jwtVerify