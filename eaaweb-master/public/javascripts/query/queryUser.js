

mysql=require('mysql');
display=require('../display/displayUser');

var db_config={
   host:'localhost',     
   user:'root',
   password:'sheis9Ke',
   database:'emergencyAssistantApp'     
};


exports.validateUser=function(req, res){
    
    var sql='SELECT username FROM userAccount '+
                    'WHERE username='+mysql.escape(req.query.username);  
   
    var connection=mysql.createConnection(db_config);
    connection.query(sql,
                    function(error, rows){
                        connection.end();
                    
                        if(error){
                            console.log('validate user error: ' + error);   
                        }else{
                            if(rows.length == 0){
                                res.json({exit:false});                                                            
                            }else{
                                res.json({exist:true});                                
                            }
                        }
                    }                        
    );
}

exports.addUserAccount=function(req, res){
    
    var value=[ mysql.escape(req.body.username),
                mysql.escape(req.body.password),
                mysql.escape(req.body.email),
                mysql.escape(req.body.role),
                mysql.escape(req.body.agencyPhoneNumber),
                mysql.escape(req.body.name)   
    ];         
    var sql='INSERT INTO userAccount Values('+
                value[0]+', '+
                value[1]+', '+
                value[2]+', '+ 
                value[3]+', '+
                value[4]+', '+
                value[5]+')';
    
    var connection=mysql.createConnection(db_config);    
    connection.query(sql,
                    function (error) {  
                        connection.end();                                          
                      
                        if(error){ 
                            console.log('addUser error: ' + error);                                          
                        }else{
                            res.json({result:true});
                        }
                    }
    );     
}; 
 
exports.searchUser=function(req, res){
     
    var sql='SELECT username, name, email '+
                'FROM userAccount, agency '+  
                    'WHERE agency.agencyPhoneNumber='+
                            'userAccount.agencyPhoneNumber ';

    if(req.query.searchCriteria=='agencyName'){    
        sql+='AND agency.agencyName='+mysql.escape(req.query.searchText);
    }else{
        sql+='AND agency.agencyPhoneNumber='+mysql.escape(req.query.searchText);
    }
    console.log('search user sql '+sql);
    var connection=mysql.createConnection(db_config);
    connection.query(sql,
                    function(error, rows){
                        connection.end();

                        if(error){
                            console.log('searchUser error: ' + error);
                        }else{
                            console.log('search user length '+rows.length);
                            res.json(rows);    
                        }
                    }                        
    );
}

exports.getUserDetail=function(req, res){

    var sql='SELECT * FROM userAccount '
                            + 'WHERE username='+mysql.escape(req.query.username);
//req.params.username
    console.log('username '+req.query.username);
    var connection=mysql.createConnection(db_config);
    connection.query(sql,
                    function(error, rows){
                        connection.end();

                        if(error){                                                            
                            console.log('getUserDetail error: ' + error);                                
                        }else{
                            res.json(rows[0]);
                        }
                    }
    );
}

exports.updateUserAccount=function(req, res){
    
    var value=[ mysql.escape(req.body.username),
                mysql.escape(req.body.password),
                mysql.escape(req.body.email),
                mysql.escape(req.body.role),
                mysql.escape(req.body.agencyPhoneNumber),
                mysql.escape(req.body.name)   
    ];         
    var sql='UPDATE userAccount SET '+
                'username='+value[0]+', '+
                'password='+value[1]+', '+
                'email='+value[2]+', '+ 
                'role='+value[3]+', '+
                'agencyPhoneNumber='+value[4]+', '+
                'name='+value[5]+' '+
                    'WHERE username='+mysql.escape(req.body.currentUsername);
   
   console.log('update '+sql);
    
    var connection = mysql.createConnection(db_config);    
    connection.query(sql,
                    function (error) {  
                        connection.end();           
                                                       
                        if(error){                                         
                            console.log('updateUserAccount error: ' + error);                                
                        }else{                                 
                            res.json({result : 'sucess'});
                        }
                    }
    );     
}; 

exports.deleteAccount=function(req, res){
    
    var sql='DELETE FROM userAccount '+
                    'WHERE username='+mysql.escape(req.body.username);
    
    var connection = mysql.createConnection(db_config);    
    connection.query(sql,
                    function (error) {  
                        connection.end();           
                                                       
                        if(error){                                         
                            console.log('Delete UserAccount error: ' + error);                                
                        }else{                                 
                            res.json({result : 'sucess'});
                        }
                    }
    );     
}; 

 
