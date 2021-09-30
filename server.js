const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());

require('dotenv').config()

const PORT = process.env.PORT || 5000;



app.use(express.json());

app.use(express.static('public'));

app.post('/send-email',(req,res) => {

    console.log(req.body.name);

    const transporter = nodemailer.createTransport({
        service:process.env.SERVICE,
        secure:true,
        auth: {
            user:process.env.EMAIL,
            pass:process.env.PASSWORD

        }
    })

    const mailOptions = {
        from:req.body.email,
        to:process.env.EMAIL,
        subject: `Virtus.ba - Contact form`,
        text:
        `${req.body.message} 
        \n Name: ${req.body.name}
        \n Contact: ${req.body.email}`

    }

    transporter.sendMail(mailOptions,(error,info) => {
        if(error)
        {
            console.log(error);
            res.send('error');
        }
        else
        {
            console.log("Email sent:" + info.response);
            res.send("Success");
        }
    })
})

app.listen(PORT,() => {
    console.log(`Server runing on port ${PORT}`)
})