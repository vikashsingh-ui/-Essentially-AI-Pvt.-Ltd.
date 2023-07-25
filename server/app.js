// DO NOT MODIFY ANYTHING HERE, THE PLACE WHERE YOU NEED TO WRITE CODE IS MARKED CLEARLY BELOW

require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();

app.use(function (req, res, next) {
    const allowedOrigins = ['http://localhost:3000'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.enable('trust proxy');

app.post('/api/fetchStockData', async (req, res) => {
    // YOUR CODE GOES HERE, PLEASE DO NOT EDIT ANYTHING OUTSIDE THIS FUNCTION
    try {
        const { symbol, date } = req.body;
    
        if (!symbol || !date) {
          return res.status(400).json({ error: 'Symbol and date are required' });
        }
    
        const polygonApiKey = process.env.POLYGON_API_KEY; // API key should be in .env file the environment variable
        if (!polygonApiKey) {
          return res.status(500).json({ error: 'Polygon API key is missing' });
        }
       
        // Make a request to the Polygon API with the symbol and date parameters
        const response = await axios.get(`https://api.polygon.io/v1/open-close/${symbol}/${date}?adjusted=true&apiKey=${polygonApiKey}`);
      
        // Extract the required fields from the response
        const { open, high, low, close, volume } = response.data;
    
        // Send the required fields in the response
        res.json({ open, high, low, close, volume });
      } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).json({ error: 'Unable to fetch stock data' });
      }
    // res.sendStatus(200);
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));