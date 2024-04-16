//@ts-ignore
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { number, z } from 'zod'
import { db } from '../lib/prisma'

export async function getEventAttendees(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/events/:eventId/attendees',
    {
      schema: {
        summary: 'Get event attendee',
        tags: ['events'],
        params: z.object({
          eventId: z.string().uuid()
        }),
        querystring: z.object({
          query: z.string().nullish(),
          pageIndex: z.string().nullish().default('0').transform(Number)
        }),
        response: {
          200: z.object({
            attendees: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                email: z.string().email(),
                createdAt: z.date(),
                checkedInAt: z.date().nullish()
              })
            )
          })
        }
      }
    },
    async (req, reply) => {
      const { eventId } = req.params
      const { pageIndex, query } = req.query

      const attendees = await db.attendee.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          CheckIn: {
            select: {
              createdAt: true
            }
          }
        },
        where: query
          ? {
              eventId,
              name: {
                contains: query
              }
            }
          : {},
        take: 10,
        skip: pageIndex * 10,
        orderBy: {
          createdAt: 'desc'
        }
      })
      return reply.send({
        attendees: attendees.map(attendees => {
          return {
            id: attendees.id,
            name: attendees.name,
            email: attendees.email,
            createdAt: attendees.createdAt,
            checkedInAt: attendees.CheckIn?.createdAt || null
          }
        })
      })
    }
  )
}
