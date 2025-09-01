import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../lib/auth.js';
import { getPaginationParams, createPaginationResponse, buildWhereClause } from '../lib/pagination.js';

const router = express.Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

// GET /api/projects - List projects with pagination and search
router.get('/', async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { search, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const where = {
      userId: req.user.id,
      ...(status && { status }),
      ...buildWhereClause(['title', 'description'], search)
    };

    const orderBy = { [sortBy]: sortOrder };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          client: {
            select: { id: true, name: true, company: true }
          },
          tickets: {
            select: { id: true, status: true, priority: true }
          },
          _count: {
            select: { tickets: true }
          }
        }
      }),
      prisma.project.count({ where })
    ]);

    res.json(createPaginationResponse(projects, total, page, limit));
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/projects/:id - Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: {
        client: true,
        tickets: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST /api/projects - Create project
router.post('/', [
  body('title').trim().isLength({ min: 2 }).withMessage('Title must be at least 2 characters'),
  body('description').optional().trim(),
  body('clientId').notEmpty().withMessage('Client ID is required'),
  body('status').optional().isIn(['ACTIVE', 'COMPLETED', 'ON_HOLD', 'CANCELLED']),
  body('budget').optional().isFloat({ min: 0 }),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verify client belongs to user
    const client = await prisma.client.findFirst({
      where: {
        id: req.body.clientId,
        userId: req.user.id
      }
    });

    if (!client) {
      return res.status(400).json({ message: 'Invalid client ID' });
    }

    const project = await prisma.project.create({
      data: {
        ...req.body,
        userId: req.user.id,
        startDate: req.body.startDate ? new Date(req.body.startDate) : null,
        endDate: req.body.endDate ? new Date(req.body.endDate) : null
      },
      include: {
        client: {
          select: { id: true, name: true, company: true }
        }
      }
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 2 }),
  body('description').optional().trim(),
  body('status').optional().isIn(['ACTIVE', 'COMPLETED', 'ON_HOLD', 'CANCELLED']),
  body('budget').optional().isFloat({ min: 0 }),
  body('startDate').optional().isISO8601(),
  body('endDate').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingProject = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updateData = { ...req.body };
    if (req.body.startDate) updateData.startDate = new Date(req.body.startDate);
    if (req.body.endDate) updateData.endDate = new Date(req.body.endDate);

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: updateData,
      include: {
        client: {
          select: { id: true, name: true, company: true }
        }
      }
    });

    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await prisma.project.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;