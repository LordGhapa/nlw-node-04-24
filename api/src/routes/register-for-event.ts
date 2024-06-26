import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { db } from '../lib/prisma'
import { BadRequest } from './_errors/bad-request'

export async function registerForEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/events/:eventId/attendees',
    {
      schema: {
        summary: 'Register an attendee',
        tags: ['attendees'],
        body: z.object({
          name: z.string().min(4),
          email: z.string().email()
        }),
        params: z.object({
          eventId: z.string().uuid()
        }),
        response: {
          201: z.object({
            attendeesId: z.number()
          })
        }
      }
    },
    async (req, reply) => {
      const { email, name } = req.body
      const { eventId } = req.params

      const [event, attendeeFromEmail] = await Promise.all([
        db.event.findUnique({
          where: {
            id: eventId
          }
        }),
        db.attendee.findUnique({
          where: {
            eventId_email: {
              eventId,
              email
            }
          }
        })
      ])

      if (attendeeFromEmail != null) {
        throw new Error('Email ja registrado para este evento.')
      }

      const amountOfAttendeesForEvent = await db.attendee.count({
        where: {
          eventId
        }
      })

      if (
        event?.maximumAttendees &&
        amountOfAttendeesForEvent >= event?.maximumAttendees
      ) {
        throw new BadRequest(
          'Numero máximo de participantes registrado para este evento ja alcançado'
        )
      }
      const attendee = await db.attendee.create({
        data: {
          name,
          email,
          eventId
        }
      })

      return reply.status(201).send({ attendeesId: attendee.id })
    }
  )
}
