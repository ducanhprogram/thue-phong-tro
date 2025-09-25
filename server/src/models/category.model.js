"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Category.hasMany(models.Post, {
                foreignKey: "categoryCode",
                sourceKey: "code",
                as: "posts",
            });
        }
    }
    Category.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            code: DataTypes.STRING,
            value: DataTypes.STRING,
            header: DataTypes.STRING,
            subheader: DataTypes.STRING,
            slug: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            sequelize,
            modelName: "Category",
            timestamps: true,
            // underscored: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            charset: "utf8",
            collate: "utf8_general_ci",
        }
    );
    return Category;
};
