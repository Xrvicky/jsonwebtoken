require('dotenv').config()
const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const jwt=require('jsonwebtoken');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

const users=require('./user.json');
const cars=require('./cars.json');

app.post('/login',(req,res)=>{

    const user = users.find((usr)=>usr.username === req.body.username);

    console.log("welcome")
    console.log(user);

    if(user)
    {
        if(user.password === req.body.password)
        {
            const token=jwt.sign({userID:user.id},process.env.Secret_access_key, { expiresIn: '100s' });
            res.status(200).send({token:token});
        }
        else
        {
        res.status(401).send({message:" password worng Access Denied"});
        }
    }
    else
    {
        res.status(401).send({message:"Access Denied"});
    }

})

function checktoken(req,res,next){

    let token = req.headers["authorization"];

    if(token)
    {
        jwt.verify(token,process.env.Secret_access_key,(err,decoded)=>{

            if(err)
            {
                console.log(err);
                res.status(401).send({message:"access denied"});
            }
            else
            {
                req.userID = decoded.userID;
                next();
            }

        })
    }
    else
    {
        res.status(401).send({message:"token is not there access denied"});
    }

}


app.get('/data',checktoken,(req,res)=>{

    const filtered=cars.filter((car)=>car.userID === req.userID);
    res.status(200).send({data:filtered});

})


app.listen(3000,()=>{console.log("i am working")})