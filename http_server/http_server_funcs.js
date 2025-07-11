
import {express_route_handlers} from "./route_handlers.js"
import https from "https"
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {shared_variables} from "../variables/shared_variables.js"
import  swaggerUi  from "swagger-ui-express";
import { swaggerSpec } from "../documentation/swagger.js";


const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "500mb", extended: true }));
app.use(express.json({limit:'500mb'}))
app.use(express.urlencoded({limit:'500mb',extended:true}))
// If using raw or text body
app.use(express.raw({ limit: "250mb" }));
app.use(bodyParser.raw({ limit: "250mb" }));
app.use(express.text({ limit: "250mb" }));
app.use(bodyParser.text({ limit: "250mb" }));


shared_variables.http_routes().forEach((route)=>{
  if (!swaggerSpec.paths[route.path]) {
    swaggerSpec.paths[route.path] = {};
  }

  swaggerSpec.paths[route.path][route.method] = {
    summary: route.swagger.summary,
    description: route.swagger.description,
    responses: route.swagger.responses,
    parameters:route.swagger.parameters,
    requestBody: route.swagger.request,
  };
})
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export const http_server_funcs={

   
   
    
    serve_http_server:function (server_host,server_port) {
        try {

           
          this.config_http_request_handlers()
          if (server_port == 443) {
            const privateKey = fs.readFileSync(
              "",
              "utf8"
            );
            const certificate = fs.readFileSync(
              "",
              "utf8"
            );
            const ca = fs.readFileSync(
              "",
              "utf8"
            );
      
            const credentials = {
              key: privateKey,
              cert: certificate,
              ca: ca,
            };
            httpsServer = https.createServer(credentials, app);


            var server=httpsServer.listen(server_port, () => {
            });
            server.setTimeout(0)
            server.keepAliveTimeout = 0; // No timeout for idle connections
            server.headersTimeout = 0; 
          } else {
            var server=app.listen(server_port, () => {
              console.log(`Express web server listening on port ${server_port}`);
            });
            server.setTimeout(0)
            server.keepAliveTimeout = 0; // No timeout for idle connections
            server.headersTimeout = 0; 
          }
        } catch (error) {
          console.log(`error:${error} and error stack is ${error.stack}`);
        }
      },
    

      
      config_http_request_handlers : async function ()  {

    
        try {
          
          shared_variables.http_routes().forEach(async (route) => {
            
            
            if (route.method=="get") {
              
              app.get(
                route.path,
                route.middlewares ? route.middlewares : [],
                async (req, res, next) => {
                  await route.handler(req, res);
                }
              );
            }
            if (route.method=="post") {
              app.post(
                route.path,
                route.middlewares?route.middlewares:[],
                async (req, res, next) => {
                  await route.handler(req, res);
                }
              );
            }
            if (route.method=="put") {
              app.put(
                route.path,
                route.middlewares?route.middlewares:[],
                async (req, res, next) => {
                  await route.handler(req, res);
                }
              );
            }
            if (route.method=="delete") {
              app.delete(
                route.path,
                route.middlewares?route.middlewares:[],
                async (req, res, next) => {
                  await route.handler(req, res);
                }
              );
            }
          });
          app.get("*", async function (req, res) {
            await express_route_handlers.handle_not_found(req, res);
          });
          app.post("*", async function (req, res) {
            await express_route_handlers.handle_not_found(req, res);
          });
        } catch (error) {
          console.log(`error:${error} and error stack is ${error.stack}`);
        }
      },

      
}


