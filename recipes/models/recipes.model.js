const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_DATABASE_URL);
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    title: String,
    imageUrl: String,
    sourceUrl: String,
    userId: String,
});

recipeSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
recipeSchema.set('toJSON', {
    virtuals: true
});

recipeSchema.findById = function (cb) {
    return this.model('Recipes').find({ id: this.id }, cb);
};

const Recipes = mongoose.model('Recipes', recipeSchema);


exports.findByUserId = (id) => {
    return Recipes.find({
        $or: [
            { userId: id }
        ],
    })
        .then((result) => {
            return result;
        });
};
exports.findById = (id) => {
    return Recipes.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createRecipe = (recipeData) => {
    const recipe = new Recipes(recipeData);
    return recipe.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Recipes.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, recipes) {
                if (err) {
                    reject(err);
                } else {
                    resolve(recipes);
                }
            })
    });
};

exports.patchRecipe = (id, recipeData) => {
    return new Promise((resolve, reject) => {
        Recipes.findById(id, function (err, recipe) {
            if (err) reject(err);
            for (let i in recipeData) {
                recipe[i] = recipeData[i];
            }
            recipe.save(function (err, updatedRecipe) {
                if (err) return reject(err);
                resolve(updatedRecipe);
            });
        });
    })

};

exports.removeById = (recipeId) => {
    return new Promise((resolve, reject) => {
        Recipes.remove({ _id: recipeId }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};