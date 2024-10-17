jQuery(document).ready(function($) {  
    let table = new simpleDatatables.DataTable("#default-table");

    $('#entryForm').on('submit', function(e) {
        e.preventDefault();

        let plate = $('#plate').val();
        let plateType = $('#plateType').val();
        let driver = $('#driver').val();
        let entryDate = $('#fecha-form').val();
        let entryHour = $('#hiddenTimeInput').val();
        let productSelect = $('#productSelect').find("option:selected");
        let productCode = productSelect.val();  
        let productName = productSelect.text(); 
        let entryWeight = $('#entryWeight').val();
        let productEntry = $('#product-entry').is(":checked") ? 'Sí' : 'No';

        let newRow = `
            <tr>
                <td>${plate}</td>
                <td>${driver}</td>
                <td>${plateType}</td>
                <td>${entryWeight}</td>
                <td>${entryDate}</td>
                <td>${entryHour}</td>
                <td>${productCode}</td>  
                <td>${productName}</td>   
                <td>${productEntry}</td>
                <td>Sí</td>
            </tr>
        `;

        table.destroy();
        $('#default-table tbody').append(newRow);

        table = new simpleDatatables.DataTable("#default-table");
        $('#entryForm')[0].reset();
    });
});
