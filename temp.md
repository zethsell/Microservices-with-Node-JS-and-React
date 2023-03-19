In auth/src/test/setup.ts, change these lines:

mongo = new MongoMemoryServer();
const mongoUri = await mongo.getUri();
to this:

const mongo = await MongoMemoryServer.create();
const mongoUri = mongo.getUri();

Remove the useNewUrlParser and useUnifiedTopology parameters from the connect method. Change this:

await mongoose.connect(mongoUri, {
useNewUrlParser: true,
useUnifiedTopology: true,
});
to this:

await mongoose.connect(mongoUri, {});

Then, find the afterAll hook and add a conditional check:

afterAll(async () => {
if (mongo) {
await mongo.stop();
}

##globalThis has no index signature TS Error
declare global {
namespace NodeJS {
export interface Global {
signin(): Promise<string[]>;
}
}
}
change to:

    declare global {
      var signin: () => Promise<string[]>;
    }

module.exports = {
webpack: (config) => {
config.watchOptions.poll = 300;
return config;
},
};

##Mozilla works with https loclaly
about:config
network.stricttransportsecurity.preloadlist: false
