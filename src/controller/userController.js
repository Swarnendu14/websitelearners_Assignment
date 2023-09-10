const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

const sendResetPasswordMail = async(name, email, token)=>{
    try{
        
        let testAccount = await nodemailer.createTestAccount();

        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'milo.mcclure67@ethereal.email',
                pass: 'V6sV7dZSEdQjStsJj1'
            }
        });

        let message = {
            from: '"John" <john@gmail.com>',
            to:email,
            subject: "For reset password",
            html:'<p>Hi '+name+',please copy the link and <a href= "http://127.0.0.1:5000/resetPassword?token='+token+'">reset your password</a>'
        }

        transporter.sendMail(message).then((info)=>{
           const message = { 
            msg: "you should receive an email",
            info : info.messageId,
            preview: nodemailer.getTestMessageUrl(info)
        }
            console.log(message);
            
        })
        .catch(error => {
            console.log( error.message)
        })
    }

    catch(error){
        return res.status(500).send({status: false, message: error.message});
       }

}



const register = async (req,res)=> {
   try{
    const userData = req.body;
    const data = await userModel.create(userData);
    return res.status(201).send({status: true, message: data});
   }
   catch(error){
    return res.status(500).send({status: false, message: error.message});
   }

}


const logIn = async(req,res) => {
    try {
        let id = req.userId;
        let token = jwt.sign(
            {
                userId: id,
            },
            "create-token-for-logIn"
        )
        res.setHeader("x-api-key", token)

        return res.status(200).send({
            "status": true,
            "message":"login successfully",
            "data": { "token": token }
        })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const update = async(req, res)=> {
    try{
        const {name, email, phone, password} = req.body;
        const userId = req.params.userId;
        if(name){
            const nameExists = await userModel.findOne({name : name});
            if(nameExists)
                return res.status(400).send({status: false, message:"user name already exists"})
        }
        if(email){
            if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
                return res.status(400).send({ status: false, message: "Email is not valid" });
            }
        const isemailAlreadyUsed = await userModel.findOne({ email: email });
    
        if (isemailAlreadyUsed)
        return res.status(400).send({ status: false, message: `${email} email address is already registered` });

        }
        if(phone){
       
            if (!(/^[1-9][0-9]{9}$/.test(phone)))
            return res.status(400).send({ status: false, message: "Please enter valid phoneNo ( 10 digits )" });

            const regphone = await userModel.findOne({ phone: phone });
            if (regphone)
            return res.status(400).send({ status: false, message: `${phone} phone number is already registered` });
        }
        if(password){
            if(password.length < 8)
            return res.status(400).send({ status: false, message: "password must be of atleast 8 characters" });
        
            if(password.length > 15)
            return res.status(400).send({ status: false, message: "password must be of atmax 15 characters" });
        
            if(!(/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password)))
            return res.status(400).send({ status: false, message: "Please enter characters between a-z and A-Z" });
        }

        const update = await userModel.findByIdAndUpdate(userId, {
            $set: {
                name : name,
                email : email,
                phone : phone,
                password : password
            }
        },
        
        {new : true}
        )
        return res.status(200).send({status: true, message: "updated successfully", data: update});

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const deleteUser = async (req,res)=> {
    try{
     const userId = req.params.userId;
     
     const existsUser = await userModel.findById(userId);
     
     if(!existsUser)
     return res.status(400).send({status: false, message: "no such user exists"})
     const data = await userModel.deleteOne(existsUser)
        if(data.deletedCount == 1)
            return res.status(200).send({status: true, message: "deleted successfully"});
     
    }
    catch(error){
     return res.status(500).send({status: false, message: error.message});
    }
 
 }


 const forgetPassword = async (req,res) =>{
    try{
            const email = req.body.email;
            const userData = await userModel.findOne({email : email});
            if(!userData)
            {
                return res.status(400).send({status : false, message: "user does not exists"})
            }
            const randomString = randomstring.generate();
            const data = await userModel.findByIdAndUpdate({_id : userData._id},{$set:{token : randomString}},{new:true}); 
          
            console.log(data);
            const sendEmail = sendResetPasswordMail(userData.name, userData.email, randomString);
            
            return res.status(200).send({satus: true, msg: "An email has been sent"});


    }
    catch(error){
        return res.status(500).send({status: false, message: error.message});
       }
 }


 const resetPassword = async (req, res)=>{
    try{
        const token = req.query.token;
        if(!token)
        return res.status(400).send({status:false, msg: "please enter token"})
        const existsToken = await userModel.findOne({token : token});
        if(existsToken){
                const newPassWord = req.body.password;
                if(newPassWord.length < 8)
                return res.status(400).send({ status: false, message: "password must be of atleast 8 characters" });

                if(newPassWord.length > 15)
                return res.status(400).send({ status: false, message: "password must be of atmax 15 characters" });

                if(!(/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(newPassWord)))
                return res.status(400).send({ status: false, message: "Please enter characters between a-z and A-Z" });

                const updatePassWord = await userModel.findByIdAndUpdate({_id : existsToken._id},{$set:{password : newPassWord}},{new: true});

                return res.status(200).send({status: true, message: "password reset successfully", data: updatePassWord});

            }
        else{
            return res.status(200).send({status: false, message: "the link has been expired"});
        }

    }
    catch(error){
        return res.status(500).send({status: false, message: error.message});
       }
 }


module.exports.register = register;
module.exports.logIn = logIn;
module.exports.update = update;
module.exports.deleteUser = deleteUser;
module.exports.forgetPassword = forgetPassword;
module.exports.resetPassword = resetPassword;