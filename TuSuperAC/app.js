var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
let session = require('express-session');

var indexRouter = require('./routes/index');
let categoryRouter = require('./routes/category');
let aboutRouter = require('./routes/about');
let productDetailRouter = require('./routes/ProductDetail');
let productCartRouter = require('./routes/productCart');
let loginClientRouter = require('./routes/loginClient');
let loginAdminRouter = require('./routes/loginAdmin');
let registerRouter = require('./routes/register');
let logoutRouter = require('./routes/logout');
let logoutAdmin = require('./routes/logoutAdmin');
let productRouter = require('./routes/product');
let subCategoryRouter = require('./routes/subCategory');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true })); // Para manejar formularios con datos codificados en URL
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'loginecommercer', // cambiá por una clave segura
  resave: false,
  saveUninitialized: false
}));


/*// Middleware para guardar la última película visitada en la sesión
app.use(function(req, res,next){
  console.log(req.cookies.lastMovie);
  if(req.session.lastMovie!== undefined){
    res.locals.lastMovie=req.session.lastMovie;
  }
  return next();
});*/// Middleware para exponer sesiones a las vistas
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null; // para clientes (loginClient)
  res.locals.admin = req.session.admin || null;     // para administrativos (loginAdmin)
  next();
});



app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/productDetail', productDetailRouter);
app.use('/productCart', productCartRouter);
app.use('/loginClient', loginClientRouter);
app.use('/loginAdmin', loginAdminRouter);
app.use('/registerClient', registerRouter);
app.use('/logout', logoutRouter);
app.use('/logoutAdmin', logoutAdmin);
app.use('/products', productRouter);
app.use('/category', categoryRouter);
app.use('/subCategory', subCategoryRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
