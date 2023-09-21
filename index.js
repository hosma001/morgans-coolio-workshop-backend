const pg = require('pg');
const client = new pg.Client('postgress://localhost/cool_cars_db');
const morgan = require('morgan');
const express = require('express');
const { error } = require('console');
const app = express();
app.use(morgan("dev"));
app.use(express.json());

app.get('/api/hypercars', async(req, res, next)=> {
    try {
        const SQL = `
            SELECT *
            FROM hypercars
        `;
        const response = await client.query(SQL);
        res.send(response.rows);        
    } catch (error) {
        next(error);
    }
});

app.get('/api/hypercars/:id', async(req, res, next)=> {
    try {
        const SQL = `
            SELECT *
            FROM hypercars
            WHERE id = $1
        `;
        console.log(req);
        console.log(req.params);
        const response = await client.query(SQL, [req.params.id]);
        if(response.rows.length === 0) {
            throw new Error("ID does not exist")
        }
        res.send(response.rows);      
    } catch (error) {
        next(error);
    }
});

app.delete('/api/hypercars/:id', async(req, res, next)=> {
    try {
        const SQL = `
            DELETE
            FROM hypercars
            WHERE id = $1
        `;
        const response = await client.query(SQL, [req.params.id]);
        res.send(response.rows);
    } catch (error) {
        next(error)
    }
});

app.post('/api/hypercars', async(req, res, next)=> {
    try {
        const SQL = `
            INSERT INTO hypercars(make, model, horsepower)
            VALUES($1, $2, $3)
            RETURNING *
        `;
        const response = await client.query(SQL, [req.body.make, req.body.model, req.body.horsepower]);
        res.send(response.rows);
    } catch (error) {
        next(error);
    } 
});

app.put('/api/hypercars/:id', async(req, res, next)=> {
    try {
        const SQL = `
            UPDATE hypercars
            SET make = $1, model = $2, horsepower = $3
            WHERE id = $4
            RETURNING * 
        `;
        const response = await client.query(SQL, [req.body.make, req.body.model, req.body.horsepower, req.params.id]);
        res.send(response.rows);
    } catch (error) {
        next(error);
    }
});

app.use('*', (req, res, next)=> {
    res.status(404).send("Invalid Route");
});

app.use((err, req, res, next)=> {
    console.log('error handler');
    res.status(500).send(err.message);
}); 

const setup = async()=> {
    await client.connect();
    console.log('connected to the database');
    const SQL = `
        DROP TABLE IF EXISTS hypercars;
        CREATE TABLE hypercars(
            id SERIAL PRIMARY KEY,
            make VARCHAR(75),
            model VARCHAR(75),
            horsepower INT
        );
        INSERT INTO hypercars (make, model, horsepower) VALUES ('Bugatti', 'Chiron Super Sport 300+', 1578);
        INSERT INTO hypercars (make, model, horsepower) VALUES ('Koenigsegg', 'Jesko Absolut', 1603);
        INSERT INTO hypercars (make, model, horsepower) VALUES ('Hennessey', 'Venom F5', 1800);
        INSERT INTO hypercars (make, model, horsepower) VALUES ('Rimac', 'C_Two', 1888);
        INSERT INTO hypercars (make, model, horsepower) VALUES ('Bugatti', 'Veyron Super Sport', 1183);
        INSERT INTO hypercars (make, model, horsepower) VALUES ('McLaren', 'Speedtail', 1035);
        INSERT INTO hypercars (make, model, horsepower) VALUES ('Lamborghini', 'Aventador SVJ', 759);
        INSERT INTO hypercars (make, model, horsepower) VALUES ('Ferrari', 'LaFerrari', 789);
        INSERT INTO hypercars (make, model, horsepower) VALUES ('Porsche', '918 Spyder', 608);
        INSERT INTO hypercars (make, model, horsepower) VALUES ('Aston Martin', 'Valkyrie', 1160);
    `;
    await client.query(SQL);
    console.log('tables created and data seeded!');

    const port = process.env.PORT || 3000;
    app.listen(port, ()=> {
        console.log(`listening on port ${port}`);
    });
};

setup();