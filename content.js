


// Find all <link> elements with href containing 'basic.css'
var links = document.querySelectorAll('link[href*="basic.css"]');

// Loop through all found elements and remove them
links.forEach(function(link) {
    link.parentNode.removeChild(link);
});

jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "dropdown-text-pre": function(a) {
        // Extract the text from the dropdown
        return $(a).find('option:selected').text().toLowerCase();
    },

    "dropdown-text-asc": function(a, b) {
        return a.localeCompare(b);
    },

    "dropdown-text-desc": function(a, b) {
        return b.localeCompare(a);
    }
});


                
                
                
$(document).ready(function() {

    
  var myList = $('ul.clean-list');
  var listItems = myList.find('li');

  var table = $('<table>').attr('id', 'myTable');
  var tableHead = $('<thead>').appendTo(table);
  var tableBody = $('<tbody>').attr('id', 'tableBody').appendTo(table);

  // Create table header
  tableHead.append('<tr><th>Author</th><th>Journal</th><th>ID</th><th>Title</th><th>V</th><th>Comments</th><th>Status</th></tr>');

  listItems.each(function(index) {
    var listItem = $(this);
    var author = listItem.find('.c-submissions-list__item--author.u-font-14.u-gray-text-dark').text().trim();
    var journal = listItem.find('.c-submissions-list__item--author.u-font-12.u-gray-text').text().trim();
    var id = listItem.find('.c-submissions-list__item--id').text().trim();
    var titleLink = listItem.find('a');
    var title = titleLink.text().trim();
    var titleURL = titleLink.attr('href');
    var version = listItem.find('.c-submissions-list__item--moreinfoversion span').text().trim();

    var comment = localStorage.getItem('comment_' + id) || '';
    var color = localStorage.getItem('color_' + id) || '#ffffff'; // Get saved color from localStorage or default

    var row = $('<tr>').appendTo(tableBody);
    $('<td>').text(author).appendTo(row);
    $('<td>').text(journal).appendTo(row);
    $('<td>').text(id).addClass('c-submissions-list__item--id').appendTo(row);
    $('<td>').append($('<a>').attr('href', titleURL).text(title)).addClass('c-title').appendTo(row);
    $('<td>').text(version).appendTo(row);
    $('<td>').append($('<textarea>').val(comment).attr('readonly', true).on('input', function() {
      localStorage.setItem('comment_' + id, $(this).val());
    })).appendTo(row);
      
   var colorCell = $('<td>').appendTo(row);
    var colorSelect = $('<select>').on('change', function() {
      var selectedColor = $(this).val();
      colorCell.css('background-color', selectedColor);
      localStorage.setItem('color_' + id, selectedColor);
    }).appendTo(colorCell);

    // Define available colors with their hex values
    var availableColors = [
      { name: '1', value: '#fec1c1' },
      { name: '2', value: '#5ccebc' },
      { name: '3', value: '#a7a7e2' },
      { name: '4', value: '#edf1ac' },
      { name: '5', value: '#f1bcff' }
    ]; // You can add or modify colors here

    availableColors.forEach(function(colorOption) {
      var option = $('<option>').attr('value', colorOption.value).text(colorOption.name);
      if (color === colorOption.value) {
        option.attr('selected', 'selected');
        colorCell.css('background-color', colorOption.value);
      }
      colorSelect.append(option);
    });
      
      
  });

  myList.replaceWith(table);

  // Initialize DataTable with options
  $("#myTable").DataTable({
      
      pageLength: 100,
      stateSave: true,
      columnDefs: [
          { targets: [0, 1, 2, 3, 5], width: "auto" }, // Adjust width for specific columns
          { targets: 4, width: "10px" },
          { targets: 6, type: 'dropdown-text'}
            
      ],
      wordWrap: true, // Enable text wrapping
      deferRender: true, // Render only the visible entries, improves performance with large data
      autoWidth: false // Disable automatic column width calculation
  });

  let activeTextarea; // Track active textarea
  function createTextModal(initialText, id, title, textarea) {
    // Create modal elements
    activeTextarea = textarea;

    const modalDiv = $('<div>').addClass('modal');
    const modalContent = $('<div>').addClass('modal-content');
    const closeButton = $('<span>').addClass('close').html('&times;');
    const modalHeader = $('<h3>').text('Paper ID: ' + id); // Adding header with Paper ID
    const modalTitle = $('<h3>').text(title); // Adding header with Paper ID
    const modalTextarea = $('<textarea>').attr('id', 'modalTextarea').val(initialText);
    const headerContainer = $('<div>').append(modalHeader).append(modalTitle); // Create a container for header
    
    // Append elements to modal content
    modalContent.append(closeButton, headerContainer, modalTextarea);
    modalDiv.append(modalContent);

    // Append modal to body
    $('body').append(modalDiv);

    // Show modal

      modalDiv.css({
    'display': 'block',
    'left': '50%',
    'top': '50%',
    'transform': 'translate(-50%, -50%)'
  });



    // Close the modal when the close button is clicked
    closeButton.on('click', function() {
    if (activeTextarea) {
        activeTextarea.val(modalTextarea.val());
        modalDiv.css('display', 'none');
        localStorage.setItem('comment_' + id, modalTextarea.val());
      }
      modalDiv.css('display', 'none');
    });
  }

  // Attach click event listener to each textarea for opening modal
  $('#myTable').on('click', 'textarea', function() {
    const textContent = $(this).val();
    const id = $(this).closest('tr').find('.c-submissions-list__item--id').text().trim();
    const title = $(this).closest('tr').find('.c-title').text().trim();
    createTextModal(textContent, id, title, $(this));
  });
    
// Create a button and append it above the table
var downloadButton = $('<button>').text('Export').addClass('btn').attr('id', 'downloadTxt');
$('#myTable_wrapper').after(downloadButton);

function downloadTxtFile() {
  var tableData = [];

  // Get table headers
  var headers = [];
  $('#myTable th').each(function() {
    headers.push($(this).text());
  });

  // Get table rows
  $('#myTable tbody tr').each(function() {
    var rowData = [];

    // Loop through each cell in the row
    $(this).find('td').each(function(index) {
      var cellValue = '';

      // If the cell contains a textarea, get its value; otherwise, get cell text
      if ($(this).find('textarea').length > 0) {
        cellValue = $(this).find('textarea').val();
      } else {
        cellValue = $(this).text().trim();
      }

      // Add header and value to the row data
      rowData.push(headers[index]); // Header
      rowData.push(cellValue); // Value
    });

    // Push row data to the tableData array
    tableData.push(rowData);
  });

  // Create a blob with the data
  var blob = new Blob([convertToFormattedText(tableData)], { type: 'text/plain' });

  // Create a link element and trigger the download
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  var yyyy = today.getFullYear();

  today = mm + '-' + dd + '-' + yyyy;

  link.href = window.URL.createObjectURL(blob);
  link.download = 'B-SNAPP-export-' + today + '.txt'; 
  link.click();
}

// Function to convert table data to formatted text
function convertToFormattedText(data) {
  var formattedText = '';
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  var yyyy = today.getFullYear();

  today = mm + '/' + dd + '/' + yyyy;

  // Add date to the beginning of the text
  formattedText += 'Export Date: ' + today + '\n\n';
  // Loop through each row
  data.forEach(function(row) {
    row.forEach(function(cell, index) {
        
      if (index % 2 === 0) {
        formattedText += '**** ';
        formattedText += cell;  
        formattedText += ' ****';
      } else {
        formattedText += cell;
      }

      // Add tab after headers, except for the last item in the row
      if (index % 2 === 0) {
        formattedText += '\n';
      } else {
        formattedText += '\n';
      }
    });
      formattedText += '********************************************************';
      formattedText += '\n';
      formattedText += '\n';
  });

  return formattedText;
}

// Attach the downloadTxtFile function to the button click event
$('#downloadTxt').on('click', function() {
  downloadTxtFile();
});

    
});
