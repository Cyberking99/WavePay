import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Transaction extends Model {
    declare public id: number;
    declare public hash: string;
    declare public from: string;
    declare public to: string;
    declare public amount: string;
    declare public token: string;
    declare public status: string;
    declare public type: string;
    declare public linkId: string | null;
}

Transaction.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        hash: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        from: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        to: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'pending',
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        linkId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        transactionPayload: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'transactions',
    }
);

export default Transaction;
