function reloadMedicamentData(key) {
    $('#dynamic_content_product').html(
        '<td colspan="13" id="loading_medicament_data">' +
        '<div class="col-md-12">' +
        '<div class="col-md-12" style="margin:auto; text-align: center;">' +
        '<img src="../../public/assets/img/loader2.gif" width="60%">' +
        '</div>' +
        '</div>' +
        '</td>'
    );

    getLenthPanier();
    let limit = parseInt($('#limitInputMedicament').val());
    let page = localStorage.getItem('medicamentSiteCurrentePage');
    let uri_back = '';

    if (key === null) {
        uri_back = 'http://' + window.location.hostname + ':' + port + '/product/all/?key=&limit=' + limit + '&page=' + page;
    } else {
        uri_back = 'http://' + window.location.hostname + ':' + port + '/product/all/?key=' + key + '&limit=' + limit + '&page=' + page;
    }
    

    $.ajax({
        url: uri_back,
        method: "get",
        dataType: "json",
        success: function success(response) {
            let totalRows = (response.data.data.totalRows);
            let limit = (response.data.data.limit);

            appendMedicamentPagination(totalRows, limit);

            if (totalRows > 0) {
                response.data.data.rows.map(async function (item) {
                    let id = item.id;
                    let designation = item.designation;
                    let category = item.category.designation;
                    let prix = item.unit_price;
                    let pharmacy = item.pharmacy.designation;
                    let pharmacy_id = item.pharmacy.id;
                    let quantity = item.stock[0].quantity;

                    if (quantity > 5) {

                        $('#dynamic_content_product').append(
                            '<div class="col mb-5">' +
                            '<div class="card h-100">' +
                            '<!-- Product image-->' +
                            '<i class="card-img-top fas fa-3x fa-capsules" style="color:#2C3E50;margin-top:8%;"></i>' +
                            '<!-- Product details-->' +
                            '<div class="card-body p-4">' +
                            '<div class="row">' +
                            '<div class="col-12">' +
                            '<!-- Product name-->' +
                            '<h5 class="fw-bolder">' + designation + '</h5>' +
                            '<h6 class="fw-bolder">' + category + '</h6>' +
                            '<!-- Product price-->' +
                            '' + prix + ' Ariary' +
                            '<br>' + pharmacy + '' +
                            '<br>Quantité disponnible : <b>' + quantity + '</b>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '<!-- Product actions-->' +
                            '<div class="card-footer p-4 pt-0 border-top-0 bg-transparent">' +
                            '<div class=" col-12" id="actionBlog' + id + '">' +
                            //dynamic content
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>'
                        );

                        await verificationPan(id, designation, category, prix, pharmacy_id);
                    }

                });
            }
        }
    });
    $('#loading_medicament_data').hide();
}

function reloadPanier() {
    $('#body_panier_modal').html('');

    let localProduct = localStorage.getItem('product');

    if (localProduct === null || localProduct === '{}') {
        $('#body_panier_modal').html(
            '<tr>' +
            '<td colspan="6" style="color:#2C3E50;">' +
            '<i class="fas fa-sad-tear fa-2x"></i>' +
            '<p>Aucun element pour le moment</p>' +
            '</td>' +
            '<tr>'
        );

        $('#foot_panier_modal').html(
            '<tr>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td>Total : </td>' +
            '<td>0 Ariary</td>' +
            '<td></td>' +
            '<tr>'
        )

        $('#validate_panier').hide();
    } else {
        let panier = (JSON.parse(localProduct)).detailMovement;
        let total = 0;

        panier.map(function (item) {
            total += ((item.prix_u) * (item.quantity));

            $('#body_panier_modal').append(
                '<tr>' +
                '<td>' + item.id + '</td>' +
                '<td>' + item.designation + '</td>' +
                '<td>' + item.categorie + '</td>' +
                '<td>' + item.quantity + '</td>' +
                '<td>' + item.prix_u + ' Ar</td>' +
                '<td><button onclick="removeItemPanier(' + item.id + ')" style="border: none; background: none;"><i class="fas fa-times text-danger"></i></button></td>' +
                '<tr>'
            );
        });

        $('#foot_panier_modal').html(
            '<tr>' +
            '<td></td>' +
            '<td></td>' +
            '<td></td>' +
            '<th style="color:#2C3E50;">Total : </td>' +
            '<td>' + total + ' Ariary</td>' +
            '<td></td>' +
            '<tr>'
        );

        $('#validate_panier').show();
    }
}