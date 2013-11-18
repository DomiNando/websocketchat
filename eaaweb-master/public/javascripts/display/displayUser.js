

//DISPLAY SIDE
exports.displayResultUser=function(res, rows){
        
    res.render('./admin/user/searchResultUser', {title:'User Search Results', rows:rows});
}

exports.displayDetailUser=function(res, rows){
          
    res.render('./admin/user/viewDetailUser', {title:'User Details', row:rows[0]});
}

exports.displaySearchUser=function(res){

    //may need to pass param
    res.redirect('/search');
}

