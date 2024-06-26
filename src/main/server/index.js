// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const users = require("./users.js");
const invoices = require("./invoices.js");
const trash = require("./trash.js");
const other = require("./other.js");
const sending = require("./sending.js");

// Create an Express application
const app = express();
app.use(cors());

// Middleware ( AI-Generated )
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../../../Front_end")));

app.use((req, res, next) => {
    console.log(`
    ${req.method} 
    ${req.url} 
    ${req.ip}
    ${res.statusCode}`);
    console.log(req.body);
    next();
});

// Root URL
app.get("/", (req, res) => {
    res.send(`
    <p>Welcome to SENG2021 24T1 W09A_ANEMONE's root directory!</p>
    <p>Click <a href="/user">here</a> to get started.</p>
  `);
});

app.get("/v1", (req, res) => {
    res.send(`
    <p>Welcome to SENG2021 24T1 W09A_ANEMONE!</p>
    <p>This is an old version of our frontend page, please do not use this anymore.</p>
    <p>Go back to <a href="/">root directory</a></p>
  `);
});

app.get("/v2", (req, res) => {
    res.send(`
    <p>Welcome to SENG2021 24T1 W09A_ANEMONE!</p>
    <p>Looks like you shouldn't be here...</a></p>
    <p>Go back to <a href="/">root directory</a></p>
  `);
});

app.get("/main", (req, res) => {
    const filePath = path.join(__dirname, "../../../Front_end/main.html");
    res.sendFile(filePath);
});

// User registration form (route)
app.get("/user", (req, res) => {
    const filePath = path.join(__dirname, "../../../Front_end/Register.html");
    res.sendFile(filePath);
});

// Register a user
app.post("/users", (req, res) => {
    const { username, email, password } = req.body,
        response = users.registerUser(username, email, password);
    console.log(response);
    return res.status(response.code).json(response.ret);
});

// Define a route for page 2
app.get("/users/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../../../Front_end/Login.html"));
});

// Login user
app.post("/users/login", (req, res) => {
    const { username, password } = req.body,
        response = users.loginUser(username, password);
    console.log(response);
    return res.status(response.code).json(response.ret);
});

// Upload invoice
app.post("/invoices", (req, res) => {
    const { invoice } = req.body,
        {token} = req.headers,
        response = invoices.uploadFile(invoice, token);
    return res.status(response.code).json(response.ret);
});

// Retrieve invoice
app.get("/invoices/:invoiceId", (req, res) => {
    const { invoiceId } = req.params,
        {token} = req.headers,
        response = invoices.retrieveFile(invoiceId, token);
    return res.status(response.code).json(response.ret);
});

// Filter invoice
app.get("/invoices/search/:filteredWord", (req, res) => {
    const { filteredWord } = req.params,
        { token } = req.headers,
        response = invoices.filterInvoice(token, filteredWord);
    return res.status(response.code).json(response.ret);
});

// Invoice list
app.get("/invoices", (req, res) => {
    const token = req.headers.token;
    const response = invoices.fileList(token);
    return res.status(response.code).json(response.ret);
});

// Move Invoice to trash
app.delete("/invoices/:invoiceId", (req, res) => {
    const { invoiceId } = req.params;
    const token = req.headers.token;
    const response = invoices.moveInvoiceToTrash(invoiceId, token);
    return res.status(response.code).json(response.ret);
});

// Modify invoice
app.put("/invoices/:invoiceId", (req, res) => {
    const { invoiceId } = req.params;
    const { newName, newAmount, newDate } = req.body;
    const token = req.headers.token;
    const response = invoices.modifyFile(invoiceId, token, newName, newAmount, newDate);
    return res.status(response.code).json(response.ret);
});

// List trash items
app.get("/trash", (req, res) => {
    const token = req.headers.token;
    const response = trash.listTrashItems(token);
    return res.status(response.code).json(response.ret);
});

// Delete from trash
app.delete("/trash/:invoiceId", (req, res) => {
    const { invoiceId } = req.params;
    const token = req.headers.token;
    const response = trash.deleteTrash(invoiceId, token);
    return res.status(response.code).json(response.ret);

});

// Restore from trash
app.post("/trash/:invoiceId/restore", (req, res) => {
    const { invoiceId } = req.params;
    const token = req.headers.token;
    const response = trash.restoreTrash(invoiceId, token);
    return res.status(response.code).json(response.ret);
});

// Clear function for testing purposes
app.delete("/clear", (req, res) => {
    const response = other.clear();
    return res.status(response.code).json(response.ret);
});

/*
 * Add more endpoints here
 */

