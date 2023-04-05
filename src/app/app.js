function setStorage() {
    
    if (localStorage.getItem('medicamentSiteCurrentePage') === undefined || localStorage.getItem('medicamentSiteCurrentePage') === '' || localStorage.getItem('medicamentSiteCurrentePage') === null) {
        console.log('ap');
        localStorage.setItem('medicamentSiteCurrentePage', 1);
    }
}

setStorage();
getAllProduct();
getAllPharmacy();