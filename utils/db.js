const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://mff:mff@ilea.ip3i2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
