export interface Session {
  lastUsed: string;
  id: string;
  createdAt: string;
  expiresAt: string;
  sourceIp: string;
  agent: string;
  geolocation: [number, number];
}
