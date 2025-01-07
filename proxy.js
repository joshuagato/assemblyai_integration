import express from 'express';
import axios from 'axios';
import cors from 'cors';
const app = express();

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

app.post('/proxy', async (req, res) => {
    try {
        const response = await axios.post('https://api.assemblyai.com/v2/realtime/token', {
            "expires_in": 480
        }, {
            headers: {
                Authorization: '21f5f08bb661498d8f74b2fa53e82ab1',
                'Content-Type': 'application/json',
            },
        });
        return res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Proxy server running on http://localhost:3000'));
