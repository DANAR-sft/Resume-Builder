import { app } from "./app";

const PORT = Number(process.env.PUBLIC_BASE_URL ?? 5000);
app.listen(PORT, () => console.log(`API running: http://localhost:${PORT}`));
