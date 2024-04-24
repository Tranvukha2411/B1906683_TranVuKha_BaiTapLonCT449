const {ObjectId} = require("mongodb");

class ContactService {
    constructor(client) {
       this.Contact = client.db().collection('users');
    }

    extractContactData(payload){
        const users = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            password: payload.password,
            avatar: payload.avatar,
            admin: payload.admin
        };

    Object.keys(users).forEach(
        (key) => users[key] === undefined && delete users[key]
    );
        return users;
    }

    async create(payload) {
        const users = this.extractContactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            users,
            { $set: { admin: users.admin === true, avatar: users.avatar === null} },
            { returnDocument: "after", upsert: true}
        );
        return result;
    }

    async find(filter) {
        const cursor = await this.Contact.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: {$regex: new RegExp(name), $options: "i"},
        });
    }

    async findByEmail(email) {
        try{
            const query = {email: email};
            console.log(query);
            const result = await this.Contact.findOne(email, 'password');
            return result.password;
        }catch(error) {
            console.log(error);
        }
    }

    // async findByEmail(email) {
    //     return await this.find({
    //         email: {$regex: new RegExp(email), $options:"i"},
    //     });
    // }

    async findById(id) {
        return await this.Contact.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractContactData(payload);
        const result = await this.Contact.findOneAndUpdate(
            filter, { $set: update }, { returnDocument: "after"}
        );
        return result;
    }

    //delete method
    async delete(id) {
        const result = await this.Contact.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result;
    }

    //findFavorite method

    async findFavorite() {
        return await this.find({favorite: true});
    }

    //DeleteAll method
    async deleteAll() {
        const result = await this.Contact.deleteMany({});
        console.log(result);
        return result.deletedCount;
    }
}


module.exports = ContactService;
