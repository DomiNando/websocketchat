

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
exports.initialize=function(req, res){

    columnIndex=0;
                   
    total=new Array();
    averageTime=new Array();
    outside=new Array();
    resolved=new Array();
    hasApplication=new Array();

    var sql='SELECT DISTINCT( emergencyType ) '+
                'FROM emergencyData WHERE agencyPhoneNumber='+mysql.escape(req.query.agencyPhoneNumber);

    //console.log('initialize sql '+sql);
    var connection=mysql.createConnection(db_config);    
    connection.query(sql,
                        function (error, rows) {  
                            connection.end();                                          
                            
                            if(error){                            
                                console.log('initialize error: ' + error);
                            }
                            else{
                                emergencyType=rows;
                                totalEmergency(req, res);
                            }                            
                        }
    );
}; 

function totalEmergency(req, res){
    
    //try catch in case of wrong phone number or avoid calling this method if phone is not found              
    var sql='SELECT COUNT( * ) AS total '+ 
                    'FROM emergencyData WHERE agencyPhoneNumber='+mysql.escape(req.query.agencyPhoneNumber)+' '+
                            'AND emergencyType="'+emergencyType[columnIndex].emergencyType+'"'; 

    var connection=mysql.createConnection(db_config);    
    connection.query(sql,
                        function (error, rows) {  
                            connection.end();                                          
                            
                            if(error){                            
                                console.log('totalEmergency error: ' + error);
                            }
                            else{     
                                total[columnIndex]=rows[0].total;
                                timeEmergency(req, res);
                            }                            
                        }
    );
}; 


function timeEmergency(req, res){
                   
    var sql='SELECT AVG( timeElapsed ) AS averageTime '+ 
                    'FROM emergencyData WHERE agencyPhoneNumber='+mysql.escape(req.query.agencyPhoneNumber)+' '+
                            'AND emergencyType="'+emergencyType[columnIndex].emergencyType+'"';

    var connection=mysql.createConnection(db_config);    
    connection.query(sql,
                        function (error, rows) {  
                            connection.end();                                          
                            
                            if(error){                            
                                console.log('timeEmergency error: ' + error);
                            }
                            else{                                            
                                averageTime[columnIndex]=rows[0].averageTime;
                                outsideEmergency(req, res);
                            }                            
                        }
    );
}; 

function outsideEmergency(req, res){
                   
    var sql='SELECT COUNT( * ) AS outside '+ 
                    'FROM emergencyData WHERE agencyPhoneNumber='+mysql.escape(req.query.agencyPhoneNumber)+' '+
                            'AND emergencyType="'+emergencyType[columnIndex].emergencyType+'"'+
                            'AND outsideHome="yes"';

    var connection=mysql.createConnection(db_config);    
    connection.query(sql,
                        function (error, rows) {  
                            connection.end();                                          
                            
                            if(error){                            
                                console.log('outsideEmergency error: ' + error);
                            }
                            else{                                            
                                outside[columnIndex]=rows[0].outside;
                                resolvedEmergency(req, res);
                            }                            
                        }
    );
};

 
function resolvedEmergency(req, res){
                   
    var sql='SELECT COUNT( * ) AS resolved '+ 
                    'FROM emergencyData WHERE agencyPhoneNumber='+mysql.escape(req.query.agencyPhoneNumber)+' '+
                            'AND emergencyType="'+emergencyType[columnIndex].emergencyType+'"'+
                            'AND resolved="yes"';

    var connection=mysql.createConnection(db_config);    
    connection.query(sql,
                        function (error, rows) {  
                            connection.end();                                          
                            
                            if(error){                            
                                console.log('resolvedEmergency error: ' + error);
                            }
                            else{                                            
                                resolved[columnIndex]=rows[0].resolved;
                                hasApplicationEmergency(req, res);
                            }                            
                        }
    );
};

function hasApplicationEmergency(req, res){
                   
    var sql='SELECT COUNT( * ) AS hasApplication '+ 
                    'FROM emergencyData WHERE agencyPhoneNumber='+mysql.escape(req.query.agencyPhoneNumber)+' '+
                            'AND emergencyType="'+emergencyType[columnIndex].emergencyType+'"'+
                            'AND hasApplication="yes"';

    var connection=mysql.createConnection(db_config);    
    connection.query(sql,
                        function (error, rows) {  
                            connection.end();                                          
                            
                            if(error){                            
                                console.log('hasApplication error: ' + error);
                            }
                            else{                                            
                                hasApplication[columnIndex]=rows[0].hasApplication;
                                iterate(req, res);
                            }                            
                        }
    );
};

function iterate(req, res){
    
    if(++columnIndex < emergencyType.length){
        totalEmergency(req, res);   
    }
    else{
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

function displayTable(){
    
    console.log('total');
    for(var index=0; index < total.length; index++)
        console.log(index +'-----'+ total[index]);

    console.log('averageTime');
    for(var index=0; index < averageTime.length; index++)
        console.log(index +'-----'+ averageTime[index]);

    console.log('outside');
    for(var index=0; index < outside.length; index++)
        console.log(index +'-----'+ outside[index]);

    console.log('resolved');
    for(var index=0; index < resolved.length; index++)
        console.log(index +'-----'+ resolved[index]);
    
    console.log('hasApplication');
    for(var index=0; index < hasApplication.length; index++)
        console.log(index +'-----'+ hasApplication[index]);
    
    console.log('employee');
    for(var index=0; index < employee.length; index++)
        console.log(index +'-----'+ employee[index]);
}
