// POST TABLE MIGRATION - FIXED VERSION
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Posts", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
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
                allowNull: false,
            },
            attributesId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "Attributes",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            priceCode: {
                type: Sequelize.STRING,
                allowNull: true,
                references: {
                    model: "prices",
                    key: "code",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            areaCode: {
                type: Sequelize.STRING,
                allowNull: true,
                references: {
                    model: "areas",
                    key: "code",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            categoryCode: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: "categories",
                    key: "code",
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false,
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
                type: Sequelize.INTEGER,
                references: {
                    model: "Overviews",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            imagesId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "Images",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            provinceCode: {
                type: Sequelize.STRING,
                references: {
                    model: "provinces",
                    key: "code",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            priceNumber: {
                type: Sequelize.FLOAT,
                defaultValue: 0,
            },
            areaNumber: {
                type: Sequelize.FLOAT,
                defaultValue: 0,
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
