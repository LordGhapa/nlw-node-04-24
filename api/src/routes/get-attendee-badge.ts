import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '../lib/prisma'
import { BadRequest } from './_errors/bad-request'

export async function getAttendeeBadge(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/attendees/:attendeeId/badge',
    {
      schema: {
        summary: 'Get an attendee badge',
        tags: ['attendees'],
        params: z.object({
          attendeeId: z.coerce.number().int()
        }),
        response: {
          200: z.object({
            badge: z.object({
              name: z.string(),
              email: z.string(),
              eventTitle: z.string(),
              checkInUrl: z.string().url()
            })
          })
        }
      }
    },
    async (req, reply) => {
      const { attendeeId } = req.params

      const attendee = await db.attendee.findUnique({
        select: {
          name: true,
          email: true,
          event: {
            select: {
              title: true
            }
          }
        },
        where: { id: attendeeId }
      })

      if (attendee === null) {
        throw new BadRequest('Participante não encontrado')
      }
      const baseUrl = `${req.protocol}://${req.hostname}`
      const checkInUrl = new URL(`/attendee/${attendeeId}/check-in`, baseUrl)

      return reply.send({
        badge: {
          name: attendee.name,
          email: attendee.email,
          eventTitle: attendee.event.title,
          checkInUrl: checkInUrl.toString()
        }
      })
    }
  )
}
