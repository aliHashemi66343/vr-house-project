import swaggerJSDoc from "swagger-jsdoc";
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My Node API",
      version: "1.0.0",
      description: "API documentation",
    },
  },
  apis: ["../http_server/*.js"], // Path to your annotated routes
};

export const swaggerSpec = swaggerJSDoc(options);

