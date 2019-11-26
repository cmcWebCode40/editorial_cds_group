const app = require('express')();
const config = require('./config');

require('./middleware')(app);
require('./router')(app);

app.listen(config.port, ()=>{console.log(`listening to port ${config.port}`)});