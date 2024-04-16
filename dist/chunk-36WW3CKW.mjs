import {
  BadRequest
} from "./chunk-K352R5CC.mjs";

// api/src/error-handler.ts
import { ZodError } from "zod";
var errorHandler = (err, req, reply) => {
  const { validation, validationContext } = err;
  if (err instanceof ZodError) {
    return reply.status(400).send({
      message: `Error during `,
      errors: err.flatten().fieldErrors
    });
  }
  if (err instanceof BadRequest) {
    return reply.status(400).send({ message: err.message });
  }
  return reply.status(500).send({ message: "Internal server error !!! " });
};

export {
  errorHandler
};
