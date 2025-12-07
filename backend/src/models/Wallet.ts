import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

class Wallet extends Model {
    declare public id: number;
    declare public user_id: number;
    declare public type: 'evm' | 'svm';
    declare public wallet_reference: string;
    declare public wallet_id: string;
    declare public wallet_address: string;
    declare public auto_offramp: boolean;
}

Wallet.init(
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
        type: {
            type: DataTypes.ENUM('evm', 'svm'),
            allowNull: false,
        },
        wallet_reference: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        wallet_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        wallet_address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        auto_offramp: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: 'wallets',
    }
);

export default Wallet;
