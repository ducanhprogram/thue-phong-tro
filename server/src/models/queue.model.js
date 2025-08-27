"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Queue extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Queue.init(
        {
            id: {
                type: DataTypes.BIGINT.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            type: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            payload: {
                type: DataTypes.STRING(255),
                defaultValue: null,
            },
            status: {
                type: DataTypes.STRING(50),
                defaultValue: "pending",
                allowNull: false,
            },
            retries: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
        },
        {
            sequelize,
            modelName: "Queue",
            tableName: "queues",
            timestamps: true,
            underscored: false,
            createdAt: "createdAt",
            updatedAt: "updatedAt",
            charset: "utf8",
            collate: "utf8_general_ci",
        }
    );
    return Queue;
};
