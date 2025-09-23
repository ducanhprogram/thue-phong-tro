"use strict";
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("provinces", {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            code: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            value: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("provinces");
    },
};
