// resources/js/bootstrap.js
// Minimal bootstrap entry for Vite + Inertia setup
import "bootstrap/dist/js/bootstrap.bundle";

import axios from "axios";

window.axios = axios;
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

// You can add other global setup here (Echo, Alpine, etc.) if needed
