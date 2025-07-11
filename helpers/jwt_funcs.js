import { db_methods } from "../database/db_funcs.js"
import {shared_variables} from "../variables/shared_variables.js"
import jwt from "jsonwebtoken"

export const jwt_funcs={
    get_user_obj_from_jwt_token:async function (token) {
        var jwt_user_obj = this.verify_jwt_and_get_jwt_obj(token)

        
         
        return await db_methods.get_table_single_record_by_where_obj(shared_variables.users_table_name, {id:jwt_user_obj.user_id});
      },

      verify_jwt_and_get_jwt_obj:function (token,jwt_pass=shared_variables.jwt_secret_pass){
        return jwt.verify(token,jwt_pass)
      },
      sign_jwt_token_get_jwt_token:function (obj_to_sign,expire_hours=2,jwt_pass=shared_variables.jwt_secret_pass){
        return jwt.sign(
            obj_to_sign,
            jwt_pass,
            {
              expiresIn: `${expire_hours}h`,
            }
          );
      },
}