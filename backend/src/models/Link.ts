import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';

class Link extends Model {
    declare public id: number;
    declare public userId: number; // Assuming we link to internal user ID, or address? Let's use address for simplicity if User model uses address as key, but User model has ID. Let's use address to match other patterns or ID if we have auth user.
    // User model has ID and address. Auth middleware attaches user to req.user.
    // Let's use address as the foreign key reference or just store address.
    // Storing address is safer for now as we rely on address for auth.
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
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.STRING,
            allowNull: false,
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
