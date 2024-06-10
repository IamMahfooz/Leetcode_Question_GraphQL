const express = require('express')
const app =express()
const cors = require('cors');
const utils = require("./utils/p-statement");

app.use(cors())
app.use(express.json())

app.get('/problem',(req, res)=>utils.getSubmissionCode(req,res));
app.listen(5000);

