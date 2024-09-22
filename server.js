
// I am importing library express framework
import express from 'express';    
// I am importing library file system for writing results to result.js       
import fs from 'fs';
// I import this library for easier work with file paths                  
import path from 'path'; 
// Here I import the fileURLToPath function from the 'url' module. The 'url' module simplifies working with URLs. I use fileURLToPath to convert a URL into a real file path
import { fileURLToPath } from 'url';  

import dotenv from 'dotenv';
dotenv.config();

// New instance of the Express 
const app = express();
// New definition of port, standard is port 3000 when creating and testing a new web app, you can use number up to 3000 if you want 
const port = 3000;

// In ES modules, we don't have __filename and __dirname like in CommonJS, so I create them using the URL module and functions like fileURLToPath
// There I took url transform it to path 
const __filename = fileURLToPath(import.meta.url); 
// There I extracts the directory path for easier work with other files in folder 
const __dirname = path.dirname(__filename); 

// Congratulations, you are at the checkpoint! I hope you're not bored; just clean up my comments. :)

// Just my Google API key and CX for searching in Google, I hide them in .env you know why :)
const API_KEY = process.env.API_KEY; // Přístup k API klíči
const CX = process.env.CX;

// It is a section that works with static files
//
app.use(express.static(__dirname));
//It use static files from the public folder. This folder contain the HTML, CSS and SCRIPT.
app.use(express.static(path.join(__dirname, '/public'))); 


// There start funn
// I use asynchronous functions; they work better when you wait for a response and are easier to read
app.get('/search', async (req, res) => {
    // Here I get the search query from the URL, which I use later
    const query = req.query.q;
    // Just check if we have something in the query, if not return an error with status 400
    if (!query) {
        return res.status(400).send({ error: 'Chybí dotaz.' });
    }
    // Now we create a URL for Google Custom Search. I use encodeURIComponent(query) to ensure that all characters are encoded correctly
    const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}`;

    // I use try for catching error 500 = no results
    try {

        // That why I use asynchronous functions, now I use await on GET request on Google Custom Search  
        const response = await fetch(url);
        // Then I convert the answers from JSON to an object for later use
        const data = await response.json();

        

        // There I just extract the title, link, and snippet for my static script.js, which I later call in the HTML so that the user can see the results on the page 
        const results = data.items.map(item => ({
            title: item.title,
            link: item.link,
            snippet: item.snippet
        }));

        // There I save the object results to results.json. We use JSON.stringify for nicer formatting
        fs.writeFile('results.json', JSON.stringify(results, null, 2), (err) => {
            // Also, don't forget to catch errors
            if (err) {
                console.error('Chyba při ukládání souboru:', err);
            }
        });

        //Just returns the results to the client in JSON format
        res.json(results);

    } catch (error) {
        res.status(500).send({ error: 'Chyba při získávání výsledků.' });
    }
});
// Listen on the port after starting the server and then just send information to the console.
app.listen(port, () => {
    console.log(`Server běží na http://localhost:${port}`);
});



