
const validUsername1 = "validUsername1",
    validEmail1 = "test123@gmail.com",
    validPassword1 = "ThisIsSecure!123",

    mockInvoice1 = { file: { amount: 125.45 } };

const request = require("supertest");
const assert = require("assert");
const app = require("../main/server");
const server = require("../main/server"), 

    invalid_token = 0;

describe("Retrieve system tests V2", function() {
    it("tests for Retrieving Invoices", async function() {
        // Setup user and login process
        await request(app)
            .delete("/clear")
            .expect(200)
            .expect("Content-Type", /application\/json/)
            .expect({"success": true});

        await request(app)
            .post("/users")
            .send({ username: validUsername1, email: validEmail1, password: validPassword1 })
            .expect(200)
            .expect("Content-Type", /application\/json/)
            .expect({"success": true});
        

        const user1 = await request(app)
            .post("/users/login")
            .send({ username: validUsername1, password: validPassword1 })
            .expect(200)
            .expect("Content-Type", /application\/json/);

        // Using assert to check for each type
        assert.strictEqual(user1.body.success, true);
        assert.strictEqual(typeof user1.body.token, "string");

        //Invalid token
        await request(app)
            .post("/invoices")
            .set("token", invalid_token)
            .expect(401)
            .expect("Content-Type", /application\/json/)
            .expect({"success": false, "error": "Token is empty or invalid"});        
        

        // Successful upload
        const invoice1 = await request(app)
            .post("/invoices")
            .set("token", user1.body.token)
            .send({ invoice: mockInvoice1 })
            .expect(200);

        assert.strictEqual(invoice1.body.success, true);
        assert.strictEqual(typeof invoice1.body.invoiceId, "number");




    });
});

server.close();