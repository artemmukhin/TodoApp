const mongoose = require('mongoose').set('strictQuery', true);
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;

// Function to disconnect MongoDB
async function disconnectMongoDB() {
    await mongoose.disconnect();
    if (mongod) {
        await mongod.stop();
    }
}

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    // Ensure necessary environment variables are set for tests
    if (!process.env.JWT_SECRET) {
        process.env.JWT_SECRET = 'test-secret';
    }
});

afterAll(async () => {
    await disconnectMongoDB();
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
});
