import { serve } from "bun";
import index from "./index.html";
import { networkInterfaces } from "node:os";
import QRCode from "qrcode";

const server = serve({
  hostname: "0.0.0.0", // Bind to all network interfaces
  port: 3000, // Specify a port (you can change this if needed)
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },

    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);

// Generate QR code for mobile access
const localIP = Object.values(networkInterfaces()).flat().find(ni => ni?.family === 'IPv4' && !ni?.internal)?.address || 'localhost';
const mobileURL = `http://${localIP}:3000`;

console.log(`📱 Access from phone: ${mobileURL}`);

// Generate and display QR code
try {
  const qrCodeString = await QRCode.toString(mobileURL, {
    type: 'terminal',
    small: true,
    margin: 1
  });
  console.log(`\n📱 Scan this QR code to access the app on your phone:\n${qrCodeString}`);
} catch (error) {
  console.error('Failed to generate QR code:', error);
}
