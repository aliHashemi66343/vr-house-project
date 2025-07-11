import { auth_middlewares } from "../http_server/middleware/auth_middlewares.js";
import { express_route_handlers } from "../http_server/route_handlers.js";
import { postValidation } from "../http_server/validators/post_validator.js";
import { signupValidation } from "../http_server/validators/signup_validator.js";
import { passwordValidation } from "../http_server/validators/password_validator.js";
export const shared_variables = {
  jwt_header_sign: "JWT",

  jwt_secret_pass: "j=03945u9g-wjpnj-9uhy",
  perPage: 10,
  http_server_host: "1.2.3.4",
  http_server_port: 0,
  vue_port: 10443,
  enc_key_length: 16,

  http_routes: function () {
    return [
      {
        path: "/api/posts",
        method: "get",
        auth_required: true,
        middlewares: [auth_middlewares.isAuth],
        handler: express_route_handlers.api_post_index,
        swagger: {
          summary: "Get all Posts",
          description: "Returns a list of Posts",
          parameters: [
            {
              name: "page",
              in: "query",
              required: false,
              schema: { type: "string" },
            },
            {
              name: "sort_by",
              in: "query",
              required: false,
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "List of Posts",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        content: { type: "string" },
                        tags: { type: "string" },
                        view_number: { type: "number" },
                        author_id: { type: "string" },
                        title: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        path: "/api/posts/:pid",
        method: "get",
        auth_required: true,
        middlewares: [auth_middlewares.isAuth],
        handler: express_route_handlers.api_post_get_by_id,
        swagger: {
          summary: "Get Post by Id",
          description: "Returns a single record of Post by its Id",
          parameters: [
            {
              name: "pid",
              in: "path",
              required: true,
              description: "Id of Post",
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "A record of Post",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      content: { type: "string" },
                      tags: { type: "string" },
                      view_number: { type: "number" },
                      author_id: { type: "string" },
                      title: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },

      {
        path: "/api/posts",
        method: "post",
        auth_required: true,
        handler: express_route_handlers.api_post_store,
        swagger: {
          summary: "Create new Post",
          description: "creates a Post record",
          request: {
            description: "",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    tags: { type: "string" },
                    content: { type: "string" },
                    title: { type: "string" },
                  },
                  required: ["title"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "Store Successfully",
              content: {
                string: {
                  schema: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        middlewares: [postValidation, auth_middlewares.isAuth],
      },
      {
        path: "/api/posts/:pid",
        method: "delete",
        auth_required: true,
        middlewares: [auth_middlewares.isAuth],
        handler: express_route_handlers.api_post_delete,
        swagger: {
          summary: "Deletes a Post record by id",
          description: "Deletes a Post record by id",
          parameters: [
            {
              name: "pid",
              in: "path",
              required: true,
              description: "Id of Post",
              schema: { type: "string" },
            },
          ],

          responses: {
            200: {
              description: "Delete Successfully",
              content: {
                string: {
                  schema: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },

      {
        path: "/api/posts/:pid",
        method: "put",
        auth_required: true,
        handler: express_route_handlers.api_post_update,
        swagger: {
          summary: "Update a Post record",
          description: "Update Successfully",
          parameters: [
            {
              name: "pid",
              in: "path",
              required: true,
              description: "Id of Post",
              schema: { type: "string" },
            },
          ],
          request: {
            description: "",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    tags: { type: "string" },
                    content: { type: "string" },
                    title: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Update Successfully",
              content: {
                string: {
                  schema: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        middlewares: [postValidation, auth_middlewares.isAuth],
      },

      {
        path: "/api/login",
        method: "post",
        handler: express_route_handlers.api_login,
        swagger: {
          summary: "Login User",
          description:
            "Return a JSON includes user JWT token if login is successful",
          request: {
            description: "",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: { type: "string" },
                    password: { type: "string" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "JSON includes token and user_id",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      token: { type: "string" },
                      user_name: { type: "string" },
                      user_id: { type: "string" },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        auth_required: false,
      },
      {
        path: "/api/signup",
        method: "post",
        middlewares: [signupValidation],
        handler: express_route_handlers.api_signup,
        swagger: {
          summary: "Creates User",
          description:
            "Get new user's fields and Return a JSON includes user JWT token if signup is successful",
          request: {
            description: "",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: { type: "string" },
                    password: { type: "string" },
                    email: { type: "string" },
                    job: { type: "string" },
                    age: { type: "number" },
                  },
                  required: ["username", "password"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "JSON includes token and user_id",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      token: { type: "string" },
                      user_name: { type: "string" },
                      user_id: { type: "string" },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
        auth_required: false,
      },

      {
        path: "/api/logout",
        method: "get",
        auth_required: true,
        middlewares: [auth_middlewares.isAuth],

        handler: express_route_handlers.api_logout,
        swagger: {
          summary: "Logout User",
          description: "Makes the JWT token of user invalid",

          responses: {
            200: {
              description: "logout user successfully!",
              content: {
                string: {
                  schema: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
      {
        path: "/api/users/no_expire/toggle",
        method: "get",
        middlewares: [auth_middlewares.isAuth],
        handler: express_route_handlers.api_noExpire_toggle,
        swagger: {
          summary: "Make user dees not expire",
          description: "Make user dees not expire(disable temporarily!)",
          request: {
            description: "",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    username: { type: "string" },
                    password: { type: "string" },
                  },
                  required: ["username", "password"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "Success Message",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { type: "object" },
                  },
                },
              },
            },
          },
        },
        auth_required: true,
      },

      {
        path: "/api/users/edit",
        method: "put",
        auth_required: true,
        middlewares: [passwordValidation, auth_middlewares.isAuth],
        handler: express_route_handlers.api_user_edit_password,
        swagger: {
          summary: "Change password of User",
          description:
            "For change password of user by taking password and password_confirmation",
          request: {
            description: "",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    password: { type: "string" },
                    password_confirmation: { type: "string" },
                  },
                  required: ["password", "password_confirmation"],
                },
              },
            },
          },
          responses: {
            200: {
              description: "Success Message",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { type: "object" },
                  },
                },
              },
            },
          },
        },
      },
      {
        path: "/api/users/:uid",
        method: "delete",
        auth_required: true,
        middlewares: [auth_middlewares.isAuth],
        handler: express_route_handlers.api_user_delete,
        swagger: {
          summary: "Delete user bi Id",
          description: "Delete user bi Id",
          parameters: [
            {
              name: "uid",
              in: "path",
              required: true,
              description: "Id of User",
              schema: { type: "string" },
            },
          ],
          responses: {
            200: {
              description: "Success Message",
              content: {
                string: {
                  schema: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
    ];
  },
};
