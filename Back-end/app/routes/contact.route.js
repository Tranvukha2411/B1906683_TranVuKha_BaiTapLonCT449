const express = require('express');

const contacts = require('../controllers/contact.controller');

const router = express.Router();
// const upload = require("../utils/upload.util");
const app = express();
const multer = require('multer');
const upload = multer({
    limits: { fileSize: 100 * 1024 * 1024 }, 
})
router.route("/")
    .get(contacts.findAll) //Dùng các mudole đã được định nghĩa ở file controllers
    .post(contacts.create)
    .delete(contacts.deleteAll);
    
// router.route("/:id")
//     .get(contacts.findOne);

router.route("/user/:id")
    .get(contacts.findOne)
    .put(contacts.update)
    .delete(contacts.delete);

router.route("/home/")
    .get(contacts.findAllProduct)
    .post(upload.single('img'),contacts.createProduct)
    .delete(contacts.deleteAllProduct);

router.route("/home/:id")
    .get(contacts.findOneProduct)
    .delete(contacts.deleteProduct)
    .put(contacts.updateProduct);

router.route("/home/:id1/:id2/product")
    .post(contacts.createCart)
    .get(contacts.findOneCart)
    .put(contacts.updateCart);

router.route("/home/comment")
    .post(contacts.createComment);

router.route("/home/comment/:id")
    .get(contacts.getComment);

router.route("/home/:id/product")
    .get(contacts.findByProductId);

router.route("/home/:id/cart")
    .get(contacts.findAllCart)
    .put(contacts.reUpdateCart)
    .delete(contacts.deleteAllCart);

router.route("/home/cart/:id")
    .get(contacts.findOneCartById)
    .put(contacts.deleteCartByCount)
    .delete(contacts.deleteCart);
router.route("/cart/:id")
    .delete(contacts.deleteCartbyProductId);

router.route("/manager/order")
    .get(contacts.findAllInvoice)
    .post(contacts.createOrder);

router.route("/manager/order/:id/")
    .put(contacts.updateOrder)
    .delete(contacts.deleteInvoice);

router.route('/home/:id/history')
    .get(contacts.getHistory);

router.route('/sendMail')
    .post(contacts.sendEmail);
module.exports = router;
