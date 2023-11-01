const cors = require("cors");
const express = require("express");
require("express-async-errors");
const helmet = require("helmet");
// const { openapiSpecification } = require('./swagger_docs/swagger');
// const swaggerUi = require('swagger-ui-express');
const { errorMiddleware } = require("./middlewares/error.middleware");
const { catchUnhandledError } = require("./utils/unhandledError");
const { PORT } = require("../config/env");
const { sequelize } = require("./model/index"); 
const routes = require("./routes");

class App {
  constructor() {
    this.app = express();
    this.port = PORT;
    this.routes = routes;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorMiddleware();
  }

  listen() {
    this.app.listen(this.port, () => {
      catchUnhandledError();
      console.info(`🚀 App listening on port ${this.port}`);
    });
  }

  initializeMiddlewares() {
    this.app.use(cors({ origin: "*" }));
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  initializeRoutes() {
    this.routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }

  initializeErrorMiddleware() {
    this.app.use(errorMiddleware);
  }

  //   initializeSwagger() {
  //     this.app.use(
  //       '/api-docs',
  //       swaggerUi.serve,
  //       swaggerUi.setup(openapiSpecification)
  //     );
  //   }
}

module.exports = App;
