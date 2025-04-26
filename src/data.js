import axios from 'axios';

async function getProducts() {
    try {
        const response = await axios.get('https://65fb15ce14650eb210094d0f.mockapi.io/api/carmen/Products');
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

export { getProducts };