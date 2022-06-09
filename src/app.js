const express = require('express')
var bodyParser = require('body-parser')
var CryptoJS = require("crypto-js");
var cors = require('cors')
const app = express()
require("./db/conn")

const register = require('./models/registration.model')
const port =process.env.PORT || 3000
const key ="secret key 123"


var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })


app.use(bodyParser.json())
app.use(cors({ origin: '*' }));

// app.get('/',(req,res)=>{
//     res.send("llll")
// })


app.post('/register',(req,res)=>{// to register the user
    try{
        register.findOne({email:req.body.email}).then((eData)=>{
            if(eData === null){
                var encPass = CryptoJS.AES.encrypt(req.body.password, key).toString();
             
               let resgis = register({
                    firstName:req.body.firstName,
                    lastName:req.body.lastName,
                    email:req.body.email,
                    mobile:req.body.mobile,
                    password:encPass,
                })
                resgis.save().then((resData)=>{
                    res.status(200).json({ "message": "Success" ,data:resData})
                })
            }else{
                res.status(200).json({ "message": "Mail already registered"})
            }
        })
       

    }catch(e){
        console.log(e)
    }
})


app.post('/login',(req,res)=>{
            try {
                register.findOne({email:req.body.email}).then((eData)=>{

                    if(eData === null){
                        res.status(200).json({ "message": "Please enter correct mailID"})
                    }
                    else{
                            var bytes  = CryptoJS.AES.decrypt(eData.password, key);
                            var originalText = bytes.toString(CryptoJS.enc.Utf8);
                            if(eData === null){
                                res.status(200).json({ "message": "Please enter correct mailID"})
                            }
                            else{
                                
                                if(originalText === req.body.password){
                                    res.status(200).json({ "message": "Authentic User"})
                                }else{
                                    res.status(200).json({ "message": "Wrong password"})
                                }
                            }
                    }
                    
                }).catch(e => console.log(e))
            } catch (error) {
                console.log(error)
            }
})

app.post('/getUserByName',(req,res)=>{
    try {
        
        const agg = [
            {
              '$match': {
                'firstName': req.body.firstName
              }
            }
          ];
          register.aggregate(agg).then((rData)=>{
            res.status(200).json({ "message": "Success",data:rData})
          }).catch( e=> console.log(e))
    } catch (error) {
        console.log(error) 
    }
})

app.get('/getSortedUsers',(req,res)=>{
        try {// alphabetical sort ascending 
            register.find().sort({firstName:1}).then((sData)=>{
                    res.send(sData)
            }).catch(e => console.log(e))
        } catch (error) {
          console.log(error)  
        }
})
app.listen(port,()=>{
    console.log(`server listening on port ${port}`)
})