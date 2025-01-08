import mongoose from 'mongoose';

const MONGODB_MAX_POOL_SIZE = 10;
const MONGODB_TIMEOUT = 5000;

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    try {
        if (connection.isConnected) {
            return;
        }

        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI not found in environment variables");
        }

        // Configure mongoose connection options
        mongoose.set('strictQuery', true);
        
        const options: mongoose.ConnectOptions = {
            maxPoolSize: MONGODB_MAX_POOL_SIZE,
            serverSelectionTimeoutMS: MONGODB_TIMEOUT,
            socketTimeoutMS: MONGODB_TIMEOUT,
            connectTimeoutMS: MONGODB_TIMEOUT,
            retryWrites: true,
            writeConcern: {
                w: 'majority'
            }
        };

        const db = await mongoose.connect(process.env.MONGODB_URI, options);
        connection.isConnected = db.connections[0].readyState;

        // Handle connection events
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            if (!connection.isConnected) {
                process.exit(1);
            }
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
            connection.isConnected = 0;
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                console.log('MongoDB connection closed through app termination');
                process.exit(0);
            } catch (err) {
                console.error('Error closing MongoDB connection:', err);
                process.exit(1);
            }
        });

    } catch (error) {
        console.error("Database connection failed", error);
        // Don't exit process on connection failure in production
        if (process.env.NODE_ENV === 'production') {
            connection.isConnected = 0;
        } else {
            process.exit(1);
        }
    }
}

export default dbConnect;
