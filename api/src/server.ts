import fastify from 'fastify'

import {
  serializerCompiler,
  validatorCompiler
} from 'fastify-type-provider-zod'
import { createEvent } from './routes/create-event'
import { registerForEvent } from './routes/register-for-event'
import { getEvent } from './routes/get-event'
import { getAttendeeBadge } from './routes/get-attendee-badge'


const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

export default async function handler(req: any, reply: any) {
  await app.ready()
  app.server.emit('request', req, reply)
}
app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAttendeeBadge)

app.listen({ port: 3000 }).then(() => {
  console.log('http server running...')
})
