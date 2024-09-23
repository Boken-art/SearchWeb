
// I select the HTML part with the ID searchForm when the user activates the  button type submit
document.getElementById('searchForm').addEventListener('submit', function (e) {
    //There  I stop the page from reloading when the form is submitted
    e.preventDefault(); 
   // Now I get the information from the input with the ID query
    const query = document.getElementById('query').value;  

    // At first, I send an asynchronous request to the server using the fetch function, "/search?q=" is the endpoint 
    // encodeURIComponent(query) is used to ensure that the query is encoded correctly with all characters
    fetch(`/search?q=${encodeURIComponent(query)}`)
        // There we get data in JSON format.
        .then(response => response.json())
        .then(results => {
            // Gets the HTML element with the ID 'results', which is the container where the search results will be displayed
            const resultsDiv = document.getElementById('results');
            // Deletes previous results from the container
            resultsDiv.innerHTML = '';  

            // Using the forEach method, we go through each object in the results and display them according to the template
            results.forEach(result => {
                // Create a div element for the HTML code.
                const resultElement = document.createElement('div');
                // Using an HTML template, we display the search results: result.link, result.title, result.snippet
                resultElement.innerHTML = `
                    <h2><a href="${result.link}" target="_blank">${result.title}</a></h2>
                    <p>${result.snippet}</p>
                `;

                // Create a div element that wraps the code in HTML.
                resultsDiv.appendChild(resultElement);
            });
            document.getElementById('downloadLink').style.display = 'block';
        })
        
        //Just catching some errors
        .catch(error => {
            console.error('Chyba při získávání výsledků:', error);
        });
});