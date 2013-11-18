

//DISPLAY SIDE
exports.result=function(res, rows){
        
    res.render('./admin/service/searchResultService', {title:'Service Search Results', rows:rows});
}

exports.detail=function(res, rows){
          
    res.render('./admin/service/viewDetailService', {title:'Service Details', row:rows[0]});
}

exports.search=function(res){

    //may need to pass param
    res.redirect('/search');
}



