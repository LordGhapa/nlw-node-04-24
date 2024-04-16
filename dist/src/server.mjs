import {
  getEvent
} from "../chunk-RA4KIVB4.mjs";
import {
  registerForEvent
} from "../chunk-5LCBM3SB.mjs";
import {
  errorHandler
} from "../chunk-36WW3CKW.mjs";
import {
  checkIn
} from "../chunk-YJ4TGHPK.mjs";
import {
  createEvent
} from "../chunk-76PXNCYR.mjs";
import "../chunk-5EMXPJ5T.mjs";
import {
  getAttendeeBadge
} from "../chunk-2JJJJTUY.mjs";
import "../chunk-K352R5CC.mjs";
import {
  getEventAttendees
} from "../chunk-4M23AFWJ.mjs";
import "../chunk-QBI5SRMV.mjs";

// api/src/server.ts
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform
} from "fastify-type-provider-zod";
var app = fastify();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(fastifyCors, {
  origin: "*"
});
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "pass.in",
      description: "Especifica\xE7\xF5es da API constru\xEDda durante evento NLW da rocketseat",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUI, {
  routePrefix: "/docs"
});
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);
app.setErrorHandler(errorHandler);
app.listen({ port: 3e3, host: "0.0.0.0" }).then(() => {
  console.log("http server running...");
});
async function handler(req, reply) {
  await app.ready();
  app.server.emit("request", req, reply);
}
export {
  handler as default
};
