const RecipeController = require('./controllers/recipes.controller');
const PermissionMiddleware = require('../common/middleware/auth.permission.middleware');
const ValidationMiddleware = require('../common/middleware/auth.validation.middleware');
const config = require('../common/config/env.config');

const ADMIN = config.permissionLevels.ADMIN;
const PAID = config.permissionLevels.PAID_USER;
const FREE = config.permissionLevels.NORMAL_USER;

exports.routesConfig = function (app) {
    app.post('/recipes', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        RecipeController.insert
    ]);
    app.get('/recipes', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        RecipeController.list
    ]);
    app.get('/recipes/:recipeId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        RecipeController.getById
    ]);
    app.patch('/recipes/:recipeId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        RecipeController.patchById
    ]);
    app.delete('/recipes/:recipeId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        RecipeController.removeById
    ]);

    app.get('/recipes/user/:userId', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.minimumPermissionLevelRequired(FREE),
        RecipeController.getByUserId
    ]);
};