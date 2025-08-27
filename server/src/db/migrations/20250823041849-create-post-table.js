"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("posts", {
            id: {
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER,
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
                type: Sequelize.STRING,
            },
            categoryCode: {
                type: Sequelize.STRING,
            },
            description: {
                type: Sequelize.STRING,
            },
            userId: {
                type: Sequelize.STRING,
            },
            overviewId: {
                type: Sequelize.STRING,
            },
            imageId: {
                type: Sequelize.STRING,
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
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable("posts");
    },
};
