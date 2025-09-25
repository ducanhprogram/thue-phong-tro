"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Price extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Price.hasMany(models.Post, {
                foreignKey: "priceCode",
                sourceKey: "code",
                as: "posts",
            });
        }
    }
    Price.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            code: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            value: DataTypes.STRING,
            order: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Price",
            tableName: "prices",
            timestamps: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            charset: "utf8",
            collate: "utf8_general_ci",
        }
    );
    return Price;
};
