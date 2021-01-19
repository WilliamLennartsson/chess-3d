import chessApp from './chess/app'

const menuBtn1 = document.querySelector('#menuBtn1')
console.log('menuBtn1 :>> ', menuBtn1);
menuBtn1.onclick = () => { window.location = "/chess.html" }
window.onload = () => { chessApp() }