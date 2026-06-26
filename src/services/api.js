// src/services/api.js

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4000';

export async function checkApiStatus() {
    try {
        // Make the HTTP GET request
        const response = await fetch(`${API_BASE_URL}/api`);

        // Handle HTTP errors (e.g., 404 or 500)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the response. 
        const data = await response.json();
        return data;

    } catch (error) {
        // Centralized error logging
        console.error("Failed to fetch API:", error);
        throw error;
    }
}