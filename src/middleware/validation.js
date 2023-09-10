const userModel = require("../model/userModel");

const isValid = function(value) {
    if (typeof value === 'undefined' || value === null) return false;
    if (typeof value === 'string' && value.trim().length === 0) return false;
    return true;
}


const regValid = async(req,res,next)=>{
try{
    const {name, email, phone, password} = req.body;
//name
    if (!isValid(name))
            return res.status(400).send({ status: false, message: "Please enter user name" });

        const userName = await userModel.findOne({ name: name });
        if (userName)
            return res.status(400).send({ status: false, message: "User Name already exists" });
//email
    if (!isValid(email)) {
                return res.status(400).send({ status: false, message: "Please enter Email" });
            }
    
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
                return res.status(400).send({ status: false, message: "Email should be a valid email" });
            }
     const isemailAlreadyUsed = await userModel.findOne({ email: email });
    
    if (isemailAlreadyUsed)
     return res.status(400).send({ status: false, message: `${email} email address is already registered` });
//phone
     if (!isValid(phone))
     return res.status(400).send({ status: false, message: "Please enter phoneNo" });

    if (!(/^[1-9][0-9]{9}$/.test(phone)))
     return res.status(400).send({ status: false, message: "Please enter valid phoneNo ( 10 digits )" });

    const regphone = await userModel.findOne({ phone: phone });
    if (regphone)
     return res.status(400).send({ status: false, message: `${phone} phone number is already registered` });

//password
    if (!isValid(password))
    return res.status(400).send({ status: false, message: "Please enter password" });

    if(password.length < 8)
    return res.status(400).send({ status: false, message: "password must be of atleast 8 characters" });

    if(password.length > 15)
    return res.status(400).send({ status: false, message: "password must be of atmax 15 characters" });

    if(!(/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password)))
    return res.status(400).send({ status: false, message: "Please enter characters between a-z and A-Z" });

    next();
}
catch(error) {
    return res.status(500).send({ status: false, message: error.message });
}
}

const logInValid = async(req,res,next)=>{
    try{
   const {name, password} = req.body;
   if (!isValid(name))
   return res.status(400).send({ status: false, message: "Please enter user name" });

   //password
   if (!isValid(password))
   return res.status(400).send({ status: false, message: "Please enter password" });

   if(password.length < 8)
   return res.status(400).send({ status: false, message: "password must be of atleast 8 characters" });

   if(password.length > 15)
   return res.status(400).send({ status: false, message: "password must be of atmax 15 characters" });

   if(!(/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password)))
   return res.status(400).send({ status: false, message: "Please enter characters between a-z and A-Z" });

   const existsUser = await userModel.findOne({name : name, password : password});
   if(!existsUser)
   return res.status(400).send({status: false, message: "user name or password is invalid "});

   const userId = existsUser._id
    req.userId = userId;

    next();

    }
    catch(error){
        return res.status(500).send({ status: false, message: error.message });
    }
}


//blog validation

const blogValid = async (req, res, next) => {
    try{
            const {title, body, userId} = req.body;
            if(!isValid(title))
            return res.status(400).send({status: false, message: "title is missing"}); 
            if(!isValid(body))
            return res.status(400).send({status: false, message: "body is missing"}); 
            if (!isValid(userId))
            return res.status(400).send({ status: false, message: "Please enter user Id" });
            if (!(/^[0-9a-f]{24}$/.test(userId)))
            return res.status(400).send({ status: false, message: "Please enter valid user Id" });
            const existsUser = await userModel.findOne({_id : userId});
            if(!existsUser)
            return res.status(400).send({ status: false, message: "user not exists" });
        next();

    }
    catch(error){
        return res.status(500).send({ status: false, message: error.message }); 
    }
}

//verify userId

const verifyId = async (req, res,next) => {
   try{
    const userId = req.params.userId;
    if (!isValid(userId))
    return res.status(400).send({ status: false, message: "Please enter user Id" });
    if (!(/^[0-9a-f]{24}$/.test(userId)))
    return res.status(400).send({ status: false, message: "Please enter valid user Id" });
    const existsUser = await userModel.findOne({_id : userId});
    if(!existsUser)
    return res.status(400).send({ status: false, message: "user not exists" });
next();
   }
   catch(error){
    return res.status(500).send({ status: false, message: error.message }); 
}
}

const updateBlogData = async (req, res, next) => {
    const {title, body} = req.body;

    if(!isValid(title))
    return res.status(400).send({status: false, message: "title is missing"}); 
    if(!isValid(body))
    return res.status(400).send({status: false, message: "body is missing"}); 

    next();

}

module.exports.regValid = regValid;
module.exports.logInValid = logInValid;
module.exports.blogValid = blogValid;
module.exports.verifyId = verifyId;
module.exports.updateBlogData = updateBlogData;