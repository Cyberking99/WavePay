import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

class UserDetails extends Model {
    declare public id: number;
    declare public user_id: number;
    declare public userId: string;
    declare public identityId: string | null;
    declare public email: string | null;
}

UserDetails.init(
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
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        identityId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'userDetails',
    }
);

// Define association
User.hasOne(UserDetails, { foreignKey: 'user_id', as: 'details' });
UserDetails.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default UserDetails;
