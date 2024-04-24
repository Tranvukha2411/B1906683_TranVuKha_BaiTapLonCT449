const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
const ProductService = require("../services/products.service");
const upload = require("../utils/upload.util");
const { ExplainVerbosity } = require("mongodb");
const CartService = require('../services/cart.service');
const OrderService = require('../services/order.service');
const CommentService = require('../services/comment.service');
const nodemailer = require("nodemailer");

exports.create = (req, res) => {
    console.log("Đây là create Handle");
} ;

exports.findAll = (req, res) => {
   console.log("Hello");
};

//exports module dùng để dùng ở bất cứ đâu khi được gọi tên

exports.findOne = (req, res) => {
    res.send({massgae: 'Find One handle.'});
};

exports.update = (req, res) => {
    res.send({massage: 'update handle.'});
};

exports.delete = (req, res) => {
    res.send({massage: 'delete handle.'});
};

exports.deleteAll = (req, res) => {
    res.send({massage: 'deleteAll handle.'});
};

exports.findAllFavorite = (req, res) => {
    res.send({massage: 'findAllFavorite handle.'});
}; 

exports.create = async (req, res, next) => {
    if(!req.body?.name) {
        return (next (new ApiError(400,"Lỗi không tên nè")));
    }
   
    try{ 
        const contactService = new ContactService(MongoDB.client);
        const documents = await contactService.create(req.body);
        //console.log(documents);
        return res.send(documents);
        
    } catch(error) {
        console.log('An error found!',error)
        return next(
            new ApiError(500, "An error occured while creating the contact")
        );
    }
};

exports.createProduct = async( req, res, next) => {
    if(!req.body?.name) {
        return next(new ApiError(400, "Name cannot empty"));
    }
    if(!req.file) {
        console.log("No file found");
    } else {
        console.log("One file found")
    }
    try{
        const productService = new ProductService(MongoDB.client);
        const document = await productService.createProduct(req.body);
        return res.send(document);
    }
    catch(error) {
        console.log('An error Found when create a product', error)
        return next(new ApiError(500, "An error occured while creating the contact"))
    }
};

exports.createCart = async( req, res, next) => {
    if(!req.body?.name) {
        return next(new ApiError(400, "Name cannot empty"));
    }
    if(!req.file) {
        console.log("No file found");
    } else {
        console.log("One file found")
    }
    try{
        const cartService = new CartService(MongoDB.client);
        const document = await cartService.createCart(req.body);
        return res.send(document);
    }
    catch(error) {
        console.log('An error Found when create a product', error)
        return next(new ApiError(500, "An error occured while creating the contact"))
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const contactService = new ContactService(MongoDB.client);
        
        const {name} = req.query;
        if(name) {
            documents = await contactService.findByName(name); 
        } else {
            documents = await contactService.find({});

          
        }
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while retrieving contacts")

        );
    }

    return res.send(documents);
}

exports.findAllProduct = async (req, res, next) => {
    let document = [];
    try {
        const productService = new ProductService(MongoDB.client);
        const {name} = req.query;
        if(name) {
            document = await productService.findByName(name);
        } else{
            document = await productService.find({});
        }
    } catch(error) {
        console.log(error);
        return next(new ApiError(500,"È lỗi tè le rồi"));
    }
    return res.send(document);
}

exports.findAllCart = async (req, res, next) => {
    let document = [];
    try {
        const cartService = new CartService(MongoDB.client);
        const {name} = req.query;
        if(name) {
            document = await cartService.findByName(name);
        } else{
            document = await cartService.find(req.params.id);
        }
    } catch(error) {
        console.log(error);
        return next(new ApiError(500,"È lỗi tè le rồi"));
    }
    return res.send(document);
}
//handle FindOne
exports.findOne = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const documents = await contactService.findById(req.params.id);
        if(!documents) {
            return next(new ApiError(404, "Không tìm thấy liên kết (Trong hàm handle findOne)"));
        }
  
        return res.send(documents);
    } catch (error) {
        return next(
            new ApiError(
                500, "Error retrieving contact with id =" + req.params.id
            )
        );
    }
};

exports.checkUser = async(req, res, next) => {
    console.log(req.params.email);
}

exports.findOneProduct = async (req, res, next) => {
    try{
        const productService = new ProductService(MongoDB.client);
        const document = await productService.findById(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Lỗi rồi nè"));
        }

        return res.send(document);
    } catch(error) {
        return next( new ApiError(500,"Lỗi khi truy xuất sản phẩm với id = "+req.params.id))
    }
}

