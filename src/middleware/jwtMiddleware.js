const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");

const verifyToken = async function (req, res, next) {
    try {
        let token = req.header("x-api-key");
        if (!token) {
            return res.status(401).send({ status: false, message: "required token is missing (first login)" });
        }
        let decoded = jwt.verify(token, "create-token-for-logIn");
        if (!decoded) {
            return res.status(403).send({ status: false, message: "invalid token" });
        }
        req.userId = decoded.userId;
        next()
    }
    catch (err) {
       
        return res.status(500).send({ status: false, message: err.message })
    }
}


const authorizedUser = async function (req, res, next) {
    try {
        let id = req.userId
        let userId = req.params.userId;
        if (userId) {
            let userExixts = await userModel.findById(userId);
            if (!userExixts) {
                return res.status(400).send({ status: false, message: "user not exists" });
            }
            
            if (id != userId) {
                return res.status(403).send({ status: false, message: "You are not authorized" });
            }
        }
        else{
            return res.status(400).send({ status: false, message: "userId is missing" });
        }
        
        next()
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}

module.exports.verifyToken = verifyToken;
module.exports.authorizedUser = authorizedUser;