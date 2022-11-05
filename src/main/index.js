const env = require('./config/env');

const { MongoHelper } = require('../infra/helpers/mongodb-helper');

MongoHelper.connect(env.mongodbUrl)
  .then(() => {
    const app = require('./config/app');
    app.listen(env.port, () => console.info('server is running at port 3033'));
  })
  .catch(console.error);
