// POST TABLE MIGRATION
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Posts", {
            id: {
                type: Sequelize.INTEGER, // ✅ Chỉ định rõ độ dài 36
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: Sequelize.STRING,
            },
            star: {
                type: Sequelize.STRING,
                defaultValue: "0",
            },
            labelCode: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
            },
            attributesId: {
                type: Sequelize.STRING(36), // ✅ Sửa từ TEXT thành STRING(36)
            },
            priceCode: {
                type: Sequelize.STRING,
            },
            areaCode: {
                type: Sequelize.STRING,
            },
            categoryCode: {
                type: Sequelize.STRING,
            },
            description: {
                type: Sequelize.TEXT,
            },
            userId: {
                type: Sequelize.INTEGER.UNSIGNED,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            overviewId: {
                type: Sequelize.STRING(36),
            },
            imagesId: {
                type: Sequelize.STRING(36),
            },
            areaCode: {
                type: Sequelize.STRING,
            },
            priceCode: {
                type: Sequelize.STRING,
            },
            provinceCode: {
                type: Sequelize.STRING,
            },
            priceNumber: {
                type: Sequelize.FLOAT,
            },
            areaNumber: {
                type: Sequelize.FLOAT,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Posts");
    },
};
