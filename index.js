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
    salesforce_client_secret: process.env.CLIENT_SECRET,
    salesforce_user_name: '',
    salesforce_user_id: '',
    salesforce_org_name: '',
    salesforce_org_id: ''
})
})

app.get('/success', (req, res) => {
    const userName = req.query.uname;
    const userId = req.query.uid;
    const data = {
        a:1
    };
    console.log(data.Salesforce_User_Name);
    res.render('pages/index', {
        salesforce_client_id: process.env.CLIENT_ID,
        salesforce_client_secret: process.env.CLIENT_SECRET,
        salesforce_user_name: userName,
        salesforce_user_id: userId,
        salesforce_org_name:data.Org_Name,
        salesforce_org_id: data.Org_Id
    });
});

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
