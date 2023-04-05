const port = 3000;
function getAllProduct() {
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
    const uri_back = 'http://' + window.location.hostname + ':' + port + '/product/all/?key=&limit=' + limit + '&page=' + page;

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

async function verificationPan(id, designation, category, prix, pharmacy_id) {
    let localProduct = localStorage.getItem('product');
    let productData = JSON.parse(localStorage.getItem('product'));

    if (localProduct === null || localProduct === '{}') {
        $('#actionBlog' + id).html(
            '<div class="row col-12">' +
            '<div class="col-6">' +
            '<button class="btn btn-outline-primary" onclick="detailMedicament(' + id + ')"><i class="fas fa-eye"></i></button>' +
            '</div>' +
            '</div>&nbsp;' +
            '<div class="row col-12">' +
            '<div class="col-5">' +
            '<button class="btn btn-outline-dark" id="btn_add_' + id + '" disabled onclick=addCard("' + id + '","' + designation + '","' + category + '","' + prix + '","' + pharmacy_id + '");><i class="fas fa-cart-plus"></i></button>' +
            '</div>' +
            '<div class="col-7">' +
            '<input type="number" class="form-control" id="q_demande_' + id + '" onchange="quantityEvent(' + id + ')" value="0" style="text-align:center;">' +
            '</div>' +
            '</div>'
        );
    } else {
        let itemExists = await productData.detailMovement.some(function (item) {
            return item.id === id;
        });

        if (itemExists === true) {
            $('#actionBlog' + id).html(
                '<div class="text-center">' +
                '<button class="btn btn-outline-primary" onclick="detailMedicament(' + id + ')"><i class="fas fa-eye"></i></button>&nbsp;&nbsp;&nbsp;&nbsp;' +
                '<button class="btn btn-outline-danger" onclick="removePanier(' + id + ')"><i class="fas fa-times"></i></button>' +
                '</div>'
            );
        } else {
            $('#actionBlog' + id).html(
                '<div class="row col-12">' +
                '<div class="col-6">' +
                '<button class="btn btn-outline-primary" onclick="detailMedicament(' + id + ')"><i class="fas fa-eye"></i></button>' +
                '</div>' +
                '</div>&nbsp;' +
                '<div class="row col-12">' +
                '<div class="col-5">' +
                '<button class="btn btn-outline-dark" id="btn_add_' + id + '" disabled onclick=addCard("' + id + '","' + designation + '","' + category + '","' + prix + '","' + pharmacy_id + '");><i class="fas fa-cart-plus"></i></button>' +
                '</div>' +
                '<div class="col-7">' +
                '<input type="number" class="form-control" id="q_demande_' + id + '" onchange="quantityEvent(' + id + ')" value="0" style="text-align:center;">' +
                '</div>' +
                '</div>'
            );
        }
    }

}

function detailMedicament(id) {

}

function changeMedicamentLimitData() {
    reloadMedicamentData(null);
}

function searchMedicament() {
    let unicode = event.keyCode;

    if (unicode === 13) {
        var key = $('#keyMedicament').val();
        reloadMedicamentData(key);
    }
}

function quantityEvent(id) {
    const quantity = parseInt($('#q_demande_' + id).val());
    console.log(quantity);
    if (quantity > 0) {
        $('#btn_add_' + id).removeAttr('disabled');
    } else {
        $('#btn_add_' + id).attr('disabled', 'disabled');
    }
}

function addCard(idProduct, designation, categorie, prix, pharmacy) {
    const quantity = parseInt($('#q_demande_' + idProduct).val());
    const localData = localStorage.getItem('product');

    if (localData === undefined || localData === '{}' || localData === null) {
        const data = JSON.stringify({ "receiver": { "id": pharmacy }, "detailMovement": [{ "id": parseInt(idProduct), "designation": designation, "quantity": quantity, "categorie": categorie, "prix_u": parseInt(prix) }] });
        localStorage.setItem('product', data);
    } else {
        const productData = JSON.parse(localStorage.getItem('product'));
        productData.detailMovement.push({ "id": parseInt(idProduct), "designation": designation, "quantity": quantity, "categorie": categorie, "prix_u": parseInt(prix) });
        const newProductData = { "receiver": productData.receiver, "detailMovement": productData.detailMovement };
        localStorage.setItem('product', JSON.stringify(newProductData));
    }

    reloadMedicamentData(null);
}

function getLenthPanier() {
    let localstorage_product = localStorage.getItem('product');

    if (localstorage_product === null || localstorage_product === '{}') {
        $('#badge_pan').html(0);
    } else {
        $('#badge_pan').html((JSON.parse(localstorage_product)).detailMovement.length);
    }

}

function removePanier(id_product) {

    let localstorage_product = localStorage.getItem('product');
    let receiver = (JSON.parse(localstorage_product)).receiver;
    let panier = (JSON.parse(localstorage_product)).detailMovement;
    let newDetail = [];

    if (panier.length === 1) {
        localStorage.setItem('product', '{}');
    } else {
        panier.map(function (item) {
            if (item.id != id_product) {
                newDetail.push({ "id": item.id, "designation": item.designation, "quantity": item.quantity, "categorie": item.categorie, "prix_u": item.prix_u });
            }
        });

        let newPanier = { "receiver": { "id": receiver.id }, "detailMovement": newDetail };

        localStorage.setItem('product', JSON.stringify(newPanier));
    }


    reloadMedicamentData(null);

    return true;
}

function removeItemPanier(id_product) {

    let localstorage_product = localStorage.getItem('product');
    let receiver = (JSON.parse(localstorage_product)).receiver;
    let panier = (JSON.parse(localstorage_product)).detailMovement;
    let newDetail = [];

    if (panier.length === 1) {
        localStorage.setItem('product', '{}');
    } else {
        panier.map(function (item) {
            if (item.id != id_product) {
                newDetail.push({ "id": item.id, "designation": item.designation, "quantity": item.quantity, "categorie": item.categorie, "prix_u": item.prix_u });
            }
        });

        let newPanier = { "receiver": { "id": receiver.id }, "detailMovement": newDetail };

        localStorage.setItem('product', JSON.stringify(newPanier));
    }

    reloadPanier();
    reloadMedicamentData(null);

    return true;
}

function showListPanierModal() {
    $('#body_panier_modal').html('');

    const localProduct = localStorage.getItem('product');

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

    $('#panierModal').show();
}

function closePanier() {
    $('#panierModal').hide();
}

async function validateCardAction() {
    const numberCardValue = $("#number_cart_checkout").val();
    const name = $("#name_checkout").val();
    const email = $("#email_checkout").val();
    const phone = $("#phone_checkout").val();
    const expire_mounth = $("#expire_mounth_checkout").val();
    const expire_year = $("#expire_year_checkout").val();
    const cvc = $("#cvc_checkout").val();

    if (
        numberCardValue.length === 0 ||
        name.length === 0 ||
        email.length === 0 ||
        phone.length === 0 ||
        expire_mounth.length === 0 ||
        expire_year.length === 0 ||
        cvc.length === 0
    ) {
        verificationAllFieldCheckout();
    } else {
        $("#error_cart").hide();
        $("#error_name").hide();
        $("#error_email").hide();
        $("#error_phone").hide();
        $("#error_mm").hide();
        $("#error_yyyy").hide();
        $("#error_cvc").hide();

        await swal({
            title: "Êtes-vous sûr ?",
            text: "Cette action est irréversible, votre compte va être directement débité",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                getAllData();
            }
          });
    }
}

