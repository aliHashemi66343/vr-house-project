import {shared_variables} from "../../variables/shared_variables.js";

export const request_token_funcs={

  get_jwt_token_from_request:function (req) {
    try {
      var token = req.headers.authorization.split(shared_variables.jwt_header_sign)[1].trim();
    } catch {
      token = null;
    }
    return token;
  }


  

   
}
