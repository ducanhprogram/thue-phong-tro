"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Post.belongsTo(models.Image, {
                foreignKey: "imagesId",
                targetKey: "id",
                as: "images",
            });
            Post.belongsTo(models.Attribute, {
                foreignKey: "attributesId",
                targetKey: "id",
                as: "attributes",
            });
            Post.belongsTo(models.User, {
                foreignKey: "userId",
                targetKey: "id",
                as: "user",
            });
        }
    }
    Post.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: DataTypes.STRING,
            star: DataTypes.STRING,
            labelCode: DataTypes.STRING,
            address: DataTypes.STRING,
            attributesId: DataTypes.TEXT,
            categoryCode: DataTypes.STRING,
            priceCode: DataTypes.STRING,
            areaCode: DataTypes.STRING,
            description: DataTypes.TEXT,
            userId: DataTypes.INTEGER,
            overviewId: DataTypes.STRING,
            imagesId: DataTypes.STRING,
            priceNumber: DataTypes.FLOAT,
            areaNumber: DataTypes.FLOAT,
            provinceCode: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Post",
            timestamps: true,
            // underscored: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            charset: "utf8",
            collate: "utf8_general_ci",
        }
    );
    return Post;
};
