function changeMedicamentCurrentPage(page) {
    localStorage.setItem('medicamentSiteCurrentePage', page);
    reloadMedicamentData(null);
}

function appendMedicamentPagination(totalRows, limit) {
    $('#pagination_medicament_content').html('');

    if (localStorage.getItem('medicamentSiteCurrentePage') > 1) {
        $('#pagination_medicament_content').prepend(      
            '<button class="page-link pagi" onclick=prevMedicamentData(); disabled>' +
                '&laquo;' + 
            '</button>'     
        );
    }

    var i = 1;

    for (i = 1; i <= Math.ceil(totalRows/limit); i ++) {

        $('#pagination_medicament_content').append(      
            "<button class='page-link pagi' id='pageMedicament"+ i +"' onclick=changeMedicamentCurrentPage("+ i +")>" + i + "</button>"     
        );
    }

    $('#pageMedicament'+localStorage.getItem('medicamentSiteCurrentePage')).removeClass('page-link');
    $('#pageMedicament'+localStorage.getItem('medicamentSiteCurrentePage')).addClass('btn btn-info');

    if (localStorage.getItem('medicamentSiteCurrentePage') < (Math.ceil(totalRows/limit)) && i > 1) {
        $('#pagination_medicament_content').append(
            '<button class="page-link pagi" onclick=nextMedicamentData();>' +
                '&raquo;' +
            '</button>' 
        );
    }
}