async function getAllData() {
    const numberCardValue = $("#number_cart_checkout").val();
    const name = $("#name_checkout").val();
    const email = $("#email_checkout").val();
    const phone = $("#phone_checkout").val();
    const expire_mounth = $("#expire_mounth_checkout").val();
    const expire_year = $("#expire_year_checkout").val();
    const cvc = $("#cvc_checkout").val();
    const localProduct = localStorage.getItem('product');
    const panier = (JSON.parse(localProduct)).detailMovement;
    const pharmacy = (JSON.parse(localProduct)).receiver.id;
    let total = 0;

    await panier.map(function (item) {
        total += ((item.prix_u) * (item.quantity));
    });

    const datas = {
        "pharmacy": {
            "id": parseInt(pharmacy)
        },
        "detailMovement": panier,
        "total_transaction": total,
        "transaction": {
            "full_name": name,
            "tel": phone,
            "email": email
        },
        "cart_info": {
            "numberCart": numberCardValue,
            "exp_month": parseInt(expire_mounth),
            "exp_year": parseInt(expire_year),
            "cvc": cvc
        }
    };

    $('#panierModal').hide();
    $('#factureModal').show();
    $('#tikeload').show();
    $('#facture_content').hide();

    const uri_back = 'http://' + window.location.hostname + ':' + port + '/movements/client/';

    $.ajax({
        url: uri_back,
        method: "post",
        dataType: "json",
        data: datas,
        success: function success(response) {
            const id_movement = response.movement.id;
            const tt = total;
            const pharmacy = response.movement.pharmacy.designation;
            const location = response.movement.pharmacy.contact.location;
            const telephone = response.movement.pharmacy.contact.telephone;
            const email = response.movement.pharmacy.contact.email;
            const country = response.movement.pharmacy.contact.country;

            var buffer = response.movement.fileCode;
            const byteArray = new Uint8Array(buffer.data);
            const base64String = btoa(String.fromCharCode.apply(null, byteArray));

            const dataURL = "data:image/png;base64," + base64String;
            const img = document.getElementById('image');
            img.src = dataURL;

            $('#libelles').html("Commande N° " + id_movement + "<br> Total à payer : " + tt + " Ariary");
            $('#contact_pharmacy').html(pharmacy + " <br> " + location + " " + country + " <br> " + telephone + " <br> " + email);

            $('#tikeload').hide();
            $('#facture_content').show();
        }
    });
}

