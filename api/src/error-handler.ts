import { FastifyInstance } from 'fastify'
import { BadRequest } from './routes/_errors/bad-request'
import { ZodError } from 'zod'
type FastifyErrorHandle = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandle = (err, req, reply) => {
  const { validation, validationContext } = err

  if (err instanceof ZodError) {
    return reply.status(400).send({
      message: `Error during `,
      errors: err.flatten().fieldErrors,
    })
  }

  if (err instanceof BadRequest) {
    return reply.status(400).send({ message: err.message })
  }
  return reply.status(500).send({ message: 'Internal server error !!! ' })
}
