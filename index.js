const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var app = express()

/* Middleware */
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
  
/* Routing */  
app.get('/', (req, res) => res.render('pages/index',{ 
    salesforce_client_id: process.env.CLIENT_ID,
    salesforce_client_secret: process.env.CLIENT_SECRET
}))
app.get('/?code=*', () => {
    const payload = {
        grant_type: 'authorization_code',
        code,
        client_id: '<%= client_id %>',
        client_secret: '<%= client_secret %>',
        redirect_uri: 'https://salesforceauthmock.herokuapp.com/' 
      };
    fetch('htttps://login.salesforce.com/services/oauth2/token', {
        method: "POST",
        body: payload
    }).then(function(response) { 
        console.log(response);
    })
});
  
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
