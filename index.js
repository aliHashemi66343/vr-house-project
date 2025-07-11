import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import dotenv from "dotenv"
dotenv.config()
// const db_migrations = require("./database/migration");
import { http_server_funcs } from "./http_server/http_server_funcs.js";
import {shared_variables} from "./variables/shared_variables.js"



var main = async () => {
  try {



    shared_variables.http_server_host = process.env.HTTP_SERVER_HOST;
    shared_variables.http_server_port = process.env.HTTP_SERVER_PORT;


    http_server_funcs.serve_http_server(
      process.env.HOST,
      process.env.PORT
    );

    
  } catch (error) {
    console.log(error);
  }
};
await main();