const {ObjectId} = require("mongodb");


class ProductService {
    constructor(client) {
        this.Product = client.db().collection('product');
    }

    extractProductData(payload) {
        const products = {
            name: payload.name,
            type: payload.type,
            price: payload.price,
            author:payload.author,
            img: payload.img,
            describe: payload.describe,
            salerate: payload.salerate,
            revenue: payload.revenue,
            onsale: payload.onsale,
        };

        Object.keys(products).forEach(
            (key) => products[key] === undefined && delete products[key]
        );
            return products;
    }

    async createProduct(payload) {
        const products = this.extractProductData(payload);
        const result = await this.Product.findOneAndUpdate(
            products,
            { $set: { onsale: products.onsale === true, revenue: products.revenue === 0} },
            { returnDocument: "after", upsert: true}
        );
        return result;
    }

    async find(filter) {
        const cursor = await this.Product.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: {$regex: new RegExp(name), $options: "i"},
        });
    }

    async findById(id) {
        return await this.Product.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async updateProduct(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractProductData(payload);
        const result = await this.Product.findOneAndUpdate(
            filter, { $set: update }, { returnDocument: "after"}
        );
        return result;
    }
    
    async delete(id) {
        const result = await this.Product.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }
    async deleteAll() {
        const result = await this.Product.deleteMany({});
        console.log(result);
        return result.deletedCount;
    }
};



module.exports = ProductService;