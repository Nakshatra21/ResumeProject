const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const validUsers = require('./public/js/valid-users');
const app = express();
const fs = require('fs');
const pdf  = require('pdfkit');       // have to install via npm  ---> npm i pdfkit // npm --save-dev pdfkit

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('views'));
app.use(express.static('public'));

app.get("/login", (req, res, next)=> {                          // completed
   return res.sendFile(path.join(__dirname,'views',"login.html"));
});

app.post("/validate", (req, res, next)=> {                      // completed

        const userDetails = req.body; 
       
        for(let i = 0; i<validUsers.length; i++){
            let temp = validUsers[i];
                if((temp.uname === userDetails.uname) && (temp.pwd === userDetails.pwd)){
                    // console.log(path.join(__dirname, 'public','resumes',`${temp.name}.pdf`));
                    res.set({'Content-Type':'application/pdf',
                             'Content-Length':pdf.length
                            });
                            
                    return res.sendFile(path.join(__dirname, 'public','resumes',`${temp.name}.pdf`));
                }
        } 
        console.log('Invalid Login Credentails');
        return res.redirect("login.html"); 
}); 
 
app.get("/signup", (req, res, next)=> {                             //completed
    return res.sendFile(path.join(__dirname,'views',"signup.html"));
}); 

app.post("/login", (req, res, next)=> {                             
    // check valid user from JS object 
    // if yes display dashboard containing resume based on user info..
    let userData = req.body;
    if(userData.repeatPass != userData.pwd){
        console.log('Password and Confirm Password does not match!');
        return res.redirect("/signup.html");
    }else {
        let newUser = {};
        newUser['uname'] = userData.uname;
        newUser['name'] = userData.fullname;
        newUser['pwd'] = userData.pwd;
        validUsers.push(newUser); 
        // let newResume = userData.resume.value;
        // fs.writeFileSync(`./public/resumes/${newUser.name}.pdf`,newResume);

        const myResume = new pdf;
        let resumeContent = `This is Ms/Mr ${userData.fullname}'s resume in PDF format`;
        
        let pdfName = `./public/resumes/${userData.fullname}.pdf`;

        myResume.pipe(fs.createWriteStream(pdfName));   
        myResume.font('Times-Roman')
                .fontSize(48)
                .text(resumeContent,100,100);
        myResume.end();

        console.log(newUser);   
        console.log(validUsers);   
        
    }

    return res.sendFile(path.join(__dirname,'views',"login.html"));
});

app.use("/",(req,res,next)=>{
    // any other invalid urls are handled here..
    return res.sendFile(path.join(__dirname,'views',"404.html"));
});

app.listen(3000);               