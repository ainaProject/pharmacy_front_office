
function getAllPharmacy() {
    $('#dynamic_content_pharmacy').html(
        '<td colspan="13" id="loading_pharmacy_data">' +
            '<div class="col-md-12">' +
                '<div class="col-md-12" style="margin:auto; text-align: center;">' +
                    '<img src="../../public/assets/img/loader2.gif" width="60%">' +
                '</div>' +
            '</div>' +
        '</td>'
    );

    const uri_back = 'http://' + window.location.hostname + ':' + port + '/pharmacy/?key=&limit=10&page=1';

    $.ajax({
        url: uri_back,
        method: "get",
        dataType: "json",
        success: function success(response) {
            const totalRows = (response.data.data.totalRows);

            if (totalRows > 0) {
                response.data.data.rows.map(function (item) {
                    const id = item.id;
                    const designation = item.designation;
                    const telephone = item.contact.telephone;
                    const email = item.contact.email;
                    const location = item.contact.location;
                    const alt = item.contact.altitude;
                    const longi = item.contact.longitude;

                    $('#dynamic_content_pharmacy').append(
                        '<div class="col mb-5">' + 
                            '<div class="card h-100">' + 
                                '<!-- Product image-->' + 
                                '<i class="card-img-top fas fa-3x fa-clinic-medical" style="color:#2C3E50;margin-top:8%;"></i>' + 
                                '<!-- Product details-->' + 
                                '<div class="card-body">' + 
                                    '<div class="text-center">' + 
                                        '<!-- Product name-->' + 
                                        '<h5 class="fw-bolder">' + designation + '</h5>' + 
                                        '' + telephone + '<br>' +
                                        '' + email + '<br>' +
                                        '' + location + '<br>' +
                                    '</div><br>' + 
                                    '<div class="text-center" >' +
                                        '<div style="display:flex;">' +
                                            '<div class="col-6">' +
                                                '<button class="btn btn-outline-primary" onclick="pharmacyDetailAction(\'' + alt + '\',\'' + longi + '\');"><i class="fas fa-eye"></i></button>' +
                                            '</div>' +
                                            '<div class="col-6">' +
                                                '<a href="tel:'+telephone+'" class="btn btn-outline-dark"><i class="fas fa-phone"></i></a>' +
                                            '</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>'
                    );
                });
            }
        }
    });
   $('#loading_pharmacy_data').hide();
}

function pharmacyDetailAction(alt, longi) {
    $('#cart').html(
        '<div class="card col-8" style="position: absolute;box-shadow:initial; padding: 0;margin-left: 15%;margin-top: -650px!important;">' +
        '<div class="row card-body" >' +
            '<div class="col-12">' +
                '<div id="map" style="width: 100%;height: 60vh;"></div>' +
            '</div>' +
            '<div class="col-12">' +
                '<p>map</p>' +
                '<button class="btn btn-outline-danger" onclick="closeMapPharmacie()">X</button>' +
            '</div>' +
        '</div>' +
    '</div>' 
    );

    var map = L.map('map').setView([-18.930531, 47.50875], 10);
        var titleLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
            maxZoom: 20,
            attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        }).addTo(map);
        
    L.Routing.control({
        waypoints: [
            L.latLng(-18.92275, 47.5255),
            L.latLng(alt, longi)
        ],
        createMarker: function (i, waypoint, n) {
            var markerOptions = {};
            if (i === 0) {
                // Premier point, marqueur bleu
                markerOptions.icon = L.icon({
                    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });
            } else if (i === n - 1) {
                // Dernier point, marqueur rouge
                markerOptions.icon = L.icon({
                    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });
            }
            return L.marker(waypoint.latLng, markerOptions);
        }
    }).addTo(map); 
}

function closeMapPharmacie() {
    $('#cart').html('');
}