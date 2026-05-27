import axios from 'axios';
import constants from '../../constants';

// API Instance 

const API = axios.create({
    baseURL: `${constants.HOST}/articles`,
});

// Attach token to every request if present
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Article Endpoints 

export const fetchArticles = () => API.get('/');
export const createArticle = (article) => API.post('/', article);
export const updateArticle = (id, article) => API.put(`/${id}`, article);
export const deleteArticle = (id) => API.delete(`/${id}`);