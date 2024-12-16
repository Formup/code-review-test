import fastify from "fastify";

const server = fastify({ logger: true });

server.get('/', async function (request, reply) {
    return { hello: 'world' }
});

try {
    await server.listen({ port: 3000 });
} catch (err) {
    server.log.error(err);
    process.exit(1);
}