async function screenShotFacture() {
    await domtoimage.toBlob(document.getElementById('facture_content')).then(function (blob) {
        console.log(blob);
        saveAs(blob, 'my-node.png');
    });

    await localStorage.setItem('product', '{}');
    await $('#factureModal').hide();
    await swal("Félicitations!", "Votre ticker est bien sauvegardé!", "success");
    await reloadMedicamentData(null);
}

function verificationAllFieldCheckout() {
    const numberCardValue = $("#number_cart_checkout").val();
    const name = $("#name_checkout").val();
    const email = $("#email_checkout").val();
    const phone = $("#phone_checkout").val();
    const expire_mounth = $("#expire_mounth_checkout").val();
    const expire_year = $("#expire_year_checkout").val();
    const cvc = $("#cvc_checkout").val();

    if (numberCardValue.length === 0) {
        $("#error_cart").show();
    } else {
        $("#error_cart").hide();
    }

    if (name.length === 0) {
        $("#error_name").show();
    } else {
        $("#error_name").hide();
    }

    if (email.length === 0) {
        $("#error_email").show();
    } else {
        $("#error_email").hide();
    }

    if (phone.length === 0) {
        $("#error_phone").show();
    } else {
        $("#error_phone").hide();
    }

    if (expire_mounth.length === 0) {
        $("#error_mm").show();
    } else {
        $("#error_mm").hide();
    }

    if (expire_year.length === 0) {
        $("#error_yyyy").show();
    } else {
        $("#error_yyyy").hide();
    }

    if (cvc.length === 0) {
        $("#error_cvc").show();
    } else {
        $("#error_cvc").hide();
    }
}

function verificationCart() {
    const numberCardValue = $("#number_cart_checkout").val();

    if (numberCardValue.length < 16 && numberCardValue.length > 0) {
        $("#error_cart").show();
    } else if (numberCardValue.length < 16 && numberCardValue.length === 0) {
        $("#error_cart").hide();
    } else if (numberCardValue.length > 16) {
        $("#number_cart_checkout").val(numberCardValue.substr(0, 16));
        $("#error_cart").hide();
    } else {
        $("#error_cart").hide();
    }
}


function verificationEmail() {
    const email = $("#email_checkout").val();
    const format_email = /\S+@\S+\.\S+/;
    const test = format_email.test(email);

    if (test) {
        $("#error_email").hide();
    } else {
        $("#error_email").show();
    }

    if (email.length === 0) {
        $("#error_email").hide();
    }
}

function verificationMM() {
    const mm = $("#expire_mounth_checkout").val();

    if (mm.length > 0 && mm.length < 2) {
        $("#error_mm").show();
    } else if (mm.length > 2) {
        $("#expire_mounth_checkout").val(mm.substr(0, 2));
        $("#error_mm").hide();
    } else if (mm.length === 0) {
        $("#error_mm").hide();
    } else if (mm.length === 2) {
        $("#error_mm").hide();
    }
}

function verificationYYYY() {
    const yyyy = $("#expire_year_checkout").val();

    if (yyyy.length > 0 && yyyy.length < 4) {
        $("#error_yyyy").show();
    } else if (yyyy.length > 2) {
        $("#expire_year_checkout").val(yyyy.substr(0, 4));
        $("#error_yyyy").hide();
    } else if (yyyy.length === 0) {
        $("#error_yyyy").hide();
    } else if (yyyy.length === 4) {
        $("#error_yyyy").hide();
    }
}

function verificationCvc() {
    const cvc = $("#cvc_checkout").val();

    if (cvc.length > 0 && cvc.length < 3) {
        $("#error_cvc").show();
    } else if (cvc.length > 3) {
        $("#cvc_checkout").val(cvc.substr(0, 3));
        $("#error_cvc").hide();
    } else if (cvc.length === 0) {
        $("#error_cvc").hide();
    } else if (cvc.length === 3) {
        $("#error_cvc").hide();
    }
}