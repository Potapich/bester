let locals = [{hl: 'en', gl: 'us'}, {hl: 'nl', gl: 'de'}, {hl: 'ru', gl: 'ru'},
    {hl: 'zh-cn', gl: 'cn'}, {hl: 'ja', gl: 'jp'}, {hl: 'es-mx', gl: 'mx'},
    {hl: 'ko', gl: 'kr'}, {hl: 'fr', gl: 'fr'}, {hl: 'tr', gl: 'tr'},
    {hl: 'ms', gl: 'my'}, {hl: 'hi', gl: 'in'}, {hl: 'pt-br', gl: 'pt'},
    {hl: 'es', gl: 'es'}, {hl: 'it', gl: 'it'}, {hl: 'uk', gl: 'ua'}];
// let l = locals.length
// console.log(l)
// for (let key in locals) {
//     setTimeout(get_gameInfo, 1000 + l * 2000, new Date(), locals[key], l);
//     l--
// }

async function get_gameInfo(timeIs, local, l, j) {
    console.log(timeIs, local, l, j)
    // if (l === 0 && j === 0) {
    //     process.exit(0)
    // }
}

for (let j = 2; j > 0; --j) {
    let promisyra = new Promise((resolve, reject) => {
        setTimeout(resolve, 1000 + j * 1000, j);
    });
    promisyra.then((j) => {
        console.log(j)
        let l = locals.length;
        for (let key in locals) {
            setTimeout(get_gameInfo, 2000 + l * 1000, new Date(), locals[key], l, j);
            l--
        }
    });
}


