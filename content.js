


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
    $('<td>').text(id).appendTo(row);
    $('<td>').append($('<a>').attr('href', titleURL).text(title)).appendTo(row);
    $('<td>').text(version).appendTo(row);
    $('<td>').append($('<textarea>').val(comment).on('input', function() {
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

    
    

    
});