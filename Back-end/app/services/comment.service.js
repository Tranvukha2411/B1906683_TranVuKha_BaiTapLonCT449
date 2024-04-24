const {ObjectId} = require("mongodb");

class CommnetService {
    constructor(client) {
        this.Cmt = client.db().collection('report');
    }

    extractCmtData(payload) {
        const cmt = {
            productId: payload.productId,
            userID: payload.userID,
            content: payload.content,
            ngaydang: payload.ngaydang,
            username: payload.username,
            userAvatar: payload.userAvatar,
            anonymous: payload.anonymous,
            star: payload.star,
        };

        Object.keys(cmt).forEach(
            (key) => cmt[key] === undefined && delete cmt[key]
        );
            return cmt;
    }

    async createCmt(payload) {
        const cmt  = this.extractCmtData(payload);
        const result = await this.Cmt.findOneAndUpdate(
            cmt,
            { $set: { star: cmt.star === null} },
            { returnDocument: "after", upsert: true}
        );
        return result;
    }

    async findById(productId) {
        try{
            const query = {productId: productId};
            const result = await this.Cmt.find(query).toArray();
            return result;
        }catch(error) {
            console.log(error);
        }
    }
}

module.exports = CommnetService;