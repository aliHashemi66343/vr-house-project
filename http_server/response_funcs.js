
export const response_funcs={
    send_response:function (res, body, status_code = 200) {
        res.status(status_code).send(body);
    },
  

}
