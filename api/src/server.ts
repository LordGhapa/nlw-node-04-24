import fastify from 'fastify'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

const app = fastify()
const db = new PrismaClient({
  log: ['query']
})

app.post('/events', async (req, reply) => {
  const createEventSchema = z.object({
    title: z.string().min(4),
    details: z.string().nullable(),
    maximumAttendees: z.number().int().positive().nullable()
  })
  const data = createEventSchema.parse(req.body)
  const event = await db.event.create({
    data: {
      title: data.title,
      details: data.details,
      maximumAttendees: data.maximumAttendees,
      slug: new Date().toISOString()
    }
  })

  return reply.status(201).send({ eventID: event.id })
})

export default async function handler(req: any, reply: any) {
  await app.ready()
  app.server.emit('request', req, reply)
}

app.listen({ port: 3000 }).then(() => {
  console.log('http server running...')
})