///////////////////////////////////////////////////////////////////////////////
//////////////////////////// ADD SQL ROUTES HERE //////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// Register a user
app.post("/usersV2", async (req, res) => {
    const { username, email, password } = req.body,
        response = await users.registerUserV2(username, email, password);
    return res.status(response.code).json(response.ret);
});

// Login user
app.post("/usersV2/login", async (req, res) => {
    const { username, password } = req.body,
        response = await users.loginUserV2(username, password);
    return res.status(response.code).json(response.ret);
});

// Logout user
app.post("/usersV2/logout", async (req, res) => {
    const {token} = req.headers;
    const response = await users.logoutUser(token);
    return res.status(response.code).json(response.ret);
});

// Upload invoice
app.post("/invoicesV2", async (req, res) => {
    const { invoice } = req.body,
        {token} = req.headers,
        response = await invoices.uploadFileV2(invoice, token);
    console.log(response);
    return res.status(response.code).json(response.ret);
});

// Retrieve invoice
app.get("/invoicesV2/:invoiceId", async (req, res) => {
    const { invoiceId } = req.params,
        {token} = req.headers,
        response = await invoices.retrieveFileV2(invoiceId, token);
    return res.status(response.code).json(response.ret);
});

// Invoice list
app.get("/invoicesV2", async (req, res) => {
    const token = req.headers.token;
    const response = await invoices.fileListV2(token);
    return res.status(response.code).json(response.ret);
});

// Move Invoice to trash
app.delete("/invoicesV2/:invoiceId", async (req, res) => {
    const { invoiceId } = req.params;
    const token = req.headers.token;
    const response = await invoices.moveInvoiceToTrashV2(invoiceId, token);
    return res.status(response.code).json(response.ret);
});

// Modify invoice
app.put("/invoicesV2/:invoiceId", async (req, res) => {
    const { invoiceId } = req.params;
    const { newName, newAmount, newDate } = req.body;
    const token = req.headers.token;
    const response = await invoices.modifyFileV2(invoiceId, token, newName, newAmount, newDate);
    return res.status(response.code).json(response.ret);
});

// Filter invoice
app.get("/invoicesV2/search/:filteredWord", async (req, res) => {
    const { filteredWord } = req.params,
        { token } = req.headers,
        response = await invoices.filterInvoiceV2(token, filteredWord);
    return res.status(response.code).json(response.ret);
});

// List trash items
app.get("/trashV2", async (req, res) => {
    const token = req.headers.token;
    const response = await trash.listTrashItemsV2(token);
    return res.status(response.code).json(response.ret);
});

// Delete from trash
app.delete("/trashV2/:invoiceId", async (req, res) => {
    const { invoiceId } = req.params;
    const token = req.headers.token;
    const response = await trash.deleteTrashV2(invoiceId, token);
    return res.status(response.code).json(response.ret);
});

// Restore from trash
app.post("/trashV2/:invoiceId/restore", async (req, res) => {
    const { invoiceId } = req.params;
    const token = req.headers.token;
    const response = await trash.restoreTrashV2(invoiceId, token);
    return res.status(response.code).json(response.ret);
});

// Trashing the batch from invoices
app.delete("/invoices/:invoiceIds/trash", async (req, res) => {
    const { invoiceIds } = req.params;
    const token = req.headers.token;
    const response = await invoices.moveInvoicesToTrash(invoiceIds, token);
    return res.status(response.code).json(response.ret);
});

// Deleting the batch from trash
app.delete("/trash/:invoiceIds/delete", async (req, res) => {
    const { invoiceIds } = req.params;
    const token = req.headers.token;
    const response = await trash.deleteTrashes(invoiceIds, token);
    return res.status(response.code).json(response.ret);
});

// Restore from the batch from trash
app.post("/trash/:invoiceIds/batch/restore", async (req, res) => {
    const { invoiceIds } = req.params;
    const token = req.headers.token;
    const response = await trash.restoreTrashes(invoiceIds, token);
    return res.status(response.code).json(response.ret);
});

// Sending Invoice API Integration
app.post("/invoicesV2/:invoiceId/send", async (req, res) => {
    const { invoiceId } = req.params;
    const { recipient } = req.body;
    const token = req.headers.token;
    const response = await sending.invoiceSending(token, recipient, invoiceId);
    return res.status(response.code).json(response.ret);
});

// Clear function for testing purposes
app.delete("/clearV2", async (req, res) => {
    const response = await other.clearV2();
    return res.status(response.code).json(response.ret);
});

// Start the Express server and listen on port 3000
const PORT = process.env.PORT || 3103,
    server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

module.exports = server;
