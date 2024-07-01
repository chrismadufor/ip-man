const express = require('express');
require('dotenv').config()
const axios = require('axios');
const app = express();
const PORT = 3000;

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Guest';
    // Get IP address
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    try {
        // get city, long and lat using IP address
        const locationResponse = await axios.get(`https://ipapi.co/102.88.36.188/json/`);
        const city = locationResponse.data.city || 'Unknown location';
        const longitude = locationResponse.data.longitude
        const latitude = locationResponse.data.latitude

        // get weather information using long and lat
        const weatherResponse = await axios.get(`https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_KEY}&q=${latitude + "," + longitude}`)
        const temperature = weatherResponse.data.current.temp_c;
        
        const response = {
            client_ip: clientIp,
            location: city,
            greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celcius in ${city}`,
        };
        
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch location data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});