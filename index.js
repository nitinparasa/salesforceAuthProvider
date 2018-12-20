const express = require('express')
const fetch = require('node-fetch');
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

    var payload = new FormData();
    payload.append("grant_type", "authorization_code");
    payload.append("code", authCode);
    payload.append("client_id",process.env.CLIENT_ID );
    payload.append("client_secret", process.env.CLIENT_SECRET);
    payload.append("redirect_uri", "https://salesforceauthmock.herokuapp.com/callback");
    console.log(payload);

    fetch(`https://login.salesforce.com/services/oauth2/token`, {
        method: "POST", 
        mode: "cors", 
        cache: "no-cache", 
        credentials: "include", 
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        redirect: "follow", // manual, *follow, error
        body: payload, // body data type must match "Content-Type" header
    })
    .then(response => response.json())
    .then(data => console.log('Fetch data',data))
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
