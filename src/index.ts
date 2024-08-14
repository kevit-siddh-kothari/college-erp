import {app} from './app';
const port: unknown = process.env.PORT || 3000;
app.listen(port, ()=>console.log(`listening on port ${port}`));
