const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { body, validationResult } = require('express-validator');
const winston = require('winston');
const asyncHandler = require('express-async-handler');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const sampleData = {
  items: [
    { id: '1', name: 'Elegant Chair', description: 'Comfortable and stylish chair', createdAt: new Date().toISOString() },
    { id: '2', name: 'Modern Desk', description: 'Spacious and functional work desk', createdAt: new Date().toISOString() },
    { id: '3', name: 'Cozy Rug', description: 'Soft and warm rug for your living room', createdAt: new Date().toISOString() },
    { id: '4', name: 'Stylish Lamp', description: 'Modern and elegant table lamp', createdAt: new Date().toISOString() },
    { id: '5', name: 'Comfortable Sofa', description: 'Relaxing and spacious sofa', createdAt: new Date().toISOString() },
  ],
};

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

app.use(cors());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(helmet());
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(bodyParser.json());
app.use(compression());
app.use(cookieParser());

/**
 * @description Health check endpoint.
 * @route GET /health
 */
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});


/**
 * @description Create a new item or multiple items.
 * @route POST /items
 */
app.post('/items', asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let newItem;
  if (Array.isArray(req.body)) {
    newItem = req.body.map((item) => ({ ...item, id: Date.now().toString(), createdAt: new Date().toISOString() }));
  } else {
    newItem = [{ ...req.body, id: Date.now().toString(), createdAt: new Date().toISOString() }];
  }
  sampleData.items.push(...newItem);
  res.status(201).json(newItem);
}));

/**
 * @description Get all items.
 * @route GET /items
 */
app.get('/items', (req, res) => {
  res.json(sampleData.items);
});

/**
 * @description Get a single item by ID.
 * @route GET /items/:id
 */
app.get('/items/:id', (req, res) => {
  const item = sampleData.items.find((item) => item.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  res.json(item);
});

/**
 * @description Update an item by ID.
 * @route PUT /items/:id
 */
app.put('/items/:id', asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const index = sampleData.items.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }
  sampleData.items[index] = { ...sampleData.items[index], ...req.body, createdAt: new Date().toISOString() };
  res.json(sampleData.items[index]);
}));

/**
 * @description Delete an item by ID.
 * @route DELETE /items/:id
 */
app.delete('/items/:id', (req, res) => {
  const index = sampleData.items.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }
  sampleData.items.splice(index, 1);
  res.status(204).send();
});

/**
 * @description Delete multiple items by IDs.
 * @route DELETE /items
 */
app.delete('/items', (req, res) => {
  if (!Array.isArray(req.body) || req.body.length === 0) {
    return res.status(400).json({ message: 'Invalid request body' });
  }
  const idsToDelete = req.body;
  sampleData.items = sampleData.items.filter((item) => !idsToDelete.includes(item.id));
  res.status(204).send();
});

/**
 * @description Centralized error handling middleware.
 */
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});


app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
});