const express = require('express');
require('dotenv').config()
const axios = require('axios');
const app = express();
const PORT = 3000;

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Guest';
    const clientIp = req.ip;
    
    // Get the location based on IP address
    try {
        // get city, long and lat using IP address
        const locationResponse = await axios.get(`https://ipapi.co/${clientIp}/json/`);
        const city = locationResponse.data.city || 'Unknown location';
        const longitude = locationResponse.data.longitude
        const latitude = locationResponse.data.latitude
        // get weather information using long and lat
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=-${longitude}&appid=${process.env.WEATHER_KEY}&units=metric`)
        const temperature = weatherResponse.data.main.temp;
        
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