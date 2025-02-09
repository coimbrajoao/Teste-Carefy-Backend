const request = require('supertest');
const app = require('../app');

describe('GET /logs', () => {
    const user = { username: 'admin', password: 'admin' };
    const authHeader = `Basic ${Buffer.from(`${user.username}:${user.password}`).toString('base64')}`;
    test("Deve retornar 200 se o usuário estiver autenticado", async () => {
        const response = await request(app)
            .get('/logs')
            .set('Authorization', authHeader);
    
        console.log("Status:", response.statusCode);
        console.log("Body:", response.body); 
    
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body.data)).toBe(true); 
    });
    

    test("Deve retornar 401 se o usuário não estiver autenticado", async () => {
        const response = await request(app).get('/logs');
        expect(response.statusCode).toBe(401);
    });
});
