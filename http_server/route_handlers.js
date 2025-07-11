import {request_token_funcs} from "./middleware/jwt_token_funcs.js"
import {request_parser_funcs} from "./request_funcs.js"
import {validationResult} from "express-validator";
import {jwt_funcs} from "../helpers/jwt_funcs.js"
import {response_funcs} from "./response_funcs.js"
import {db_methods} from "../database/db_funcs.js"
import {User} from "../model/user.js"
import {Post} from "../model/post.js"
import { TokenBlockList } from "../model/token_blocklist.js"
import jwt from "jsonwebtoken"
import { shared_variables } from "../variables/shared_variables.js";
export const express_route_handlers = {
  api_login: async function (req, res) {
    try {
      var user_name = "";
      var password = "";
      var json_received = request_parser_funcs.get_request_data(req);

      var user_name = json_received.username;
      
      var auth_user_obj =
        await db_methods.get_table_single_record_by_where_obj(
          User,
          {"username":user_name}
         
        );

      if (auth_user_obj != null) {
      
        password = json_received.password;
        if (await auth_user_obj.comparePassword(password)) {
          
          var obj_to_sign = {
            user_id: auth_user_obj.id,
            user_name: user_name,
          };
          if (auth_user_obj.no_expire == true) {
            var token = jwt_funcs.sign_jwt_token_get_jwt_token(
              obj_to_sign,
              60 * 24
            );
          } else {
            var token = jwt_funcs.sign_jwt_token_get_jwt_token(obj_to_sign);
          }


          var data_to_send = {
            token: token,
            user_name: user_name,
            user_id: auth_user_obj.id,
            user_no_expire: auth_user_obj.no_expire,
            message: "auth success",
          };
          response_funcs.send_response(res, data_to_send, 200);
        } else {
          response_funcs.send_response(
            res,
            "Username or Password is incorrect",
            401
          );
        }
      } else {
        response_funcs.send_response(
          res,
          "Username or Password is incorrect",
          401
        );
      }
    } catch (err) {
      console.log("err");
      console.log(err);
      
      response_funcs.send_response(res,err,500)
    }
  },
  api_signup: async function (req, res) {
    try {
     
      var json_received = request_parser_funcs.get_request_data(req);

      var user_name = json_received.username;

      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      json_received["no_expire"]=false
      var created_user_obj =
        await db_methods.insert_record(User,json_received)

      if (created_user_obj != null) {
      
          
          var obj_to_sign = {
            user_id: created_user_obj.id,
            user_name: user_name,
          };
          
            var token = jwt_funcs.sign_jwt_token_get_jwt_token(obj_to_sign);
          


          var data_to_send = {
            token: token,
            user_name: user_name,
            user_id: created_user_obj.id,
            user_no_expire: created_user_obj.no_expire,
            message: "auth success",
          };
          response_funcs.send_response(res, data_to_send, 200);
        
      } 
    } catch (err) {
        
        response_funcs.send_response(res,err.toString(),409)
      
      
    }
  },
  api_logout: async function (req, res) {
    try {
      var token = request_token_funcs.get_jwt_token_from_request(req);

      var data_to_insert = { token: token };
      await db_methods.insert_record(
        TokenBlockList,
        data_to_insert
      );

      response_funcs.send_response(res, "Successfully Logout!", 200);
    } catch (err) {
      
    }
  },
  
  api_post_index: async function (req, res) {
    try {
      var page = req.query.page ? req.query.page : null;

      var sort_by = req.query.sort_by;
      


      var posts = await db_methods.select_data_fields_with_where(
        Post,
        {},
        "*",
        20,
        { [sort_by]: 1 },
        page
      );
      return response_funcs.send_response(res,JSON.stringify(posts),200); 

    } catch (error) {

    }

  },
  api_post_get_by_id: async function (req, res) {
    try {
      var post_id = req.params.pid
      
      var post_obj=await db_methods.get_table_single_record_by_where_obj(
        Post,{_id:post_id}
      );

      var res_json_str = JSON.stringify(post_obj);

      
      response_funcs.send_response(res,res_json_str,200)
    } catch (error) {
      response_funcs.send_response(res,`error ${error}`,500)
    }

  },
  
  api_post_store: async function (req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      var body = request_parser_funcs.get_request_data(req);
      var token = request_token_funcs.get_jwt_token_from_request(req);
      var jwt_usr_obj = jwt.verify(token, shared_variables.jwt_secret_pass);
      body["author_id"]=jwt_usr_obj.user_id
      
        await db_methods.insert_record(
          Post,
          body
        );

      var res_json = { message: "Post stored Successfully!" };

      var res_json_str = JSON.stringify(res_json);
      response_funcs.send_response(res, res_json_str, 200);
    } catch (error) {
      response_funcs.send_response(res, `${error} `, 500);
    }
  },

  api_post_delete: async function (req, res) {
    try {
      var post_id = req.params.pid;
      

      await db_methods.delete_data_with_where(
        Post,
        {_id:post_id}
      );
      var res_json = { message: "post deleted Successfully!" };
      var res_json_str = JSON.stringify(res_json);
      response_funcs.send_response(res, res_json_str, 200);
    } catch (error) {
      response_funcs.send_response(res, `error:</br>${error} `, 500);
    }
  },

  api_post_update: async function (req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      var pid = req.params.pid;
      
      var req_body = request_parser_funcs.get_request_data(req);
     
    
    
      

      await db_methods.update_where_with_data(
        Post,
        {_id:pid},
        req_body
      );
      response_funcs.send_response(res,"post updated Successfuly!")

    } catch (error) {
      response_funcs.send_response(res,`error : ${error}`)

    }

  },



  
  api_user_edit_password: async function (req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      var body = request_parser_funcs.get_request_data(req);

      var token = request_token_funcs.get_jwt_token_from_request(req);
      var jwt_usr_obj = jwt_funcs.verify_jwt_and_get_jwt_obj(token);
      var auth_user =
        await db_methods.get_table_single_record_by_where_obj(
          User,
          { _id: jwt_usr_obj.user_id }
        );
      var user_to_edit_id = auth_user.id;
      var json_received = body;

   
      var password = json_received.password;
      
     
       
        await db_methods.update_where_with_data(
          User,
          {_id:user_to_edit_id},
          { password: password }
          
        );
        var res_json = { message: "User Edited Successfully!" };
        var res_json_str = JSON.stringify(res_json);

        response_funcs.send_response(res, res_json_str, 200);
      
    } catch (error) {
      response_funcs.send_response(res, `error:${error} `, 500);
    }
  },
 
 
  api_user_delete: async function (req, res) {
    try {
      var uid = req.params.uid;
      await db_methods.delete_data_with_where(
        User,
        { _id: uid }
      );
      var res_json = { message: "User Deleted Successfully!" };
      var res_json_str = JSON.stringify(res_json);
      response_funcs.send_response(res, res_json_str, 200);
    } catch (error) {
      response_funcs.send_response(res, `error:<br>${error} `, 500);
    }
  },
  

  handle_not_found: function (req, res) {
    try {
      // res.status(200).send()
      response_funcs.send_response(
        res,
        `<!DOCTYPE html>
          
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
      </head>
      <body>
          <h1>404 Not Found</h1>
      </body>
      </html>`,
        404
      );
    } catch (error) {
    }
  },
  auth_empty_func: function (req, res) {
    return response_funcs.send_response(res, { message: "OK" }, 200);
  },
};

