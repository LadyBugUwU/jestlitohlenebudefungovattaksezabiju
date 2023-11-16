const express = require('express'); 
const app = express(); 
const bodyParser = require('body-parser');
const fs = require('fs');

app.set('view engine', 'ejs'); 

app.use(bodyParser.urlencoded())  
app.use(bodyParser.json())

app.get('/', (req,res) => {

    res.render('index'); 
})  





app.get('/registrace', (req, res) => {
    res.render('registrace');
  });


  



  function zapisDoSouboru(data, soubor) {
    // Převedení objektu na JSON řetězec
    const novaData = JSON.stringify(data);

    // Kontrola, zda soubor již obsahuje data
    fs.readFile(soubor, 'utf8', (err, obsah) => {
        if (err) {
            console.error(`Chyba při čtení souboru ${soubor}: ${err.message}`);
            return;
        }

        let poleObjektu;
        try {
            // Pokus o parsování obsahu souboru
            poleObjektu = JSON.parse(obsah);
        } catch (parseError) {
            // Pokud parsování selže, vytvoříme nové prázdné pole
            poleObjektu = [];
        }

        // Kontrola, zda soubor obsahuje objekt se stejným klíčem
        let index = -1;
        for (let i = 0; i < poleObjektu.length; i++) {
            if (poleObjektu[i][0] === data[1]) {
                index = i;
                break;
            }
        }

        // Pokud nalezeno, nahraď starý objekt novým
        if (index !== -1) {
            poleObjektu[index] = data;
        } else {
            // Jinak přidá nový objekt do pole
            poleObjektu.push(data);
        }

        // Přepsání obsahu souboru s novým polem
        fs.writeFile(soubor, JSON.stringify(poleObjektu), (err) => {
            if (err) throw err;
            console.log('Data byla úspěšně zapsána do souboru.');
        });
    });
}

// Zpracování POST požadavku
app.post('/registrovat', (req, res) => {
    console.log(req.body);

    // Načtení dat ze souboru do pole
    const novaData = req.body;
    const souborRegistrace = 'registrace.txt';
    
    zapisDoSouboru(novaData, souborRegistrace);

    // Odpověď na požadavek
    res.send('Registrace proběhla úspěšně.');
});
  








  
  app.get('/vypis', (req, res) => {
    res.render('vypis'); 
  });



  
  app.get('/zaregistrovani', (req, res) => {
    // Čtení dat ze souboru
    fs.readFile('registrace.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(`Chyba při čtení souboru: ${err.message}`);
            res.status(500).json({ error: 'Chyba při čtení souboru' });
            return;
        }

        // Rozdělení souboru na řádky a odstranění prázdných řádků
        const radky = data.split('\n').filter(Boolean);

        // Převod řádků na pole JSON objektů
        const poleObjektu = radky.map((radek) => JSON.parse(radek));

        // Odeslání dat na frontend
        res.send(poleObjektu);
    });
});



app.use('/public', express.static('public'));

app.listen(22111, () => {
    console.log("posloucham na portu 22111"); 
})