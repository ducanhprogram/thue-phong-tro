"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Attribute extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Attribute.init(
        {
            price: DataTypes.STRING,
            acreage: DataTypes.STRING,
            published: DataTypes.STRING,
            hashtag: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Attribute",
            timestamps: true,
            // underscored: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            charset: "utf8",
            collate: "utf8_general_ci",
        }
    );
    return Attribute;
};