exports.findOneCart = async (req, res, next) => {
    try{
        const cartService = new CartService(MongoDB.client);
       
        const document = await cartService.findByUserId(req.params.id1, req.params.id2);
        // console.log(document);
        if(!document) {
            return next(new ApiError(404, "Lỗi rồi nè"));
        }

        return res.send(document);
    } catch(error) {
        return next( new ApiError(500,"Lỗi khi truy xuất sản phẩm với id = "+req.params.id))
    }
}

exports.findByProductId = async (req, res, next) => {
    try{
        const cartService = new CartService(MongoDB.client);
       
        const document = await cartService.findByProductId(req.params.id);
        // console.log(document);
        if(!document) {
            return next(new ApiError(404, "Lỗi rồi nè"));
        }

        return res.send(document);
    } catch(error) {
        return next( new ApiError(500,"Lỗi khi truy xuất sản phẩm với id = "+req.params.id))
    }
}




exports.findOneCartById = async (req, res, next) => {
    try{
        const cartService = new CartService(MongoDB.client);
        const document = await cartService.findById(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Lỗi rồi nè"));
        }
        return res.send(document);
    } catch(error) {
        return next( new ApiError(500,"Lỗi khi truy xuất sản phẩm với id = "+req.params.id))
    }
}

exports.deleteCartByCount = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const document = await cartService.deleteCartCount(req.params.id, req.body);
        if(!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({ message: "Contact was updated succesfully "});
    } catch (error) {
        return next( new ApiError(500, "Error updating contact with id = " + req.params.id));
    }
}

exports.deleteCart = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const document = await cartService.delete(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({message: "Contact was deleted successfully"});
    } catch (error) {
        return next(
            new ApiError(500, "Could not delete contact with id = " + req.params.id)
        );
    }
}
//Handle Update

exports.update = async (req, res, next) => {
    if(Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id, req.body);
        if(!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({ message: "Contact was updated succesfully "});
    } catch (error) {
        return next( new ApiError(500, "Error updating contact with id = " + req.params.id));
    }
};

exports.updateCart = async (req, res, next) => {
    // if(Object.keys(req.body).length === 0) {
    //     return next(new ApiError(400, "Data to update can not be empty"));
    // }

    try {
        const cartService = new CartService(MongoDB.client);
        const document = await cartService.updateCart(req.params.id1, req.params.id2, req.body);
        if(!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({ message: "Contact was updated succesfully "});
    } catch (error) {
        return next( new ApiError(500, "Error updating contact with id = " + req.params.id));
    }
};

//Cai dat handle delete

exports.delete = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if(!document) {
            // return next(new ApiError(404, "Contact not found"));
            console.log("Deleted");
        }
        return res.send({message: "Contact was deleted successfully"});
    } catch (error) {
        return next(
            new ApiError(500, "Could not delete contact with id = " + req.params.id)
        );
    }
};

//cai dat handle findAllFavorite

exports.findAllFavorite = async (req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findFavorite();
        return res.send(document);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "An error occurred while retrieving favorite contacts"));
    }
};


exports.deleteAll = async (_req, res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const deleteCount = await contactService.deleteAll();
        return res.send ({
            message: deleteCount + " contact were deleted successfully",
        });
    } catch (error) {
        return next(new ApiError (500, "An error occurred while removing all contacts"));
    }
};

exports.deleteAllProduct = async (_req, res, next) => {
    try{
        const productService = new ProductService(MongoDB.client);
        const deleteCount = await productService.deleteAll();
        return res.send({
            message: deleteCount + " Sản phẩm đã bị xóa",
        });
    } catch(error) {
        return next(new ApiError(500, "Lỗi rồi nè (Ở phần deleteAllProduct)"));
    }
};

exports.deleteAllCart = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const deleteCount = await cartService.deleteAll(req.params.id);
        return res.send ({
            message: deleteCount + " contact were deleted successfully",
        });
    } catch (error) {
        return next(new ApiError (500, "An error occurred while removing all contacts"));
    }
}

exports.deleteProduct = async (req, res, next) => {
    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.delete(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({message: "Contact was deleted successfully"});
    } catch (error) {
        return next(
            new ApiError(500, "Could not delete contact with id = " + req.params.id)
        );
    }
};

