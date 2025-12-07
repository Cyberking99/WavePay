'use strict';
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('wallets', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        },
        type: {
            type: Sequelize.ENUM('evm', 'svm'),
            allowNull: false
        },
        wallet_reference: {
            type: Sequelize.STRING,
            allowNull: false
        },
        wallet_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        wallet_address: {
            type: Sequelize.STRING,
            allowNull: false
        },
        auto_offramp: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE
        }
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('wallets');
}
