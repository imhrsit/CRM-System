require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5003;
const sequelize = require('./config/database');

app.use(express.json());

const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL, 'https://your-frontend-domain.com'] 
        : true,
    credentials: true
};
app.use(cors(corsOptions));

const leadRoutes = require('./routes/leadRoutes');
app.use('/api/leads', leadRoutes);

app.get('/', (req, res) => {
    res.send('CRM Backend is running');
});

sequelize.sync()
    .then(() => {
        console.log('Database synced');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Unable to sync database:', err);
    });


