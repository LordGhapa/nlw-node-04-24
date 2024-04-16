import {
  BadRequest
} from "./chunk-K352R5CC.mjs";
import {
  db
} from "./chunk-QBI5SRMV.mjs";

// api/src/routes/register-for-event.ts
import { z } from "zod";
async function registerForEvent(app) {
  app.withTypeProvider().post(
    "/events/:eventId/attendees",
    {
      schema: {
        summary: "Register an attendee",
        tags: ["attendees"],
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
      const { email, name } = req.body;
      const { eventId } = req.params;
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
      ]);
      if (attendeeFromEmail != null) {
        throw new Error("Email ja registrado para este evento.");
      }
      const amountOfAttendeesForEvent = await db.attendee.count({
        where: {
          eventId
        }
      });
      if (event?.maximumAttendees && amountOfAttendeesForEvent >= event?.maximumAttendees) {
        throw new BadRequest(
          "Numero m\xE1ximo de participantes registrado para este evento ja alcan\xE7ado"
        );
      }
      const attendee = await db.attendee.create({
        data: {
          name,
          email,
          eventId
        }
      });
      return reply.status(201).send({ attendeesId: attendee.id });
    }
  );
}

export {
  registerForEvent
};
