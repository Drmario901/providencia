jQuery(document).ready(function($) {  
    let table = new simpleDatatables.DataTable("#default-table");

    $('#entryForm').on('submit', function(e) {
        e.preventDefault();

        let plate = $('#plate').val();
        let driver = $('#driver').val();
        let entryDate = $('#fecha-form').val();
        let product = $('#productSelect').find("option:selected").text();
        let entryWeight = $('#entryWeight').val();
        let productEntry = $('#product-entry').is(":checked") ? 'Sí' : 'No';

        table.rows().add([
            [
                plate,
                driver,
                entryWeight,
                entryDate,
                product,
                productEntry
            ]
        ]);

        $('#entryForm')[0].reset();
    });
});
