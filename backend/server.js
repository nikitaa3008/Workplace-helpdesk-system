const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/ping',(req,res)=>res.json({ok:true}));
app.listen(3000, ()=>console.log('Server running at http://localhost:3000'));