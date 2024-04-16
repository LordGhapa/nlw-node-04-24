import {
  BadRequest
} from "./chunk-K352R5CC.mjs";
import {
  db
} from "./chunk-QBI5SRMV.mjs";

// api/src/routes/get-attendee-badge.ts
import { z } from "zod";
async function getAttendeeBadge(app) {
  app.withTypeProvider().get(
    "/attendees/:attendeeId/badge",
    {
      schema: {
        summary: "Get an attendee badge",
        tags: ["attendees"],
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
      const { attendeeId } = req.params;
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
      });
      if (attendee === null) {
        throw new BadRequest("Participante n\xE3o encontrado");
      }
      const baseUrl = `${req.protocol}://${req.hostname}`;
      const checkInUrl = new URL(`/attendee/${attendeeId}/check-in`, baseUrl);
      return reply.send({
        badge: {
          name: attendee.name,
          email: attendee.email,
          eventTitle: attendee.event.title,
          checkInUrl: checkInUrl.toString()
        }
      });
    }
  );
}

export {
  getAttendeeBadge
};
