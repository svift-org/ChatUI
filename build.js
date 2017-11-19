var UglifyJS = require('uglify-js2'),
  sass = require('node-sass'),
  fs = require('fs')

//SCSS Rendering
fs.writeFileSync(__dirname + "/build/chatUI.css", sass.renderSync({
    data:fs.readFileSync(__dirname + "/src/css/style.scss", 'utf8'),
    outputStyle: 'compressed' 
  }).css,
  'utf8'
)

//JS Building
let files = ['index-d3.js', 'index-jquery.js']
files.forEach(function(file){
  let base = file.split('.'),
  min = UglifyJS.minify([__dirname + "/src/js/"+file], {
    outSourceMap: __dirname + '/build/' + base[0] + '.min.js.map',
    sourceRoot: "http://svift.xyz/src"
  })

  fs.writeFileSync(__dirname + "/build/" + base[0] + ".min.js", min.code, 'utf8')
})

console.log('build complete')