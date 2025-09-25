"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Area extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Area.hasMany(models.Post, {
                foreignKey: "areaCode",
                sourceKey: "code",
                as: "posts",
            });
        }
    }
    Area.init(
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
            modelName: "Area",
            timestamps: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            charset: "utf8",
            collate: "utf8_general_ci",
        }
    );
    return Area;
};
