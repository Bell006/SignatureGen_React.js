import axios from "axios";

export const api = axios.create({
    baseURL: "https://signaturegen-flask.onrender.com"
})