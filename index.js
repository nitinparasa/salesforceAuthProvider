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
    salesforce_client_id: process.env.CLIENT_ID,
    salesforce_client_secret: process.env.CLIENT_SECRET,
    salesforce_user_name: '',
    salesforce_user_id: '',
    //salesforce_org_name: '',
    salesforce_profilePicURL: '',
    salesforce_org_id: ''
})
})

// initial callout to get the authorization code
app.get('/sflogin', function(req,res){
    var url = new URL("https://login.salesforce.com/services/oauth2/authorize"),
    params = {response_type:'code', client_id:'3MVG9YDQS5WtC11qkyOS6M6DQY99CEesL6Mdf0xzUGG8bD8o0a4CCnkxZjn4ut5cd4o9mjihGRubfypmGyEGj',redirect_uri:'https://salesforceauthmock.herokuapp.com/'}
    
    url.search = new URLSearchParams(params)

    fetch(url)
    .then(res => res.json())
    .then(json => console.log(json));
    res.render('pages/index');

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
