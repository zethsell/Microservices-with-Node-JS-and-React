import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

declare global {
    var signin: () => string[];
}


let mongo: any
beforeAll(async () => {
    process.env.JWT_KEY = 'testeley'
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    mongoose.set('strictQuery', false)
    await mongoose.connect(mongoUri, {});
})

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections()

    collections.map(async collection => {
        await collection.deleteMany({})
    })
})

afterAll(async () => {
    if (mongo) {
        await mongo.stop();
        await mongoose.disconnect()
    }
})

global.signin = () => {
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'test@test.com'
    }

    const token = jwt.sign(payload, process.env.JWT_KEY!)
    const session = { jwt: token }
    const sessionJSON = JSON.stringify(session)
    const base64 = Buffer.from(sessionJSON).toString('base64')
    return [`session=${base64}`];
}