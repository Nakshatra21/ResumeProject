const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');

const app = express();

app.get('/getpdf', (req, res, next)=>{
    
    var pdfContent_1 = "Being daddy's girl is like having a permanent armour for the rest of life";    
    var pdfContent_2 = "Being daddy's girl is like having a permanent armour for the rest of life";

    // Create a document
   const doc = new PDFDocument();
    
    // Pipe its output somewhere, like to a file or HTTP response
    // See below for browser usage
    doc.pipe(fs.createWriteStream('output.pdf'));
    
    // Embed a font, set the font size, and render some text
    doc
    .font('fonts/ConeriaScript.ttf')
    .fontSize(25)
    .text(pdfContent_1,100,100);
    // .text('Some text with an embedded font!', 100, 100);
    
    // Add an image, constrain it to a given size, and center it vertically and horizontally
    doc.image('./images/pic.jpg', {
    fit: [250, 300],
    align: 'center',
    valign: 'center'
    });
    
    // Add another page
    doc
    .addPage()
    .fontSize(25)
    .text(pdfContent_2, 100, 100);

    
    // Add some text with annotations
    doc
    .addPage()
    .fillColor('blue')
    .text('Here is a link!', 100, 100)
    .underline(100, 100, 160, 27, { color: '#0000FF' })
    .link(100, 100, 160, 27, 'http://google.com/');
    
    // Finalize PDF file
    doc.end();

    res.send("PDF file with the name output.pdf is created in project's root folder daddy's girl!");

});

app.listen(3000, ()=> {
    console.log('Server started at port 3000.');
});
