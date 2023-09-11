const express = require("express")
const router = express.Router();

const userController = require("../controller/userController");
const blogController = require("../controller/blogController");
const commentController = require("../controller/commentController");
const validation = require("../middleware/validation");
const jwtMiddleware = require("../middleware/jwtMiddleware");

//user
router.post("/register",validation.regValid, userController.register);
router.post("/logIn",validation.logInValid, userController.logIn);
router.put("/update/:userId", jwtMiddleware.verifyToken, jwtMiddleware.authorizedUser, userController.update);
router.delete("/delete/:userId",jwtMiddleware.verifyToken, jwtMiddleware.authorizedUser, userController.deleteUser);
router.put("/forgetPassword", userController.forgetPassword);
router.get("/resetPassword", userController.resetPassword);

//blog
router.post("/blogs",jwtMiddleware.verifyToken, validation.blogValid, blogController.createBlog);

router.get("/blogs/:userId", validation.verifyId, jwtMiddleware.verifyToken, blogController.getBlogs);
router.put("/blogs/:userId", validation.verifyId, jwtMiddleware.verifyToken, jwtMiddleware.authorizedUser,validation.updateBlogData, blogController.updateBlogs);
router.delete("/blogs/:userId", validation.verifyId, jwtMiddleware.verifyToken, jwtMiddleware.authorizedUser, blogController.updateBlogs);

//comment

router.post("/comments",jwtMiddleware.verifyToken, validation.commentValid, commentController.createComment);

router.get("/comments",validation.verifyBlogId, jwtMiddleware.verifyToken, commentController.getComments);
router.put("/comments/:userId", validation.verifyId,  validation.commentId, jwtMiddleware.verifyToken, jwtMiddleware.authorizedUser,validation.updateCommentsData, commentController.updateComments);
router.delete("/comments/:userId", validation.verifyId, validation.commentId, jwtMiddleware.verifyToken, jwtMiddleware.authorizedUser, commentController.deleteComments);



module.exports = router;