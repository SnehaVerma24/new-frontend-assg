import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { CropVariety } from '../types';

const app = express();
app.use(cors());
app.use(express.json());

// Mock data
let varieties: CropVariety[] = [
  {
    id: '1',
    cropName: 'Lettuce',
    varietyName: 'Butterhead',
    expectedYield: 25,
    estimatedHarvestDate: '2024-04-30',
    healthRating: 4
  },
  {
    id: '2',
    cropName: 'Tomato',
    varietyName: 'Cherry',
    expectedYield: 30,
    estimatedHarvestDate: '2024-05-15',
    healthRating: 5
  }
];

// Get all varieties
app.get('/api/varieties', (req, res) => {
  res.json(varieties);
});

// Get a single variety
app.get('/api/varieties/:id', (req, res) => {
  const variety = varieties.find(v => v.id === req.params.id);
  if (!variety) {
    return res.status(404).json({ message: 'Variety not found' });
  }
  res.json(variety);
});

// Create a new variety
app.post('/api/varieties', (req, res) => {
  const newVariety: CropVariety = {
    id: uuidv4(),
    ...req.body
  };
  varieties.push(newVariety);
  res.status(201).json(newVariety);
});

// Update a variety
app.put('/api/varieties/:id', (req, res) => {
  const index = varieties.findIndex(v => v.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Variety not found' });
  }
  varieties[index] = { ...varieties[index], ...req.body };
  res.json(varieties[index]);
});

// Delete a variety
app.delete('/api/varieties/:id', (req, res) => {
  const index = varieties.findIndex(v => v.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Variety not found' });
  }
  varieties = varieties.filter(v => v.id !== req.params.id);
  res.status(204).send();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 