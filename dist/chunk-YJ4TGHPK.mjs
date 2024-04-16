import {
  BadRequest
} from "./chunk-K352R5CC.mjs";
import {
  db
} from "./chunk-QBI5SRMV.mjs";

// api/src/routes/check-in.ts
import { z } from "zod";
async function checkIn(app) {
  app.withTypeProvider().get(
    "/attendees/:attendeeId/check-in",
    {
      schema: {
        summary: "Check-in an attendee",
        tags: ["check-ins"],
        params: z.object({
          attendeeId: z.coerce.number().int()
        }),
        response: {
          201: z.null()
        }
      }
    },
    async (req, reply) => {
      const { attendeeId } = req.params;
      const attendeeCheckIn = await db.checkIn.findUnique({
        where: {
          attendeeId
        }
      });
      if (attendeeCheckIn !== null) {
        throw new BadRequest("Participante ja fez check in");
      }
      await db.checkIn.create({
        data: {
          attendeeId
        }
      });
      return reply.status(201).send();
    }
  );
}

export {
  checkIn
};
