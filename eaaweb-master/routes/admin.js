
//remove mysql
var mysql=require('mysql');
var query=require('../public/javascripts/query/queryService');
var queryUser=require('../public/javascripts/query/queryUser');

exports.search=function(req, res){
    
    res.render('./admin/adminHome');
}

exports.searchResult=function(req, res){

    if(req.query.searchType=='service')
        query.searchService(req, res);
    else{
        queryUser.searchUser(req, res);
    }
}

exports.viewDetail=function(req, res){

    query.getServiceDetail(req, res);
}

exports.editService=function(req, res){

    res.render('./admin/service/editService');
}

exports.deleteAgency=function(req, res){
    
    if(req.url =='/update')
        console.log('admin update current agency phone '+req.body.currentAltPhoneNumber);
    else
        console.log('admin delete current agency phone '+req.body.currentAltPhoneNumber);
    query.deleteAgency(req, res);
}

exports.newService=function(req, res){
    
    res.render('./admin/service/newService');    
}

exports.add=function(req, res){

    query.addAgency(req, res);
}

exports.validateAgency=function(req, res){

    query.validateAgency(req, res);
}

//////////User Side
exports.newUser=function(req, res){
       
    res.render('./admin/user/newUser');    
}

exports.addUser=function(req, res){
    
    queryUser.addUserAccount(req, res);
}

exports.viewDetailUser=function(req, res){

    queryUser.getUserDetail(req, res);
}

exports.editUser=function(req, res){

    res.render('./admin/user/editUser');
}

exports.updateUser=function(req, res){
    
    queryUser.updateUserAccount(req, res);
}

exports.deleteUser=function(req, res){
    
    queryUser.deleteAccount(req, res);
}

exports.validateUser=function(req, res){

    queryUser.validateUser(req, res);
}


