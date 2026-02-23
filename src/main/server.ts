import { app } from "./app";

const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, "0.0.0.0", () => {
    console.log(`API running on port: ${PORT}`);
    console.log(`Access it via: ${process.env.PUBLIC_BASE_URL}`);
});