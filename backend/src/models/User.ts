import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class User extends Model {
    declare public id: number;
    declare public address: string;
    declare public fullName: string;
    declare public username: string;
    declare public isOnboarded: boolean;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        isOnboarded: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: 'users',
    }
);

export default User;
