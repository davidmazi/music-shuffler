import { serve } from "bun";
import index from "./index.html";
import { networkInterfaces } from "node:os";

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
console.log(`📱 Access from phone: http://${Object.values(networkInterfaces()).flat().find(ni => ni?.family === 'IPv4' && !ni?.internal)?.address || 'localhost'}:3000`);
