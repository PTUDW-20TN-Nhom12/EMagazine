var elms = document.getElementsByClassName('splide');

for (var i = 0; i < elms.length; i++) {
    let x = new Splide(elms[i], {
        type: 'loop',
        autoplay: true
    }).mount();
    x.on( 'click', () => {
        window.location.href = 'post.html'
    })
}