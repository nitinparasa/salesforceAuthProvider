const express = require('express')
const fetch = require('node-fetch');
var URLSearchParams = require('url-search-params');
var FormData = require('form-data');
const path = require('path')
const PORT = process.env.PORT || 5000

var app = express()

/* Middleware */
app.use(express.static(path.join(__dirname, 'public')))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
  
/* Routing */  
app.get('/', (req, res) => {
    console.log('enter');
    res.render('pages/index',{ 
    salesforce_user_name: '',
    salesforce_user_id: '',
    //salesforce_org_name: '',
    salesforce_profilePicURL: '',
    salesforce_org_id: ''
})
})

// autho Code callback from salesforce and request for accessToken
app.get('/callback', function(req,res){
    const authCode = req.query.code;
    console.log('Auth code is',authCode); 

    // var payload = new FormData();
    // payload.append("grant_type", "authorization_code");
    // payload.append("code", authCode);
    // payload.append("client_id",process.env.CLIENT_ID );
    // payload.append("client_secret", process.env.CLIENT_SECRET);
    // payload.append("redirect_uri", "https://salesforceauthmock.herokuapp.com/callback");
    // console.log(new URLSearchParams(payload));

    let bodyStr = "grant_type=" + encodeURIComponent('authorization_code') +"&" + "code=" + encodeURIComponent(authCode) +"&" + "client_id=" + encodeURIComponent(process.env.CLIENT_ID) +"&" + "client_secret=" + encodeURIComponent(process.env.CLIENT_SECRET) +"&" + "redirect_uri=" + encodeURIComponent("https://salesforceauthmock.herokuapp.com/callback");

    fetch(`https://login.salesforce.com/services/oauth2/token`, {
        method: "POST", 
        mode: "cors", 
        cache: "no-cache", 
        credentials: "include", 
        headers: {
            "Accept": 'application/json',
            "Content-Type": "application/x-www-form-urlencoded"
        },
        redirect: "follow", // manual, *follow, error
        body: bodyStr, // body data type must match "Content-Type" header
    })
    .then(response => response.json())
    .then(data => {
        const fetchedOrgId = data.id.substring(data.id.indexOf('id') + 3,data.id.lastIndexOf('/'))
        const fetchedUserId = data.id.substring(data.id.lastIndexOf('/')+1)

        console.log('Fethched user id and org id are',fetchedUserId,fetchedOrgId);
        // call to fetch user info 
        return fetch(`${data.instance_url}/services/oauth2/userinfo`, {
            method: "GET", 
            mode: "cors", 
            cache: "no-cache", 
            credentials: "include", 
            headers: {
                "Authorization": `${data.token_type} ${data.access_token}`
            },
            body: null // body data type must match "Content-Type" header
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        //return res.redirect('pages/index/success?response='+data);
    })
    .catch(error => console.error(error));
  
    res.render('pages/index',{
    salesforce_user_name: '',
    salesforce_user_id: '',
    //salesforce_org_name: '',
    salesforce_profilePicURL: '',
    salesforce_org_id: ''
    });
})

app.get('/success', (req, res) => {
    const responseRetrieved = req.query.response;
    const userName = responseRetrieved.name;
    const userId = responseRetrieved.user_id;
    //const orgName = responseRetrieved.;
    const orgId = responseRetrieved.organization_id;
    const userPic = responseRetrieved.picture;
    console.log(userName,userId,orgId);
    
    res.render('pages/index', {
        salesforce_client_id: process.env.CLIENT_ID,
        salesforce_client_secret: process.env.CLIENT_SECRET,
        salesforce_user_name: userName,
        salesforce_user_id: userId,
        //salesforce_org_name: orgName,
        salesforce_profilePicURL: userPic, 
        salesforce_org_id: orgId
    });
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
