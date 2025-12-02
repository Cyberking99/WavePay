'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.addColumn('users', 'kyc_status', {
    type: Sequelize.ENUM('inactive', 'pending', 'approved', 'rejected'),
    allowNull: false,
    defaultValue: 'inactive'
  });
}

export async function down(queryInterface, Sequelize) {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
  await queryInterface.removeColumn('users', 'kyc_status');
};
