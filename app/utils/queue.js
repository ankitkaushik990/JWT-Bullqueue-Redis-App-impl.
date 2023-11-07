const Queue = require("bull");
const { REDIS_HOST, REDIS_PORT } = require("../../config/env");
const { users } = require("../model");
function setupQueue() {
  const randomQueue = new Queue("randomNumberQueue", {
    redis: {
      port: REDIS_PORT,
      host: REDIS_HOST,
    },
  });

  randomQueue.process(async (job) => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const userId = job.data.userId;

    try {
      await users.update(
        { randomNumber: randomNumber },
        { where: { id: userId } }
      );

      console.log(
        `Generated random number ${randomNumber} for user ID ${userId}`
      );
      return randomNumber;
    } catch (error) {
      console.error(
        `Error updating random number for user ID ${userId}:`,
        error
      );
    }
  });

  randomQueue.on("completed", async (job, result) => {
    const Qresult = await job.finished();
    console.log(`Job ${job.id} completed with result ${Qresult}`);
  });

  return randomQueue;
}

module.exports = setupQueue;
