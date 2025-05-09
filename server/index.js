import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import { z } from 'zod';

const prisma = new PrismaClient();
const fastify = Fastify({ logger: true });

// Enable CORS
await fastify.register(cors, {
  origin: true,
});

// Schemas for validation
const createNoteSchema = z.object({
  text: z.string().min(1, "Note text cannot be empty"),
});

const updateNoteSchema = z.object({
  text: z.string().min(1, "Note text cannot be empty"),
});

// Routes
fastify.get('/api/notes', async (request, reply) => {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return notes;
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: 'Failed to retrieve notes' });
  }
});

fastify.get('/api/:signature/:textID', async (request, reply) => {
  const { signature, textID } = request.params;
  
  try {
    const note = await prisma.note.findUnique({
      where: { textID },
    });
    
    if (!note) {
      return reply.status(404).send({ error: 'Note not found' });
    }
    
    return note;
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: 'Failed to retrieve note' });
  }
});

fastify.post('/api/:signature', async (request, reply) => {
  const { signature } = request.params;
  
  if (!signature || signature.trim() === '') {
    return reply.status(400).send({ error: 'Signature is required' });
  }
  
  try {
    const result = createNoteSchema.safeParse(request.body);
    
    if (!result.success) {
      return reply.status(400).send({ error: result.error.format() });
    }
    
    const { text } = result.data;
    const textID = nanoid(10);
    
    const note = await prisma.note.create({
      data: {
        textID,
        signature,
        text,
      },
    });
    
    return note;
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: 'Failed to create note' });
  }
});

fastify.put('/api/:signature/:textID', async (request, reply) => {
  const { signature, textID } = request.params;
  
  try {
    const existingNote = await prisma.note.findUnique({
      where: { textID },
    });
    
    if (!existingNote) {
      return reply.status(404).send({ error: 'Note not found' });
    }
    
    if (existingNote.signature !== signature) {
      return reply.status(403).send({ error: 'Unauthorized: Signature does not match' });
    }
    
    const result = updateNoteSchema.safeParse(request.body);
    
    if (!result.success) {
      return reply.status(400).send({ error: result.error.format() });
    }
    
    const { text } = result.data;
    
    const updatedNote = await prisma.note.update({
      where: { textID },
      data: { text },
    });
    
    return updatedNote;
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: 'Failed to update note' });
  }
});

fastify.delete('/api/:signature/:textID', async (request, reply) => {
  const { signature, textID } = request.params;
  
  try {
    const existingNote = await prisma.note.findUnique({
      where: { textID },
    });
    
    if (!existingNote) {
      return reply.status(404).send({ error: 'Note not found' });
    }
    
    if (existingNote.signature !== signature) {
      return reply.status(403).send({ error: 'Unauthorized: Signature does not match' });
    }
    
    await prisma.note.delete({
      where: { textID },
    });
    
    return { success: true };
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: 'Failed to delete note' });
  }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server is running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();