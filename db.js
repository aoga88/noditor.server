var mongoose = require('mongoose');
var mongourl = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/noditor';
mongoose.connect(mongourl);