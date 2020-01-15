import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

let sessionId = document.getElementById("sessionId").dataset.sessionid;
fetch(`/admin/sessions/${sessionId}/results`).then((res) => res.json()).then((result) => {

    let lines = result.specialties.flatMap((specialty) => 
        specialty.users.map((user) => {
            return [user.lastname, 
                    user.firstname,
                    specialty.name,
                    `${user.result.listening}/495`,
                    `${user.result.reading}/495`,
                    `${user.result.listening + user.result.reading}/990`
                ]
        })
    );

    var docDefinition = {
        content: [{
            text: 'Résultats',
            style: "header",
        },{
            text: `Date: ${result.date}`,
            style: "subheader",
        },{
            layout: 'lightHorizontalLines',
            table: {
                headerRows: 1,
                width: ["auto", "auto", "auto", "auto", "auto", "auto"],
                body: [
                    ["Nom", "Prénom", "Spécialité", "Listening", "Reading", "Total"],
                    ...lines,
                ]
            }
        }],
        styles: {
            header: {
                fontSize: 22,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 5]
            },
            subheader: {
                fontSize: 10,
                color: 'grey',
                margin: [0, 0, 0, 10]
            }
        }
    };
    
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    
    document.getElementById("downloadPDF").addEventListener("click", (e) => {
        e.preventDefault();
        pdfDocGenerator.download();
    })

});

