import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Link extends Model {
    declare public id: number;
    declare public linkId: string;
    declare public userId: number;
    declare public address: string;
    declare public amount: string;
    declare public description: string;
    declare public type: string;
    declare public expiryDate: Date;
    declare public customFields: string; // JSON string
    declare public active: boolean;
    declare public uses: number;
}

Link.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        linkId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expiryDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        customFields: {
            type: DataTypes.TEXT, // Store as JSON string
            allowNull: true,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        uses: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        tableName: 'links',
    }
);

export default Link;
