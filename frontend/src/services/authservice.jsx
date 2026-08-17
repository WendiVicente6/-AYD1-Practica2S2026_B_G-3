import {API_URL} from "../api/compartir.js";

export async function login(email, password) {

    const response = await fetch(
        `${API_URL}/auth/login`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify({
                email,
                password
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(
            data.message ||
            "No fue posible iniciar sesión."
        );
    }

    return data;
}


export async function logout() {

    const response = await fetch(
        `${API_URL}/auth/logout`,
        {
            method: "POST",

            credentials: "include"
        }
    );

    return response.json();
}


export async function getCurrentUser() {

    const response = await fetch(
        `${API_URL}/auth/me`,
        {
            method: "GET",

            credentials: "include"
        }
    );

    if (!response.ok) {

        return null;
    }

    return response.json();
}