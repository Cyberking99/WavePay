import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

class BankAccount extends Model {
    declare public id: number;
    declare public user_id: number;
    declare public bank_code: string;
    declare public bank_name: string;
    declare public account_number: string;
    declare public account_name: string;
}

BankAccount.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        bank_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        bank_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        account_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        account_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        beneficiary_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'bank_accounts',
    }
);

User.hasMany(BankAccount, { foreignKey: 'user_id', as: 'bankAccounts' });
BankAccount.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default BankAccount;
