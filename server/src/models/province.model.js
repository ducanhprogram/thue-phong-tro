"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Province extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Province.hasMany(models.Post, {
                foreignKey: "provinceCode",
                sourceKey: "code",
                as: "posts",
            });
        }
    }
    Province.init(
        {
            code: DataTypes.STRING,
            value: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Province",
            tableName: "provinces",
            timestamps: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            charset: "utf8",
            collate: "utf8_general_ci",
        }
    );
    return Province;
};
