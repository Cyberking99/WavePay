import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

class UserKyc extends Model {
    declare public id: number;
    declare public user_id: number;
    declare public dob: string;
    declare public bvn: string | null;
    declare public nin: string | null;
    declare public identity_type: 'bvn' | 'nin';
}

UserKyc.init(
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
        dob: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        bvn: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        nin: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        identity_type: {
            type: DataTypes.ENUM('bvn', 'nin'),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'userKyc',
    }
);

// Define association
User.hasOne(UserKyc, { foreignKey: 'user_id', as: 'kyc' });
UserKyc.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default UserKyc;
