import dotenv from 'dotenv';
import app from './app.js';
import sequelize from './config/database.js';

dotenv.config();

const port = process.env.PORT || 3000;

// Sync database
// sequelize.sync({ alter: true }).then(() => {
//     console.log('Database synced');
// }).catch((err) => {
//     console.error('Failed to sync database:', err);
// });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
