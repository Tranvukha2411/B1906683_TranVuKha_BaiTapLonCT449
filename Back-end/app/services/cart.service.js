const { ObjectId } = require("mongodb");

class CartService {
  constructor(client) {
    this.Cart = client.db().collection("cart");
  }

  extractCart(payload) {
    const cart = {
      productId: payload.productId,
      userID: payload.userID,
      name: payload.name,
      img: payload.img,
      type: payload.type,
      price: payload.price,
      author: payload.author,
      describe: payload.describe,
      count: payload.count,
      bought: payload.bought,
      ngaythem: payload.ngaythem,
      vanchuyen: payload.vanchuyen,
    };
    Object.keys(cart).forEach(
      (key) => cart[key] === undefined && delete cart[key]
    );
    return cart;
  }

  async findById(id) {
    return await this.Cart.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async find(userID) {
    try {
      const query = { userID: userID };
      const result = await this.Cart.find(query).toArray();
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async createCart(payload) {
    const cart = this.extractCartData(payload);
    const result = await this.Cart.findOneAndUpdate(
      cart,
      {
        $set: {
          bought: cart.bought === true,
          vanchuyen: cart.vanchuyen === true,
        },
      },
      { returnDocument: "after", upsert: true }
    );
    return result;
  }
  async findByUserId(userID, productId) {
    try {
      const query = {
        userID: userID,
        productId: productId,
      };
      const cart = await this.Cart.findOne(query);
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async findByProductId(productId) {
    try {
      const query = {
        productId: productId,
      };
      const cart = await this.Cart.findOne(query);
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async updateCart(userID, productId, payload) {
    // const document =  await this.Cart.find({
    //     userID: {$regex: new RegExp(userID) },
    // }).toArray();

    try {
      const query = { userID: userID, productId: productId };
      const update = this.extractCartData(payload);
      const result = await this.Cart.findOneAndUpdate(query, { $set: update });
      if (result) {
        return result;
      } else {
        console.log("Faile");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async reUpdateCart(productId, payload) {
    try {
      const query = { productId: productId };
      const update = this.extractCartData(payload);
      const result = await this.Cart.updateMany(query, { $set: update });
      if (result) {
        return result;
      } else {
        console.log("Faile");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCartbyProductId(productId) {
    try {
      const query = { productId: productId };
      const result = await this.Cart.deleteMany(query);
      if (result) {
        return result;
      } else {
        console.log("Faile");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCartCount(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractCartData(payload);
    const result = await this.Cart.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result;
  }

  async delete(id) {
    const result = await this.Cart.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
  }
  async deleteAll(userId) {
    const result = await this.Cart.deleteMany({ userID: userId });
    console.log(result);
    return result.deletedCount;
  }
}

module.exports = CartService;
