function setSubmissions(page) {
  var xttp = new XMLHttpRequest();
  xttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      const tableBody = document.querySelector('#submissions-table tbody');
      tableBody.innerHTML = ''; // Clear the existing table rows
      var num = 1;
      var data = JSON.parse(this.responseText);
      data.submissions.forEach(entry => {
        const row = document.createElement('tr');
        const viewFilesButton = document.createElement('button');
        viewFilesButton.innerText = 'View Files';
        viewFilesButton.classList.add('view-files-button');
        viewFilesButton.addEventListener('click', () => openPopup(JSON.stringify(entry.uploaded_files), entry.status));
        row.innerHTML = `
          <td>${num}</td>
          <td>${entry.id}</td>
          <td>${entry.userID}</td>
          <td>${entry.appID}</td>
          <td>${entry.comment}</td>
          <td>${entry.created_at}</td>
          <td>${entry.adminID}</td>
          <td>${entry.status}</td>
          <td></td>
        `;
        ++num;
        row.querySelector('td:last-child').appendChild(viewFilesButton);
        tableBody.appendChild(row);
      });

      // Add pagination links
      const paginationContainer = document.querySelector('#pagination');
      paginationContainer.innerHTML = '';

      const prevButton = document.createElement('button');
      prevButton.innerText = 'Previous';
      prevButton.classList.add('pagination-button');

      // Prev button fallback case and logic
      prevButton.addEventListener('click', () => {
        if (data.currentPage > 1) {
          setSubmissions(data.currentPage - 1);
        }
      });
      paginationContainer.appendChild(prevButton);

      // Page buttons
      for (let i = 1; i <= data.totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.innerText = i;
        pageLink.classList.add('pagination-link');
        if (i === data.currentPage) {
          pageLink.classList.add('active');
        }
        pageLink.addEventListener('click', () => setSubmissions(i));
        paginationContainer.appendChild(pageLink);
      }

      // Next button fallback case and logic
      const nextButton = document.createElement('button');
      nextButton.innerText = 'Next';
      nextButton.classList.add('pagination-button');
      nextButton.addEventListener('click', () => {
        if (data.currentPage < data.totalPages) {
          setSubmissions(data.currentPage + 1);
        }
      });
      paginationContainer.appendChild(nextButton);

      // Add page input and go button
      const pageInput = document.createElement('input');
      pageInput.type = 'number';
      pageInput.min = 1;
      pageInput.max = data.totalPages;
      pageInput.value = data.currentPage;
      pageInput.classList.add('pagination-input');
      const goButton = document.createElement('button');
      goButton.innerText = 'Go';
      goButton.classList.add('pagination-button', 'go-button');
      goButton.addEventListener('click', () => {
        const pageNumber = parseInt(pageInput.value);
        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= data.totalPages) {
          setSubmissions(pageNumber);
        }
      });

      paginationContainer.appendChild(pageInput);
      paginationContainer.appendChild(goButton);
    }
  };
  xttp.open("GET", `http://localhost:3000/onramp/submissions.php?action=setsubmissions&page=${page}`, true);
  xttp.send();
}

{/* <h2>Submissions</h2>
 <div class="button-container">
 <button id="showButton" onclick="showTable()">Show Table</button>
 <button id="collapse
 Button" onclick="collapseTable()">Collapse</button>
</div>
<div class="scrollable-div" id="submissions-div">
 <table id="submissions-table">
     <thead>
         <tr class="heading-row">
             <th>Sno.</th>
             <th>Entry ID</th>
             <th>User ID</th>
             <th>Application ID</th>
             <th>Comment</th>
             <th>TimeStamp</th>
             <th>Admin ID</th>
             <th>Status</th>
             <th>Uploaded Files</th>
         </tr>
     </thead>
     <tbody></tbody>
 </table>
 <div id="pagination"></div>
</div> */}


//     <h1>Admin Panel</h1>
//     <table style="margin-left:auto; margin-right:auto;">
//     <tr>
//     <td> <label for="search_value"> Value </label> </td>
//     <td> <input type="text" style="width: 300px;" name="search_value" id="search_value" placeholder="User ID / Comment"> </td>

//     <td> <label for="search_by"> Search By : </label> </td>
//     <td>
//         <select name="search_by" id="search_by">
//             <option value="userId" selected> User ID </option>
//             <option value="comment"> Comment </option>
//         </select>
//     </td>

//     <td>
//         <input class="fetch-button" type="button" value=" SEARCH " onclick="searchForUser()">
//     </td>
// </tr>
// </table> 




    // if ($_GET['action'] === 'setsubmissions') {
    //     // Establish the connection
    //     $servername = "127.0.0.1";
    //     $username = "root";
    //     $password = "";
    //     $dbname = "admin_s3_uploads";
    
    //     $conn = new mysqli($servername, $username, $password, $dbname);
    //     // Response when connection failed
    //     if (mysqli_connect_errno()) {
    //         $obj = array();
    //         $obj['success'] = false;
    //         $obj['reason'] = mysqli_connect_error();
    //         $obj['result'] = array();
    //         echo json_encode($obj);
    //         die();
    //     }
    
    //     // Pagination settings 
    //     $itemsPerPage = 5; 
    //     $currentPage = isset($_GET['page']) ? intval($_GET['page']) : 1;
    //     $offset = ($currentPage - 1) * $itemsPerPage;
    
    //     // Fetch form submissions from the database with pagination
    //     $sql = "SELECT * FROM User_Details LIMIT $itemsPerPage OFFSET $offset";
    //     $result = mysqli_query($conn, $sql);
    
    //     // Response when there are no submissions
    //     if (!mysqli_num_rows($result)) {
    //         $obj = array();
    //         $obj['success'] = false;
    //         $obj['sql'] = $sql;
    //         $obj['reason'] = "There are no submissions yet";
    //         $obj['result'] = array();
    //         echo json_encode($obj);
    //         mysqli_close($conn);
    //         die();
    //     }
    
    //     $submissions = [];
    //     while ($row = mysqli_fetch_assoc($result)) {
    //         $submissions[] = $row;
    //     }
    
    //     // Fetch total number of submissions for pagination
    //     $totalSubmissionsQuery = "SELECT COUNT(*) as total FROM User_Details";
    //     $totalSubmissionsResult = mysqli_query($conn, $totalSubmissionsQuery);
    //     $totalSubmissions = mysqli_fetch_assoc($totalSubmissionsResult)['total'];
    
    //     $obj = array();
    //     $obj['success'] = true;
    //     $obj['currentPage'] = $currentPage;
    //     $obj['totalPages'] = ceil($totalSubmissions / $itemsPerPage);
    //     $obj['submissions'] = $submissions;
    //     echo json_encode($obj);
    
    //     // Should always close the connection.
    //     mysqli_close($conn);
    // }