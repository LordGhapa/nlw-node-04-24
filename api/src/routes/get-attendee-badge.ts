import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '../lib/prisma'

export async function getAttendeeBadge(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/attendees/:attendeeId/badge',
    {
      schema: {
        params: z.object({
          attendeeId: z.coerce.number().int()
        }),
        response: {
          200: z.object({
            attendee: z.object({
              name: z.string(),
              email: z.string(),
              event: z.object({
                title: z.string()
              })
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
        throw new Error('Participante não encontrado')
      }

      return reply.send({
        attendee
      })
    }
  )
}