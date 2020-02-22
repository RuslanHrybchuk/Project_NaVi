function openMenu() {           //  for menu on mobile devices
    const menu = document.getElementById('mobile_nav_menu');

    if (getComputedStyle(menu).display == 'none'){
        menu.style.display = 'block';
    } else {
        menu.style.display = 'none';
    }
}

function openMenuItem(item) {
    if (getComputedStyle(item).display == 'none'){
        let classlist = document.getElementsByClassName('hidden_mobile_ul');
        for (let i = 0; i < classlist.length; i++){
            classlist[i].style.display = 'none';
        }
        item.style.display = 'block';
    } else {
        item.style.display = 'none';
    }
}

