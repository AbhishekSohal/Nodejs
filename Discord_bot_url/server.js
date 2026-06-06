const express= require('express');
const app = express();
const path = require('path')
const cookieParser = require('cookie-parser')
const connectDB = require('./connection');
const URL = require('./models/url');

const { restrictTo, checkAuthentication } = require('./middlewares/auth')

const urlRoute = require('./routes/url')
const staticRoute = require('./routes/StaticRouter')
const userRoute = require('./routes/user')


// Connect to MongoDB
connectDB('mongodb://localhost:27017/myapp').then(() => console.log('Connected to MongoDB')).catch(err => console.error('MongoDB connection error:', err));
app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuthentication)

app.use('/url', restrictTo(['Normal']), urlRoute)
app.use('/user', userRoute)
app.use('/', staticRoute)







const port = 8003;







app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
