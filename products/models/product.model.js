const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nutricoach-api');
const Schema = mongoose.Schema;

const productSchema  = new Schema({
   name : String
});

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
productSchema.set('toJSON', {
    virtuals: true
});

productSchema.findById = function (cb) {
    return this.model('Products').find({id: this.id}, cb);
};

const Product = mongoose.model('Products', productSchema);


exports.findByEmail = (email) => {
    return Product.find({email: email});
};
exports.findById = (id) => {
    return Product.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createProduct = (productData) => {
    const product = new Product(productData);
    return product.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Product.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, products) {
                if (err) {
                    reject(err);
                } else {
                    resolve(products);
                }
            })
    });
};

exports.patchProduct = (id, productData) => {
    return new Promise((resolve, reject) => {
        Product.findById(id, function (err, product) {
            if (err) reject(err);
            for (let i in productData) {
                product[i] = productData[i];
            }
            product.save(function (err, updatedProduct) {
                if (err) return reject(err);
                resolve(updatedProduct);
            });
        });
    })

};

exports.removeById = (productId) => {
    return new Promise((resolve, reject) => {
        Product.remove({_id: productId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};