let locals = [{hl: 'en', gl: 'us'}, {hl: 'nl', gl: 'de'}, {hl: 'ru', gl: 'ru'},
    {hl: 'zh-cn', gl: 'cn'}, {hl: 'ja', gl: 'jp'}, {hl: 'es-mx', gl: 'mx'},
    {hl: 'ko', gl: 'kr'}, {hl: 'fr', gl: 'fr'}, {hl: 'tr', gl: 'tr'},
    {hl: 'ms', gl: 'my'}, {hl: 'hi', gl: 'in'}, {hl: 'pt-br', gl: 'pt'},
    {hl: 'es', gl: 'es'}, {hl: 'it', gl: 'it'}, {hl: 'uk', gl: 'ua'}];
let l = locals.length
console.log(l)
for (let key in locals) {
    setTimeout(get_gameInfo, 1000 + l * 2000, new Date(), locals[key], l);
    l--
}

function get_gameInfo(timeIs, local, l) {
    console.log(timeIs, local, l)
    if (l === 0) {
        process.exit(0)
    }
}