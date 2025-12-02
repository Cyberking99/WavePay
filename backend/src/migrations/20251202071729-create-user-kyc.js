'use strict';
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('userKyc', {
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
        dob: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        bvn: {
            type: Sequelize.STRING,
            allowNull: true
        },
        nin: {
            type: Sequelize.STRING,
            allowNull: true
        },
        identity_type: {
            type: Sequelize.ENUM('bvn', 'nin'),
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
    await queryInterface.dropTable('userKyc');
}
