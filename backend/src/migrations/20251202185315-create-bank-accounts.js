'use strict';
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('bank_accounts', {
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
        bank_code: {
            type: Sequelize.STRING,
            allowNull: false
        },
        bank_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        account_number: {
            type: Sequelize.STRING,
            allowNull: false
        },
        account_name: {
            type: Sequelize.STRING,
            allowNull: false
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
    await queryInterface.dropTable('bank_accounts');
}
