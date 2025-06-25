
let loginController = {
    index: function(req, res){
        let movieList = ['Rocky', 'Batman', 'Barbie', 'Iron Man'];
        return res.render('login', { title: 'Movies', listaPelis: movieList});
    },
    show: function(req, res){
       // return res.send(`Estamos en el detalle de la película: ${req.params.id}`)
    },
    create: function(req, res){
      //  return res.render('movieNew', { title: 'nueva pelicula' });
    },
    search:function(req, res){
      //  let seachTerm = req.query.search;// El seach es el name del input en el formulario
      //  return res.render('searchResults',{title:"Resultados de búsqueda",seachTerm:seachTerm})
    },
    store: function(req, res){

     //   let info = req.body;
     //   req.session.lastMovie = info;
    //    res.cookie('lastMovie', info.title, { maxAge: 1000 * 60 * 5 });
        //return res.send(req.session);
       // return res.send(info);
     //   return  res.redirect('/');
    }

}


module.exports = loginController