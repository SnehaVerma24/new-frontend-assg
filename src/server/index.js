const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());


let varieties = [
  {
    id: uuidv4(),
    cropName: 'Lettuce',
    varietyName: 'Butterhead',
    expectedYield: 85,
    sowingDate: '2024-03-01',
    expectedHarvestDays: 60,
    estimatedHarvestDate: '2024-04-30',
    healthRating: 4
  },
  {
    id: uuidv4(),
    cropName: 'Tomato',
    varietyName: 'Cherry',
    expectedYield: 92,
    sowingDate: '2024-03-15',
    expectedHarvestDays: 75,
    estimatedHarvestDate: '2024-05-29',
    healthRating: 5
  },
  {
    id: uuidv4(),
    cropName: 'Spinach',
    varietyName: 'Bloomsdale',
    expectedYield: 78,
    sowingDate: '2024-03-10',
    expectedHarvestDays: 45,
    estimatedHarvestDate: '2024-04-24',
    healthRating: 3
  }
];

// GET all varieties
app.get('/api/varieties', (req, res) => {
  res.json(varieties);
});

// GET variety by ID
app.get('/api/varieties/:id', (req, res) => {
  const variety = varieties.find(v => v.id === req.params.id);
  if (!variety) {
    return res.status(404).json({ error: 'Variety not found' });
  }
  res.json(variety);
});

// POST new variety
app.post('/api/varieties', (req, res) => {
  const newVariety = {
    id: uuidv4(),
    ...req.body
  };
  varieties.push(newVariety);
  res.status(201).json(newVariety);
});

// PATCH update variety
app.patch('/api/varieties/:id', (req, res) => {
  const index = varieties.findIndex(v => v.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Variety not found' });
  }
  varieties[index] = {
    ...varieties[index],
    ...req.body
  };
  res.json(varieties[index]);
});

// DELETE variety
app.delete('/api/varieties/:id', (req, res) => {
  const index = varieties.findIndex(v => v.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Variety not found' });
  }
  varieties = varieties.filter(v => v.id !== req.params.id);
  res.status(200).json({ message: 'Variety deleted successfully' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
}); 