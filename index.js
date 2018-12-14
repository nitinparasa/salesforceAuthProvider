const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var app = express()

/* Middleware */
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
  
/* Routing */  
app.get('/', (req, res) => {
    console.log('enter');
    res.render('pages/index',{ 
    salesforce_client_id: process.env.CLIENT_ID,
    salesforce_client_secret: process.env.CLIENT_SECRET
})
})
// app.all('/', (req,res,next) => {
//     console.log('entered');
//     const payload = {
//         grant_type: 'authorization_code',
//         code,
//         client_id: process.env.CLIENT_ID,
//         client_secret: process.env.CLIENT_SECRET,
//         redirect_uri: 'https://salesforceauthmock.herokuapp.com/' 
//       };
//     fetch('https://login.salesforce.com/services/oauth2/token', {
//         method: "POST",
//         body: payload
//     }).then(function(response) { 
//         console.log(response);
//     })
//     res.next;
// });
  
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
