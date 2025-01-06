const express=require('express')
const session=require ('express-session')

const app=express();

app.use(session({
    secret: 'mi-clave-secreta',
    resave: false,
    saveUninitialized: true, 
    cookie: {secure: false}
}));

app.use((req, res, next) => {
    if(req.session){
        if(!req.session.createAt){
            req.session.createAt = new Date();

        }
        req.session.lastAcess = new Date();
    }
    next();
});

app.get('/session', (req, res)=>{
    if(req.session){
        const sessionId= req.session.id;
        const createAt= req.session.createAt;
        const lastAcess= req.session.lastAcess;
        const sessionDuration= (new Date() - createAt)/1000;

        res.send(`
        <h1>Detalles de la sesión.</h1>
        <p><strong>ID de la sesión:</strong> ${sessionId}</p>
        <p><strong>Fecha de creación de la sesión:</strong> ${createAt}</p>
        <p><strong>Último acceso:</strong> ${lastAcess}</p>
        <p><strong>Duración de la sesión (en segundos): </strong> ${sessionDuration}</p>
        `)
    }else{
        res.send('<h1>No hay sesión activa.</h1>')
    }
} )

app.get('/logout', (req, res) => {
    req.session.destroy((err)=>{
        if(err){
            return res.send('Error al cerrar la sesión.');
        }
        res.send('<h1>Sesión cerrada exitosamente.</h1>')
    })

})

app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
})