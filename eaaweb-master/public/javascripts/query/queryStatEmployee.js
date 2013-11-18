
mysql=require('mysql');
displayStat=require('../display/displayStat');

var db_config={
   host:'localhost',     
   user:'root',
   password:'sheis9Ke',
   database:'emergencyAssistantApp'     
};

//problem if multiple request at same time
var emergencyType='';
var columnIndex=0;

var total='';
var averageTime='';
var outside='';
var resolved='';
var hasApplication='';

var employee='';

//may have problem with method name
exports.initializeEmployee=function(req, res){

    columnIndex=0;
                   
    total=new Array();
    averageTime=new Array();
    outside=new Array();
    resolved=new Array();
    hasApplication=new Array();

    var sql='SELECT DISTINCT( emergencyType ) '+
                'FROM emergencyData WHERE agencyPhoneNumber='+mysql.escape(req.query.agencyPhoneNumber)+' '+
                    'AND attendedBy='+mysql.escape(req.query.username);

    var connection=mysql.createConnection(db_config);    
    connection.query(sql,
                        function (error, rows) {  
                            connection.end();                                          
                            
                            if(error){                            
                                console.log('initializeEmployee error: ' + error);
                            }
                            else{
                                emergencyType=rows;
                                totalEmergencyEmployee(req, res);
                            }                            
                        }
    );
}; 

function totalEmergencyEmployee(req, res){
                   
    var sql='SELECT COUNT( * ) AS total '+ 
                    'FROM emergencyData WHERE agencyPhoneNumber='+mysql.escape(req.query.agencyPhoneNumber)+' '+
                            'AND emergencyType="'+emergencyType[columnIndex].emergencyType+'" '+
                            'AND attendedBy='+mysql.escape(req.query.username);

    var connection=mysql.createConnection(db_config);    
    connection.query(sql,
                        function (error, rows) {  
                            connection.end();                                          
                            
                            if(error){                            
                                console.log('totalEmergency error: ' + error);
                            }
                            else{     
                                total[columnIndex]=rows[0].total;
                                timeEmergencyEmployee(req, res);
                            }                            
                        }
    );
}; 


function timeEmergencyEmployee(req, res){
                   
    var sql='SELECT AVG( timeElapsed ) AS averageTime '+ 
                    'FROM emergencyData WHERE agencyPhoneNumber='+mysql.escape(req.query.agencyPhoneNumber)+' '+
                            'AND emergencyType="'+emergencyType[columnIndex].emergencyType+'" '+
                            'AND attendedBy='+mysql.escape(req.query.username);

    var connection=mysql.createConnection(db_config);    
    connection.query(sql,
                        function (error, rows) {  
                            connection.end();                                          
                            
                            if(error){                            
                                console.log('timeEmergency error: ' + error);
                            }
                            else{                                            
                                averageTime[columnIndex]=rows[0].averageTime;
                                outsideEmergencyEmployee(req, res);
                            }                            
                        }
    );
}; 

function outsideEmergencyEmployee(req, res){
                   
    var sql='SELECT COUNT( * ) AS outside '+ 
                    'FROM emergencyData WHERE agencyPhoneNumber='+mysql.escape(req.query.agencyPhoneNumber)+' '+
                            'AND emergencyType="'+emergencyType[columnIndex].emergencyType+'" '+
                            'AND outsideHome="yes" '+ 
                            'AND attendedBy='+mysql.escape(req.query.username);

    var connection=mysql.createConnection(db_config);    
    connection.query(sql,
                        function (error, rows) {  
                            connection.end();                                          
                            
                            if(error){                            
                                console.log('outsideEmergency error: ' + error);
                            }
                            else{                                            
                                outside[columnIndex]=rows[0].outside;
                                resolvedEmergencyEmployee(req, res);
                            }                            
                        }
    );
};

 
function resolvedEmergencyEmployee(req, res){
                   
    var sql='SELECT COUNT( * ) AS resolved '+ 
                    'FROM emergencyData WHERE agencyPhoneNumber='+mysql.escape(req.query.agencyPhoneNumber)+' '+
                            'AND emergencyType="'+emergencyType[columnIndex].emergencyType+'" '+
                            'AND resolved="yes" '+
                            'AND attendedBy='+mysql.escape(req.query.username);

    var connection=mysql.createConnection(db_config);    
    connection.query(sql,
                        function (error, rows) {  
                            connection.end();                                          
                            
                            if(error){                            
                                console.log('resolvedEmergency error: ' + error);
                            }
                            else{                                            
                                resolved[columnIndex]=rows[0].resolved;
                                hasApplicationEmergencyEmployee(req, res);
                            }                            
                        }
    );
};

function hasApplicationEmergencyEmployee(req, res){
                   
    var sql='SELECT COUNT( * ) AS hasApplication '+ 
                    'FROM emergencyData WHERE agencyPhoneNumber='+mysql.escape(req.query.agencyPhoneNumber)+' '+
                            'AND emergencyType="'+emergencyType[columnIndex].emergencyType+'" '+
                            'AND hasApplication="yes" '+
                            'AND attendedBy='+mysql.escape(req.query.username);

    var connection=mysql.createConnection(db_config);    
    connection.query(sql,
                        function (error, rows) {  
                            connection.end();                                          
                            
                            if(error){                            
                                console.log('hasApplication error: ' + error);
                            }
                            else{                                            
                                hasApplication[columnIndex]=rows[0].hasApplication;
                                iterateEmployee(req, res);
                            }                            
                        }
    );
};

function iterateEmployee(req, res){
    
    if(++columnIndex < emergencyType.length){
        totalEmergencyEmployee(req, res);   
    }
    else{
        //call display method
        agencyEmployee(req, res);
    }
}

function agencyEmployee(req, res){
                   
    var sql='SELECT DISTINCT( username ), name '+ 
                    'FROM emergencyData, userAccount '+
                        'WHERE userAccount.agencyPhoneNumber='+mysql.escape(req.query.agencyPhoneNumber)+' '+
                            'AND userAccount.agencyPhoneNumber=emergencyData.agencyPhoneNumber '+
                            'AND attendedBy=username';

    var connection=mysql.createConnection(db_config);    
    connection.query(sql,
                        function (error, rows) {  
                            connection.end();                                          
                            
                            if(error){                            
                                console.log('agencyEmployee error: ' + error);
                            }
                            else{                                            
                                employee=rows;
                        
                                res.json({
                                            username : req.query.username,//difference with previous
                                            agencyPhoneNumber : req.query.agencyPhoneNumber,
                                            emergencyType : emergencyType,
                                            total : total,
                                            averageTime : averageTime,
                                            outside : outside,
                                            resolved : resolved,
                                            hasApplication : hasApplication,
                                            employee : employee                                            
                                        });
                            }                            
                        }
    );
};
