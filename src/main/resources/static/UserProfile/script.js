import {loggedInId, loggedInEmail} from "../shared/userProfile.js";

const tHeadCols = [`ID`, 'USERNAME', 'LOCATION', 'MEMBER SINCE', 'EXERCISE', 'NO. QUESTIONS', 'DIFFICULTY', 'AVERAGE SCORE'];

let answers = [];
let percentage;
let users = [];

let whichUser = document.getElementById('whichUser').value;
let exercise = document.getElementById('exercise').value;
let url;

async function getUsers() {
    if(whichUser === 'onlyMe')
        url = `http://localhost:8080/users/${loggedInId}`;
    else
        url = `http://localhost:8080/users`;
    await fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            users = data;
            // userData = [data.userName, data.location, data.creationDate];
        })
        .catch(error => {
            console.log('You need to be logged in to see info');
        });
}

async function getAnswers(user, level) {
    url = `http://localhost:8080/answers/${users[user].id}/${exercise}/${level}`;
    await fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            percentage = 0;
            answers = data;
            for(let answer = 0; answer < answers.length; answer++) {
                percentage += answers[answer].score;
            }
            percentage /= answers.length;

        })
        .catch(error => {
            console.log('You need to be logged in to see info');
        });
}

async function generateTable() {
    //removes previous table
    try {
        const removedTbl = document.querySelector('table');
        document.body.removeChild(removedTbl);
    } catch (e) {}
    // creates a <table> element and a <tbody> element
    const tbl = document.createElement("table");
    tbl.classList.add('table');
    const tblHead = document.createElement("thead");
    const tblBody = document.createElement("tbody");
    const headRow = document.createElement("tr");

    // creating head
    for (let j = 0; j < 8; j++) {
        const cell = document.createElement("th");
        const span = document.createElement("span");
        span.innerHTML = " \u2191";
        span.classList.add('icon-arrow');

        const cellText = document.createTextNode(tHeadCols[j]);
        cell.appendChild(cellText);
        cell.appendChild(span);
        headRow.appendChild(cell);
    }
    tblHead.appendChild(headRow);
    let idCnt = 1;
    // creating body
    for (let user = 0; user < users.length; user++) {
        // creates a table row
        for(let level = 1; level <= 5; level++) {
            await getAnswers(user, level);
            if(!isNaN(percentage)) {
                const row = document.createElement("tr");
                for (let cellNo = 0; cellNo < 8; cellNo++) {
                // await getUserName();
                const cell = document.createElement("td");
                let cellText;
                switch(cellNo) {
                    case 0:
                        // cell.innerHTML = 5*user+level;
                        cellText = document.createTextNode(idCnt);
                        break;
                    case 1:
                        cellText = document.createTextNode(users[user].userName);
                        break;
                    case 2:
                        cellText = document.createTextNode('Bucharest');
                        break;
                    case 3:
                        cellText = document.createTextNode(users[user].creationDate);
                        break;
                    case 4:
                        cellText = document.createTextNode(exercise);
                        break;
                    case 5:
                        cellText = document.createTextNode(answers.length);
                        break;
                    case 6:
                        cellText = document.createTextNode(level);
                        break;
                    case 7:
                        cellText = document.createTextNode(Math.round(percentage));
                        break;
                }
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
                idCnt++;
                try {
                    tblBody.appendChild(row);
                } catch (e) {}
            }
        }

        // const cell1 = document.createElement("td");
        // const cell2 = document.createElement("td");
        // const cell3 = document.createElement("td");
        // const cell4 = document.createElement("td");
        // const cell5 = document.createElement("td");
        // const cell6 = document.createElement("td");
        // const cell7 = document.createElement("td");
        // const cell8 = document.createElement("td");
        //
        // // tBodyRows[i] = [i+1, 'ceva', 'locatie', 'data', 'equalizer', 10, 1, 93];
        // const cellText1 = document.createTextNode(i + 1);
        // const cellText2 = document.createTextNode(loggedInEmail);
        // const cellText3 = document.createTextNode('Bucharest');
        // const cellText4 = document.createTextNode(tBodyRows[0].date_time);
        // const cellText5 = document.createTextNode(tBodyRows[0].type);
        // const cellText6 = document.createTextNode(tBodyRows.length);
        // const cellText7 = document.createTextNode(tBodyRows[0].level);
        // const cellText8 = document.createTextNode(tBodyRows[0].score);
        //
        // cell1.appendChild(cellText1);
        // cell2.appendChild(cellText2);
        // cell3.appendChild(cellText3);
        // cell4.appendChild(cellText4);
        // cell5.appendChild(cellText5);
        // cell6.appendChild(cellText6);
        // cell7.appendChild(cellText7);
        // cell8.appendChild(cellText8);
        //
        // row.appendChild(cell1);
        // row.appendChild(cell2);
        // row.appendChild(cell3);
        // row.appendChild(cell4);
        // row.appendChild(cell5);
        // row.appendChild(cell6);
        // row.appendChild(cell7);
        // row.appendChild(cell8);

        // for (let j = 0; j < 8; j++) {
        //     // Create a <td> element and a text node, make the text
        //     // node the contents of the <td>, and put the <td> at
        //     // the end of the table row
        //     const cell = document.createElement("td");
        //     const cellText = document.createTextNode(tBodyRows[i][j]);
        //     cell.appendChild(cellText);
        //     row.appendChild(cell);
        // }
    }

    // put the <tbody> in the <table>
    tbl.appendChild(tblHead);
    tbl.appendChild(tblBody);
    // appends <table> into <body>
    document.body.appendChild(tbl);
}

await getUsers();
await generateTable();
sorting_algorithm();

function sorting_algorithm() {
    const   table_rows = document.querySelectorAll('tbody tr'),
        table_headings = document.querySelectorAll('thead th');

    // Sorting data of HTML table
    table_headings.forEach((head, i) => {
        let sort_asc = true;
        head.onclick = () => {
            console.log(head);
            table_headings.forEach(head => head.classList.remove('active'));
            head.classList.add('active');

            document.querySelectorAll('td').forEach(td => td.classList.remove('active'));
            table_rows.forEach(row => {
                row.querySelectorAll('td')[i].classList.add('active');
            })

            head.classList.toggle('asc', sort_asc);
            sort_asc = !head.classList.contains('asc');

            sortTable(i, sort_asc);
        }
    })
    function sortTable(column, sort_asc) {
        [...table_rows].sort((a, b) => {

            let first_row = a.querySelectorAll('td')[column],
                second_row = b.querySelectorAll('td')[column];
            console.log(a, b);
            return sort_asc ? (first_row < second_row ? 1 : -1) : (first_row < second_row ? -1 : 1);
        })
            .map(sorted_row => document.querySelector('tbody').appendChild(sorted_row));
    }
}

document.getElementById('exercise').addEventListener('change', async function() {
    exercise = document.getElementById('exercise').value;
    await generateTable();
    sorting_algorithm();
    createPages();
});

document.getElementById('whichUser').addEventListener('change', async function() {
    whichUser = document.getElementById('whichUser').value;
    await getUsers();
    await generateTable();
    sorting_algorithm();
    createPages();
});
//--------------------------------------------------------------------------------------------------------------------//
function createPages() {
    const content = document.querySelector('table');
    const itemsPerPage = 10;
    let currentPage = 0;
    const items = Array.from(content.getElementsByTagName('tr')).slice(1);
    function showPage(page) {
        const startIndex = page * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        items.forEach((item, index) => {
            item.classList.toggle('hidden', index < startIndex || index >= endIndex);
        });
        updateActiveButtonStates();
    }
    function createPageButtons() {
        try {
            const removedPagination = document.querySelector('.pagination');
            document.body.removeChild(removedPagination);
        } catch (e) {}
        const totalPages = Math.ceil(items.length / itemsPerPage);
        const paginationContainer = document.createElement('div');
        const paginationDiv = document.body.appendChild(paginationContainer);
        paginationContainer.classList.add('pagination');
        // Add page buttons
        for (let i = 0; i < totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i + 1;
            pageButton.addEventListener('click', () => {
                currentPage = i;
                showPage(currentPage);
                updateActiveButtonStates();
            });

            document.body.appendChild(paginationContainer);
            paginationDiv.appendChild(pageButton);
        }
    }
    function updateActiveButtonStates() {
        const pageButtons = document.querySelectorAll('.pagination button');
        pageButtons.forEach((button, index) => {
            if (index === currentPage) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
    createPageButtons(); // Call this function to create the page buttons initially
    showPage(currentPage);
}

createPages();
