
//remove mysql
var mysql=require('mysql');
var queryStat=require('../public/javascripts/query/queryStat');
var queryStatEmployee=require('../public/javascripts/query/queryStatEmployee');

var db_config={
   host:'localhost',     
   user:'root',
   password:'sheis9Ke',
   database:'emergencyAssistantApp'     
};

exports.filterCategory=function(req, res){

    var sql='SELECT DISTINCT( category ) FROM agency, emergencyData '+ 
                                                'WHERE agency.agencyPhoneNumber=emergencyData.agencyPhoneNumber';
        
    var connection=mysql.createConnection(db_config);    
    connection.query(sql,
                        function (error, rows) {  
                            connection.end();                                          
                            
                            if(error){
                                console.log('Filter Category error: ' + error);
                            }
                            else{
                               res.json(rows);
                            }                                          
                        }
    );     
}

exports.filterCountry=function(req, res){

    var sql='SELECT DISTINCT( country ) FROM agency, emergencyData '+ 
                                            'WHERE category='+mysql.escape(req.query.category)+' '+  
                                                    'AND agency.agencyPhoneNumber=emergencyData.agencyPhoneNumber';
        
    var connection=mysql.createConnection(db_config);    
    connection.query(sql,
                        function (error, rows) {  
                            connection.end();                                          
                            
                            if(error){
                                console.log('Filter Country error: ' + error);
                            }
                            else{
                               res.json(rows);
                            }                                          
                        }
    );     
}

exports.filterState=function(req, res){

    var sql='SELECT DISTINCT( state ) '+
                    'FROM agency, emergencyData '+
                            'WHERE category='+mysql.escape(req.query.category)+' '+
                                    'AND country='+mysql.escape(req.query.country)+' '+
                                    'AND agency.agencyPhoneNumber=emergencyData.agencyPhoneNumber';
                                                          
    var connection=mysql.createConnection(db_config);    
    connection.query(sql,
                        function (error, rows) {  
                            connection.end();                                          
                            
                            if(error){
                                console.log('Filter State error: ' + error);
                            }
                            else{
                               res.json(rows);
                            }                                          
                        }
    );     
}

exports.filterCity=function(req, res){

    var sql='SELECT DISTINCT( city ) '+
                    'FROM agency, emergencyData '+
                            'WHERE category='+mysql.escape(req.query.category)+' '+
                                    'AND country='+mysql.escape(req.query.country)+' '+
                                    'AND state='+mysql.escape(req.query.state)+' '+          
                                    'AND agency.agencyPhoneNumber=emergencyData.agencyPhoneNumber';

    var connection=mysql.createConnection(db_config);    
    connection.query(sql,
                        function (error, rows) {  
                            connection.end();                                          
                            
                            if(error){
                                console.log('Filter City error: ' + error);
                            }
                            else{
                               res.json(rows);
                            }                                          
                        }
    );     
}

exports.filterAgency=function(req, res){

    var sql='SELECT DISTINCT( agency.agencyPhoneNumber ), agencyName '+
                    'FROM agency, emergencyData '+
                            'WHERE category='+mysql.escape(req.query.category)+' '+
                            'AND country='+mysql.escape(req.query.country)+' '+
                            'AND state='+mysql.escape(req.query.state)+' '+
                            'AND city='+mysql.escape(req.query.city)+' '+          
                            'AND agency.agencyPhoneNumber=emergencyData.agencyPhoneNumber';

    var connection=mysql.createConnection(db_config);    
    connection.query(sql,
                        function (error, rows) {  
                            connection.end();                                          
                            
                            if(error){
                                console.log('Filter Agency error: ' + error);
                            }
                            else{
                               res.json(rows);
                            }                                          
                        }
    );     
}

exports.agencyStat=function(req, res){

    queryStat.initialize(req, res);
}

exports.employeeStat=function(req, res){
    
    queryStatEmployee.initializeEmployee(req, res);
}

exports.agencyEmergency=function(req, res){
    
    var sql='SELECT clientPhoneNumber, DATE_FORMAT(time, "%Y-%m-%d %H:%i:%s") time, resolved, outsideHome, timeElapsed, hasApplication '+
                    'FROM emergencyData WHERE emergencyType='+mysql.escape(req.query.emergencyType)+' '+
                            'AND agencyPhoneNumber='+mysql.escape(req.query.agencyPhoneNumber);          

    var connection=mysql.createConnection(db_config);    
    connection.query(sql,
                        function (error, rows) {  
                            connection.end();                                          
                            
                            if(error){
                                console.log('Agency Emergency error: ' + error);
                            }
                            else{
                                res.json({ 
                                            emergencyList : rows 
                                        });
                            }                                          
                        }
    );     
}


exports.employeeEmergency=function(req, res){
    
    var sql='SELECT clientPhoneNumber, DATE_FORMAT(time, "%Y-%m-%d %H:%i:%s") time, resolved, outsideHome, timeElapsed, hasApplication '+
                'FROM emergencyData WHERE emergencyType='+mysql.escape(req.query.emergencyType)+' '+
                                        'AND agencyPhoneNumber='+mysql.escape(req.query.agencyPhoneNumber)+' '+                                              
                                        'AND attendedBy='+mysql.escape(req.query.username);
                                                  
    var connection=mysql.createConnection(db_config);    
    connection.query(sql,
                        function (error, rows) {  
                            connection.end();                                          
                            
                            if(error){
                                console.log('Employee Emergency error: ' + error);
                            }
                            else{
                                res.json({ 
                                            emergencyList : rows 
                                        });
                            }                                          
                        }
    );     
}


exports.emergencyDetail=function(req, res){
    
    var sql='SELECT * FROM emergencyData '+
                    'WHERE clientPhoneNumber='+mysql.escape(req.query.clientPhoneNumber)+' '+
                            'AND time='+mysql.escape(req.query.time);

    
    var connection = mysql.createConnection(db_config);    
    connection.query(sql,
                    function (error, rows) {                                                                       
                        connection.end();         
                          
                        if(error){                            
                            console.log('Stat Emergency Detail: ' + error);
                        }else{ 
                            if(rows.length > 0){                       
                                relayDetail(req, res, rows[0]);
                            }else{
                                res.json(rows[0]);
                            }
                        }
                    }
    ); 
}

function relayDetail(req, res, data){
    
    var sql='SELECT * FROM transferDetail '+
                        'WHERE clientPhoneNumber='+mysql.escape(req.query.clientPhoneNumber)+' '+
                            'AND time='+mysql.escape(req.query.time);   
    
    var connection = mysql.createConnection(db_config);    
    connection.query(sql,
                    function (error, rows) {                                                                       
                        connection.end();         
                          
                        if(error){                            
                            console.log('Stat Relay Detail error: ' + error);
                        }else{                        
                            //only one relay
                            res.json({data : data, transfer : rows[0]});
                        }
                    }
    ); 
}
