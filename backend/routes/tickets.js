import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../lib/auth.js';
import { getPaginationParams, createPaginationResponse, buildWhereClause } from '../lib/pagination.js';

const router = express.Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

// GET /api/tickets/stats - Get ticket statistics (must come before /:id)
router.get('/stats', async (req, res) => {
  try {
    const stats = await prisma.ticket.groupBy({
      by: ['status'],
      where: { userId: req.user.id },
      _count: true
    });

    const priorityStats = await prisma.ticket.groupBy({
      by: ['priority'],
      where: { userId: req.user.id },
      _count: true
    });

    const typeStats = await prisma.ticket.groupBy({
      by: ['type'],
      where: { userId: req.user.id },
      _count: true
    });

    res.json({
      byStatus: stats,
      byPriority: priorityStats,
      byType: typeStats
    });
  } catch (error) {
    console.error('Get ticket stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/tickets - List tickets with pagination and search
router.get('/', async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { search, status, priority, type, projectId, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const where = {
      userId: req.user.id,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(type && { type }),
      ...(projectId && { projectId }),
      ...buildWhereClause(['title', 'description'], search)
    };

    const orderBy = { [sortBy]: sortOrder };

    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          project: {
            select: { id: true, title: true, client: { select: { name: true, company: true } } }
          }
        }
      }),
      prisma.ticket.count({ where })
    ]);

    res.json(createPaginationResponse(tickets, total, page, limit));
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/tickets/:id - Get single ticket
router.get('/:id', async (req, res) => {
  try {
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: {
        project: {
          include: {
            client: true
          }
        }
      }
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/tickets - Create ticket
router.post('/', [
  body('title').trim().isLength({ min: 2 }).withMessage('Title must be at least 2 characters'),
  body('description').optional().trim(),
  body('projectId').notEmpty().withMessage('Project ID is required'),
  body('status').optional().isIn(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  body('type').optional().isIn(['BUG', 'FEATURE', 'TASK', 'SUPPORT'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: req.body.projectId,
        userId: req.user.id
      }
    });

    if (!project) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const ticket = await prisma.ticket.create({
      data: {
        ...req.body,
        userId: req.user.id
      },
      include: {
        project: {
          select: { id: true, title: true, client: { select: { name: true, company: true } } }
        }
      }
    });

    res.status(201).json(ticket);
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/tickets/:id - Update ticket
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 2 }),
  body('description').optional().trim(),
  body('status').optional().isIn(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  body('type').optional().isIn(['BUG', 'FEATURE', 'TASK', 'SUPPORT'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingTicket = await prisma.ticket.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!existingTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const ticket = await prisma.ticket.update({
      where: { id: req.params.id },
      data: req.body,
      include: {
        project: {
          select: { id: true, title: true, client: { select: { name: true, company: true } } }
        }
      }
    });

    res.json(ticket);
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/tickets/:id - Delete ticket
router.delete('/:id', async (req, res) => {
  try {
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    await prisma.ticket.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Delete ticket error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;