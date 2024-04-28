<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Table</title>
    <style>
        table {
            width: 80%;
            border-collapse: collapse;
            margin: 20px auto;
        }
        table, th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <h1>Database Table</h1>
    <table id="databaseTable">
        <thead>
            <tr>
                <th>ID</th>
                <th>String</th>
            </tr>
        </thead>
        <tbody id="tableBody">
            <!-- Table rows will be dynamically populated here -->
        </tbody>
    </table>

    <script>
        // Fetch data from your CloudFlare Pages endpoint
        fetch('https://warnight-net.pages.dev/testbd')
            .then(response => response.json())
            .then(data => {
                // Access the 'results' array from the response
                const results = data.results;

                // Get the table body element to append rows
                const tableBody = document.getElementById('tableBody');

                // Loop through each result and create a row in the table
                results.forEach(result => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${result.id}</td>
                        <td>${result.string}</td>
                    `;
                    tableBody.appendChild(row);
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    </script>
</body>
</html>
