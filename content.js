

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

    
  var myList = $('ul.clean-list:not(.inactive-list)');
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

// Handle modal popup windows
    
  let activeTextarea; // Track active textarea
  function createTextModal(initialText, id, title, textarea) {
    // Create modal elements
    let activeTextarea = textarea;

    const modalDiv = $('<div>').addClass('modal');
    const modalContent = $('<div>').addClass('modal-content');
    const closeButton = $('<span>').addClass('close').html('&times;');
    const dragHandle = $('<span>').addClass('draghandle').html('&#8212');
    const modalHeaderTitle = $('<h3>').addClass('modal-header').text(id + ': ' + title); // Adding header with Paper ID and Title
    const textareaDiv =  $('<div>').addClass('modal-text-div');
    const modalTextarea = $('<textarea>').addClass('modalTextArea').attr('id', 'modalTextarea').val(initialText);
    textareaDiv.append(modalTextarea);

    // Append elements to modal content
    modalContent.append(dragHandle, closeButton, modalHeaderTitle, textareaDiv);
    modalDiv.append(modalContent);

    // Append modal to body
    $('body').append(modalDiv);


 // Set initial positioning and show modal
    const windowHeight = $(window).height();
    const windowWidth = $(window).width();
    const modalHeight = 300; // Initial modal height
    const modalWidth = 500; // Initial modal width

    modalDiv.css({
        'display': 'block',
        'position': 'fixed', // Add this to ensure correct positioning
        'top': (windowHeight - modalHeight) / 2 + 'px',
        'left': (windowWidth - modalWidth) / 2 + 'px',
        'height': modalHeight + 'px',
        'width': modalWidth + 'px'
    }); 

    // Make the modal draggable after it's displayed
    modalDiv.draggable({
        handle: ".draghandle"
    });  
      
    modalDiv.resizable({
        handles: "n, e, s, w, ne, se, sw, nw" // Display all handles for resizing
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



// Notes box on the submission page:
$(document).ready(function () {
    if ($('body').hasClass('editorial-system-submission')) {
        // Extract manuscript ID from span element
        const manuscriptId = $('.c-address__sub-id').text().trim();
        const notesDiv = $('<div>').addClass('c p-grid-container');
        const notesDivc = $('<div>').addClass('c u-bg-color-light-grey p-grid-col-12');
        // Create a div with class drop-box-content for the dropdown
        const dropBoxContent = $('<div>').addClass('drop-box-content u-ml30').hide();

        // Create a button for the dropdown trigger
        const dropDownButton = $('<button class="h2 notes-exp closed-c">Editorial Notes</button>');

        // Create a div with class p-grid-container for the textarea and header
        const gridContainer = $('<div>').addClass('p-grid-container-c');

        
        // Create a textarea and append it to the grid container
        const textArea = $('<textarea>').attr({
            id: 'manuscriptTextArea',
            rows: '6', // Set number of rows as needed
            cols: '50' // Set number of columns as needed
        });
        gridContainer.append(textArea);

        // Append the grid container to the dropdown content
        dropBoxContent.append(gridContainer);
        
        notesDivc.append(dropDownButton);
        notesDivc.append(dropBoxContent);
        
        notesDiv.append(notesDivc);

        // Add the drop-down button and content to the body

        $('.p-grid-container').first().after(notesDiv);

        // Toggle dropdown content when the button is clicked
        dropDownButton.on('click', function() {
            const isClosed = $(this).hasClass('closed-c');

            // Toggle classes and aria-expanded attribute
            if (isClosed) {
                $(this).removeClass('closed-c').addClass('open-c');
            } else {
                $(this).removeClass('open-c').addClass('closed-c');
            }

            const dropBoxContent = $(this).next('.drop-box-content');
            dropBoxContent.slideToggle(); // Toggle visibility of the dropdown content
        });

        // Get text from localStorage and populate the textarea
        const storedText = localStorage.getItem('comment_' + manuscriptId);
        if (storedText !== null) {
            $('#manuscriptTextArea').val(storedText);
        }

        // Save changes to local storage when content changes
        $('#manuscriptTextArea').on('input', function () {
            const editedText = $(this).val();
            localStorage.setItem('comment_' + manuscriptId, editedText);
        });
    }
});










// Reviewer finder in SNAPP improvements
$(document).ready(function() {
 // Function to check and highlight elements
function highlightElements() {
  const reviewItems = document.querySelectorAll('li.u-flexbox.u-justify-content-between.u-align-items-center.u-mt-2');

  reviewItems.forEach(item => {
    const metricText = item.querySelector('p.c-reviewer-metric--details--text').textContent.trim();
    const metricNumber = parseInt(item.querySelector('p.c-reviewer-metric--details--stats').textContent.trim());

    if (metricText === 'Invitations to review' && metricNumber > 5) {
      item.style.backgroundColor = '#fab6b1';
    }
    if (metricText === 'Invitations to review' && metricNumber < 3) {
      item.style.backgroundColor = '#a9dfa8';
    }
  });
}

// MutationObserver configuration
const observerConfig = {
  childList: true, // Watch for changes in the children of the observed node
  subtree: true,   // Watch all descendants of the observed node
};

// Callback function for MutationObserver
const mutationCallback = function(mutationsList) {
  mutationsList.forEach(mutation => {
    if (mutation.type === 'childList') {
      // New nodes have been added, so let's check and highlight elements again
      highlightElements();
    }
  });
};

// Create a MutationObserver instance
const observer = new MutationObserver(mutationCallback);

// Start observing changes in the body (or any specific node)
observer.observe(document.body, observerConfig);

// Initial highlighting check when the content script runs
highlightElements();

});






                  