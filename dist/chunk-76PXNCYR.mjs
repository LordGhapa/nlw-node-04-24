import {
  generateSlug
} from "./chunk-5EMXPJ5T.mjs";
import {
  BadRequest
} from "./chunk-K352R5CC.mjs";
import {
  db
} from "./chunk-QBI5SRMV.mjs";

// api/src/routes/create-event.ts
import z from "zod";
async function createEvent(app) {
  app.withTypeProvider().post(
    "/events",
    {
      schema: {
        summary: "Create an event",
        tags: ["events"],
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
      const { details, maximumAttendees, title } = req.body;
      const slug = generateSlug(title);
      const eventWithSameSlug = await db.event.findUnique({
        where: {
          slug
        }
      });
      if (eventWithSameSlug != null) {
        throw new BadRequest("outro evento com mesmo Title ja existe");
      }
      const event = await db.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug
        }
      });
      return reply.status(201).send({ eventId: event.id });
    }
  );
}

export {
  createEvent
};
