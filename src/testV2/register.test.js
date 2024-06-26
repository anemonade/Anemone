const validUsername1 = "validUsername1";
const validUsername2 = "thisIsAValidName";
const validEmail1 = "test123@gmail.com";
const validEmail2 = "123test@gmail.com";
const invalidEmail1 = "invalidemail";
const validPassword1 = "ThisIsSecure!123";
const validPassword2 = "lessSecure2@";
const invalidPassword1 = "toosmall2@";
const invalidPassword2 = "TOOBIG2@";
const invalidPassword3 = "NoNumber@";
const invalidPassword4 = "NoSpecial2";
const invalidPassword5 = "Short2@";
const invalidUsername1 = "wowthisisasuperlongusername";
const invalidUsername2 = "name with space";

const request = require("supertest");
const app = require("../main/server");
const server = require("../main/server");

describe("Testing route POST /userV2", function() {
    beforeEach(async function() {
        // Clear data before running any tests
        await request(app)
            .delete("/clearV2")
            .expect(200)
            .expect("Content-Type", /application\/json/)
            .expect({"success": true});
    });

    it("Valid Input: Register a new user with valid username and password and valid return status", async function() {
        await request(app)
            .post("/usersV2")
            .send({ username: validUsername1, email: validEmail1, password: validPassword1 })
            .expect(200)
            .expect("Content-Type", /application\/json/)
            .expect({"success": true});

        await request(app)
            .post("/usersV2")
            .send({ username: validUsername2, email: validEmail2, password: validPassword2 })
            .expect(200)
            .expect("Content-Type", /application\/json/)
            .expect({"success": true});
    });

    it("Invalid Input: Username is not between 3-20 characters long", async function() {
        await request(app)
            .post("/usersV2")
            .send({ username: invalidUsername1, email: validEmail1, password: validPassword1 })
            .expect(400)
            .expect("Content-Type", /application\/json/)
            .expect({"success": false, "error": `Username '${invalidUsername1}' is not between 3-20 characters long`});
    });

    it("Invalid Input: Register a user with a username containing whitespace", async function() {
        await request(app)
            .post("/usersV2")
            .send({ username: invalidUsername2, email: validEmail1, password: validPassword1 })
            .expect(400)
            .expect("Content-Type", /application\/json/)
            .expect({"success": false, "error": `Username '${invalidUsername2}' contains a whitespace character`});
    });

    it("Invalid Input: Password does not contain at least 1 uppercase letter", async function() {
        await request(app)
            .post("/usersV2")
            .send({ username: validUsername1, email: validEmail1, password: invalidPassword1 })
            .expect(400)
            .expect("Content-Type", /application\/json/)
            .expect({"success": false, "error": "Password does not satisfy minimum requirements (at least 8 characters long, 1 lowercase letter, 1 uppercase letter, 1 special character and 1 number)"});
    });

    it("Invalid Input: Password does not contain at least 1 lower letter", async function() {
        await request(app)
            .post("/usersV2")
            .send({ username: validUsername1, email: validEmail1, password: invalidPassword2 })
            .expect(400)
            .expect("Content-Type", /application\/json/)
            .expect({"success": false, "error": "Password does not satisfy minimum requirements (at least 8 characters long, 1 lowercase letter, 1 uppercase letter, 1 special character and 1 number)"});
    });

    it("Invalid Input: Password does not contain at least 1 number", async function() {
        await request(app)
            .post("/usersV2")
            .send({ username: validUsername1, email: validEmail1, password: invalidPassword3 })
            .expect(400)
            .expect("Content-Type", /application\/json/)
            .expect({"success": false, "error": "Password does not satisfy minimum requirements (at least 8 characters long, 1 lowercase letter, 1 uppercase letter, 1 special character and 1 number)"});
    });

    it("Invalid Input: Password does not contain at least 1 special character", async function() {
        await request(app)
            .post("/usersV2")
            .send({ username: validUsername1, email: validEmail1, password: invalidPassword4 })
            .expect(400)
            .expect("Content-Type", /application\/json/)
            .expect({"success": false, "error": "Password does not satisfy minimum requirements (at least 8 characters long, 1 lowercase letter, 1 uppercase letter, 1 special character and 1 number)"});
    });

    it("Invalid Input: Password does not contain at least 8 characters", async function() {
        await request(app)
            .post("/usersV2")
            .send({ username: validUsername1, email: validEmail1, password: invalidPassword5 })
            .expect(400)
            .expect("Content-Type", /application\/json/)
            .expect({"success": false, "error": "Password does not satisfy minimum requirements (at least 8 characters long, 1 lowercase letter, 1 uppercase letter, 1 special character and 1 number)"});
    });

    it("Invalid Input: Email does not satisfy validation", async function() {
        await request(app)
            .post("/usersV2")
            .send({ username: validUsername1, email: invalidEmail1, password: validPassword1 })
            .expect(400)
            .expect("Content-Type", /application\/json/)
            .expect({"success": false, "error": `Email '${invalidEmail1}' is not a valid email address`});
    });

    it("Invalid Input: Username is currently used by another user", async function() {
        await request(app)
            .post("/usersV2")
            .send({ username: validUsername1, email: validEmail1, password: validPassword1 })
            .expect(200)
            .expect("Content-Type", /application\/json/)
            .expect({"success": true});

        await request(app)
            .post("/usersV2")
            .send({ username: validUsername1, email: validEmail2, password: validPassword1 })
            .expect(400)
            .expect("Content-Type", /application\/json/)
            .expect({"success": false, "error": `Username '${validUsername1}' was taken by another user`});
    });

    it("Invalid Input: Email is currently used by another user", async function() {
        await request(app)
            .post("/usersV2")
            .send({ username: validUsername1, email: validEmail1, password: validPassword1 })
            .expect(200)
            .expect("Content-Type", /application\/json/)
            .expect({"success": true});

        await request(app)
            .post("/usersV2")
            .send({ username: validUsername2, email: validEmail1, password: validPassword1 })
            .expect(400)
            .expect("Content-Type", /application\/json/)
            .expect({"success": false, "error": `Email '${validEmail1}' was taken by another user`});
    });
});

server.close();
