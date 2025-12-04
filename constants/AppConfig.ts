// File: src/constants/AppConfig.ts

export enum AppMode {
  LAN = "LAN",
  TUNNEL = "TUNNEL",
}
// thay đổi AppMode tùy theo chế độ
const MODE: AppMode = AppMode.LAN as AppMode;

// LAN IP
const LAN_IP = "192.168.1.14"; // chạy ipconfig để biết ip address
const LAN_PORT = "8080";

// NGROK URL
const NGROK_URL = "https://uncomforted-malakai-unchartered.ngrok-free.dev";

// AUTO CONFIG
const BASE = MODE === AppMode.LAN ? `http://${LAN_IP}:${LAN_PORT}` : NGROK_URL;

export const AppConfig = {
  MODE,
  BASE_URL: `${BASE}/api/v1`,
  AVATAR_URL: `${BASE}/storage/images/avatar/`,
  PRODUCTS_URL: `${BASE}/storage/images/products/`,
  CERT_URL: `${BASE}/storage/images/certs/`,
  TIMEOUT: 30000,
};
