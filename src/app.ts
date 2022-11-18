import express from 'express'
import dotenv from 'dotenv'
import midlewares from './config/midlewares';

dotenv.config()

const app = express();

midlewares(app);

app.get('/signin', (req, res) => {

    res.json({
        foo: 'bar'
    })
});


app.listen(process.env.PORT, () => {
    console.log(`Server listen on port ${process.env.PORT} 👌👌!`);
});