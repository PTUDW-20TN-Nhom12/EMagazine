var elms = document.getElementsByClassName('splide');

for (var i = 0; i < elms.length; i++) {
    let x = new Splide(elms[i], {
        type: 'loop',
        autoplay: true
    }).mount();
    if (i == 0) {
        x.on('click', (e) => {
            let index = e["index"];
            window.location.href="/content/" + noi_bat_id[index];
        })
    } else {
        x.on('click', (e) => {
            let index = e["index"];
            window.location.href="/content/" + top_10_id[index];
        })
    }
}