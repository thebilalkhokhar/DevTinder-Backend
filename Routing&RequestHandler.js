const express = require('express');
const app = express();

app.get('/home', (req, res) => {
  res.send('Home Api Call'); // Basic route to test server
});
app.get('/user/:userId/:userName', (req, res) => {
    console.log(req.params); // Log the parameters to the console
    res.send('User GET Api Call'); // Basic route to test server
});
app.post('/user/:userId/:userName', (req, res) => {
    console.log(req.params); // Log the parameters to the console
    res.send('User POST Api Call'); // Basic route to test server
});
app.put('/user/:userId/:userName', (req, res) => {
    console.log(req.params); // Log the parameters to the console
    res.send('User PUT Api Call'); // Basic route to test server
});
app.delete('/user/:userId/:userName', (req, res) => {
    console.log(req.params); // Log the parameters to the console
    res.send('User Delete Api Call'); // Basic route to test server
});
app.get('/order', (req, res) => {
    console.log(req.query); // Log the query parameters to the console
  res.send('Order GET Api Call'); // Basic route to test server
});
app.get('/ab?c', (req, res) => {
  res.send('? API Call'); // Basic route to test server
});
app.get('/ab+c', (req, res) => {
  res.send('+ API Call'); // Basic route to test server
});
app.get('/ab*c', (req, res) => {
  res.send('* API Call'); // Basic route to test server
});
app.get('/a(bc)+d', (req, res) => {
  res.send('() API Call)'); // Basic route to test server
});
app.get('/a/', (req, res) => {
  res.send('Regex Api Call'); // Basic route to test server
});
app.get('/.*fly$/', (req, res) => {
  res.send('Url Ends with Fly word Api Call'); // Basic route to test server
});
app.get('/', (req, res) => {
  res.send('Hello World!'); // Basic route to test server
});

app.listen(7777, () => {
  console.log('Server is running on port 7777');
});