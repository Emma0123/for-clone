const redis = require("redis");
const clientRedis = redis.createClient(6379);

clientRedis.on("connect", () => {
    console.log("Connect");
});
clientRedis.on("error", (error) => {
    console.log(error);
});

// Function to connect to redis
const redisConnect = async () => await clientRedis.connect();


module.exports = { clientRedis, redisConnect };