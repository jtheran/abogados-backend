import dotenv from 'dotenv';

dotenv.config();

const config = {
    adminEmail: process.env.EMAIL_ADMIN || 'jmtbqa@outlook.es',
    adminPass: process.env.PASS_ADMIN || 'Testing24!',
    port: process.env.PORT || 3298,
    key: process.env.KEY_SECRET || 'zaqwer',
    refreshKey: process.env.REFRESH_KEY || 'zaqwer',
    timeout: process.env.SESSION_TIMEOUT_MINUTES || 30,
};

export default config;