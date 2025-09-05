"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Overview extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Overview.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            code: DataTypes.STRING,
            area: DataTypes.STRING,
            type: DataTypes.STRING,
            target: DataTypes.STRING,
            bonus: DataTypes.STRING,
            created: DataTypes.DATE,
            expire: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "Overview",
            timestamps: true,
            // underscored: true,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            charset: "utf8",
            collate: "utf8_general_ci",
        }
    );
    return Overview;
};
