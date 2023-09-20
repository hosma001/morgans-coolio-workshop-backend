const pg = require('pg');
const client = new pg.Client('postgress://localhost/cool_cars_db');
const express = require('express');
const app = express();

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