exports.deleteCartbyProductId = async (req, res, next) => {
    try {
        const cartService = new CartService(MongoDB.client);
        const document = await cartService.deleteCartbyProductId(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({message: "Contact was deleted successfully"});
    } catch (error) {
        return next(
            new ApiError(500, "Could not delete contact with id = " + req.params.id)
        );
    }
};

exports.updateProduct = async (req, res, next) => {
    if(Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const productService = new ProductService(MongoDB.client);
        const document = await productService.updateProduct(req.params.id, req.body);
        if(!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({ message: "Contact was updated succesfully "});
    } catch (error) {
        return next( new ApiError(500, "Error updating contact with id = " + req.params.id));
    }
};

exports.reUpdateCart = async (req, res, next) => {
    if(Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try {
        const cartService = new CartService(MongoDB.client);
        const document = await cartService.reUpdateCart(req.params.id, req.body);
        if(!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({ message: "Contact was updated succesfully "});
    } catch (error) {
        return next( new ApiError(500, "Error updating contact with id = " + req.params.id));
    }
};

exports.createOrder = async (req, res, next) => {
    try{ 
        const orderService = new OrderService(MongoDB.client);
        const documents = await orderService.createOrder(req.body);
        if(!documents) {
            console.log('Lỗi ở dòng 421');
        }
        return res.send(documents);
        
    } catch(error) {
        console.log('An error found!',error)
        return next(
            new ApiError(500, "An error occured while creating the contact")
        );
    }
};

exports.findAllInvoice = async (req, res, next) => {
    try {
        const orderService = new OrderService(MongoDB.client);
        const {name} = req.query;
        if(name) {
            documents = await orderService.findByName(name); 
        } else {
            documents = await orderService.find({});    
        }
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, "An error occurred while retrieving contacts")

        );
    }
    return res.send(documents);
}

exports.getHistory = async (req, res, next) => {
    let document = [];
    try {
        const orderService = new OrderService(MongoDB.client);
        const {name} = req.query;
        if(name) {
            document = await orderService.findByName(name);
        } else{
            document = await orderService.findById(req.params.id);
        }
        if(!document) {
            console.log("Lỗi ở dòng 483 !");
        }
    } catch(error) {
        console.log(error);
        return next(new ApiError(500,"È lỗi tè le rồi"));
    }
    return res.send(document);
};

exports.updateOrder = async (req, res, next) => {
    if(Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try {
        const orderService = new OrderService(MongoDB.client);
        const document = await orderService.update(req.params.id, req.body);
        if(!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({ message: "Contact was updated succesfully "});
    } catch (error) {
        return next( new ApiError(500, "Error updating contact with id = " + req.params.id));
    }
};

exports.deleteInvoice = async (req, res, next) => {
    try {
        const orderService = new OrderService(MongoDB.client);
        const document = await orderService.delete(req.params.id);
        if(!document) {
            return next(new ApiError(404, "Invoice not found"));
        }
        return res.send({message: "Invoices was deleted successfully"});
    } catch (error) {
        return next(
            new ApiError(500, "Could not delete contact with id = " + req.params.id)
        );
    }
}

exports.createComment = async (req,res, next) => {
    try{ 
        const cmtService = new CommentService(MongoDB.client);
        const documents = await cmtService.createCmt(req.body);
        if(!documents) {
            console.log('Lỗi ở dòng 421');
        }
        return res.send(documents);
        
    } catch(error) {
        console.log('An error found!',error)
        return next(
            new ApiError(500, "Đã xải ra lỗi khi thêm một đánh giá")
        );
    }
};

exports.getComment = async (req, res, next) => {
    let document = [];
    try {
        const cmtService = new CommentService(MongoDB.client);
            document = await cmtService.findById(req.params.id);
        if(!document) {
            console.log("Lỗi ở dòng 533 !");
        }
    } catch(error) {
        console.log(error);
        return next(new ApiError(500,"È lỗi tè le ở dòng 537 rồi"));
    }
    return res.send(document);
};

exports.sendEmail = async (req, res, next) => {
    const {email} = req.body;
    const contactService = new ContactService(MongoDB.client);
    let document = await contactService.findByEmail(req.body);
    console.log(document);
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: "tkha9696@gmail.com",
          pass: "dget rqrv vbqm jtsx",
        },
      });
      
      // async..await is not allowed in global scope, must use a wrapper
   
        // send mail with defined transport object
        await transporter.sendMail({
          from: 'tkha9696@gmail.com', // sender address
          to: `${email}`, // list of receivers
          subject: "Hello ✔", // Subject line
          text: "Mật khẩu của bạn là " + document, // plain text body
          html: "<b>Mật khẩu của bạn là </b>" + document, // html body
        }, (err) => {
            if(err) {
                return res.json({
                    message:'Lỗi !',
                    err,
                });
            }
            return res.json({
                message:'Đã gửi mail thành công',
            })
        });
}