const { src, dest, watch, series, parallel } = require('gulp');

//CSS y SASS
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cssnano =require('cssnano');

//Imagenes
const squoosh = require('gulp-libsquoosh');

function css(done){
    //COMPILAR SASS
    //Pasos: 1- Identificar archivo,  2- Compilarla, 3- Guardar el CSS
    
    src('src/scss/app.scss') //1
        .pipe(sourcemaps.init()) //Para el sourcemaps
        .pipe( sass())//2
        //.pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.')) //Para el sourcemaps
        .pipe(dest('build/css') )
    done(); 
}

function imagenes(){
    return src('src/img/**/*')//todos los archivos que esten en la carpeta src/img
        .pipe(squoosh())
        .pipe(dest('build/img'));
}

function webpAvif() { 
    return src('src/img/**/*.{png,jpg}')
    .pipe(squoosh({
        webp: {},
        avif: {},
    }))
    .pipe(dest('build/img'))
}

function dev(){
    watch('src/scss/**/*.scss',css); //compilar los otros archivos _xx.scss
    //watch('src/scss/app.scss', css);
    watch('src/img/**/*', imagenes);
}

function tareaDefault(){
    console.log("Soy la tarea por default");
}

exports.css = css;
exports.dev =dev;
exports.webpAvif = webpAvif;
exports.imagenes = imagenes;


//Default existe en gulp, para realizar multiples tareas al mismo tiempo. :)
exports.default = series(imagenes, webpAvif, css, dev); //recomendacion: dejar watch hasta el final

//series- Tareas en serie, se ejecuta una hasta que finaliza la siguiente
//parallel- Tareas inician en paralelo