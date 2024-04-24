const {ObjectId} = require("mongodb");

class OrderService {
    constructor(client) {
        this.Order = client.db().collection('order');
     }
     extractOrderData(payload) {
        const order = {
            userID: payload.userID,
            username: payload.username,
            items: payload.items.map(item => ({
                name: item.name,
                price: item.price,
                count: item.count,
                img: item.img,
                productId: item.productId,
            })),
            confirmed: payload.confirmed,
            ngaythem: payload.ngaythem,
            tongtien: payload.tongtien,
        };
        Object.keys(order).forEach(
            (key) => order[key] === undefined && delete order[key]
        );
            return order;
    }

    async createOrder(payload) {
        const order  = this.extractOrderData(payload);
        const result = await this.Order.findOneAndUpdate(
            order,
            { $set: { confirmed: order.confirmed === true} },
            { returnDocument: "after", upsert: true}
        );
        return result;
    }
    async findById(userID) {
        try{
            const query = {userID: userID};
            const result = await this.Order.find(query).toArray();
            return result;
        }catch(error) {
            console.log(error);
        }
    }

    async find(filter) {
        const cursor = await this.Order.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: {$regex: new RegExp(name), $options: "i"},
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractOrderData(payload);
        const result = await this.Order.findOneAndUpdate(
            filter, { $set: update }, { returnDocument: "after"}
        );
        return result;
    }

    async delete(id) {
        const result = await this.Order.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
}

module.exports = OrderService;