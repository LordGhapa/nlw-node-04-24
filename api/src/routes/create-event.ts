import z from 'zod'
import { generateSlug } from '../../utils/generate-slug'
import { ZodTypeProvider } from 'fastify-type-provider-zod'

import { FastifyInstance } from 'fastify'
import { db } from '../lib/prisma'
import { BadRequest } from './_errors/bad-request'

export async function createEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/events',
    {
      schema: {
        summary: 'Create an event',
        tags: ['events'],
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable()
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid()
          })
        }
      }
    },
    async (req, reply) => {
      const { details, maximumAttendees, title } = req.body

      const slug = generateSlug(title)

      const eventWithSameSlug = await db.event.findUnique({
        where: {
          slug
        }
      })
      if (eventWithSameSlug != null) {
        throw new BadRequest('outro evento com mesmo Title ja existe')
      }
      const event = await db.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug
        }
      })

      return reply.status(201).send({ eventId: event.id })
    }
  )
}
