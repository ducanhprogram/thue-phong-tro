"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Overviews", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            code: {
                type: Sequelize.STRING,
            },
            area: {
                type: Sequelize.STRING,
            },
            type: {
                type: Sequelize.STRING,
            },
            target: {
                type: Sequelize.STRING,
            },
            bonus: {
                type: Sequelize.STRING,
            },
            created: {
                type: Sequelize.STRING,
            },
            expired: {
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
        await queryInterface.dropTable("Overviews");
    },
};
