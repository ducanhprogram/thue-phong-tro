"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("queues", {
            id: {
                type: Sequelize.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            type: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            payload: {
                type: Sequelize.STRING(255),
                defaultValue: null,
            },
            status: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            retries: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            error_message: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("queues");
    },
};
