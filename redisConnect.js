const { createClient } = require('redis');

let client = null;

const connectRedis = async () => {
    console.log('Connecting to Redis...');
    client = createClient({
        username: 'default',
        password: process.env.REDIS_PWD,
        socket: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        }
    });
    
    client.on('error', err => console.log('Redis Client Error', err));
    
    await client.connect();
    
    await client.set('ashwini', 'mane');
    const result = await client.get('foo');
    console.log(result)  // >>> bar
}

module.exports = { connectRedis, getRedisClient: () => client };



