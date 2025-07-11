import {response_funcs}  from "../response_funcs.js"
import {shared_variables}  from "../../variables/shared_variables.js"
import {request_token_funcs}  from "./jwt_token_funcs.js"
import jwt  from "jsonwebtoken"
import { TokenBlockList } from "../../model/token_blocklist.js"
import { db_methods } from "../../database/db_funcs.js"
export const auth_middlewares = {
  isAuth: async function (req, res, next) {
    try {

      
        
      var token = request_token_funcs.get_jwt_token_from_request(req);
      if (token) {
        var block_list_token =
          await db_methods.get_table_single_record_by_where_obj(
            TokenBlockList,
            { token: token }
          );
        if (block_list_token) {
          response_funcs.send_response(res, "Not Authorized", 401);

          return;
        }

        try {
          var jwt_usr_obj = jwt.verify(token, shared_variables.jwt_secret_pass);
        } catch (error) {
          var jwt_usr_obj = null;
        }

        if (jwt_usr_obj != null) {
          return await next();
        }
      }
      else{
        response_funcs.send_response(res, "Not Authorized", 401);
        return
      }
      
    } catch (error) {
      response_funcs.send_response(res, `error:<br>${error} `, 500);
      return
    }

    response_funcs.send_response(res, "Not Authorized", 401);
  }
};
