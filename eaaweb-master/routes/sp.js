

var mysql=require('mysql');

var db_config={
   host:'localhost',     
   user:'root',
   password:'sheis9Ke',
   database:'emergencyAssistantApp'     
};

exports.retrieveRelay=function(req, res){
    
    var sql='SELECT * FROM emergencyData '+
                    'WHERE onRelay="yes" AND clientPhoneNumber='+mysql.escape(req.query.clientPhoneNumber);

    //console.log('retrieve relay'); 
    var connection = mysql.createConnection(db_config);    
    connection.query(sql,
                    function (error, rows) {                                                                       
                        connection.end();         
                          
                        if(error){                            
                            console.log('Retrieve Relay error: ' + error);
                        }else{                        
                            if(rows.length > 0)
                                retrieveRelayDetail(req, res, rows[0]);
                            else
                                retrieveCoordinate(req, res);
                        }
                    }
    ); 
}

function retrieveRelayDetail(req, res, data){
    
    var sql='SELECT * FROM transferDetail '+
                        'WHERE clientPhoneNumber='+mysql.escape(req.query.clientPhoneNumber)+' '+
                            'AND onRelay="yes"'; 
    //console.log('retrieve relay detail'); 
    var connection = mysql.createConnection(db_config);    
    connection.query(sql,
                    function (error, rows) {                                                                       
                        connection.end();         
                          
                        if(error){                            
                            console.log('Retrieve Relay Detail error: ' + error);
                        }else{                        
                            res.header('Access-Control-Allow-Origin', '*');                            
                            res.json( {relay : data, relayDetail : rows[0]} );                            
                        }
                    }
    ); 
}

function retrieveCoordinate(req, res){
    
    var sql='SELECT latitude, longitude FROM deviceAccount '+
                        'WHERE clientPhoneNumber='+mysql.escape(req.query.clientPhoneNumber);
    
    //console.log('coordinate');    
    var connection = mysql.createConnection(db_config);    
    connection.query(sql,
                    function (error, rows) {                                                                       
                        connection.end();         
                          
                        if(error){                            
                            console.log('Retrieve Coordinate error: ' + error);
                        }else{                                                                                
                            res.header('Access-Control-Allow-Origin', '*');                            
                            //relay jason name convention
                            res.json({relay : rows[0]});                            
                        }
                    }
    ); 
}

exports.saveEmergency=function(req, res){

    //console.log('old phone '+req.body.oldAgencyPhoneNumber);    
    if(req.body.oldAgencyPhoneNumber != '')
        deleteRelay(req, res, 'no');
    else
        calcTimeElapsed(req, res, 'no');
}

exports.relayEmergency=function(req, res){
   
    deleteRelay(req, res, 'yes');    
}

function deleteRelay(req, res, onRelay){
    
    var sql='DELETE FROM emergencyData '+
                        'WHERE clientPhoneNumber='+mysql.escape(req.body.clientPhoneNumber)+' '+
                            'AND onRelay="yes"';   
   
    //console.log('delete relay '+sql); 
    var connection = mysql.createConnection(db_config);    
    connection.query(sql,
                    function (error, rows) {                                                                       
                        connection.end();         
                          
                        if(error){                            
                            console.log('Delete Relay error: ' + error);
                        }else{                        
                            deleteRelayDetail(req, res, onRelay);
                        }
                    }
    ); 
}

function deleteRelayDetail(req, res, onRelay){
    
    var sql='DELETE FROM transferDetail '+
                        'WHERE clientPhoneNumber='+mysql.escape(req.body.clientPhoneNumber)+' '+
                            'AND onRelay="yes"';   

    var connection = mysql.createConnection(db_config);    
    connection.query(sql,
                    function (error, rows) {                                                                       
                        connection.end();         
                          
                        if(error){                            
                            console.log('Delete Relay Detail error: ' + error);
                        }else{                        
                            saveRelay(req, res, onRelay);
                        }
                    }
    ); 
}

function saveRelay(req, res, onRelay){
   
    var sql='INSERT INTO transferDetail Values('+
                            mysql.escape(req.body.clientPhoneNumber)+', '+
                            mysql.escape(req.body.timeStamp)+', '+
                            mysql.escape(req.body.reason)+', '+
                            mysql.escape(req.body.oldAgencyPhoneNumber)+', '+
                            mysql.escape(req.body.newAgencyPhoneNumber)+', "'+
                            onRelay+'")';
    
    //console.log('save relay sql ' +  sql);
    var connection = mysql.createConnection(db_config);    
    connection.query(sql,
                    function (error) {                                                                       
                        connection.end();         
                          
                        if(error){                            
                            console.log('Save Relay error: ' + error);
                        }else{                                                    
                            calcTimeElapsed(req, res, onRelay);                            
                        }
                    }
    ); 
}

function calcTimeElapsed(req, res, onRelay){
   
    var sql='SELECT TIMESTAMPDIFF( MINUTE, "2013-10-17 0:0:0", '+mysql.escape(req.body.timeStamp)+' ) AS timeElapsed';

    //console.log('save relay sql ' +  sql);
    var connection = mysql.createConnection(db_config);    
    connection.query(sql,
                    function (error, rows) {                                                                       
                        connection.end();         
                          
                        if(error){                            
                            console.log('Calc Time Elapsed error: ' + error);
                        }else{                                                    
                            saveData(req, res, onRelay, rows[0].timeElapsed);                            
                        }
                    }
    ); 
}

function saveData(req, res, onRelay, timeElapsed){
    
    var sql='INSERT INTO emergencyData Values('+
                            mysql.escape(req.body.clientPhoneNumber)+', '+
                            mysql.escape(req.body.timeStamp)+', '+
                            mysql.escape(req.body.resolved)+', '+
                            mysql.escape(req.body.emergencyType)+', '+
                            mysql.escape(req.body.emergencyDetails)+', '+
                            mysql.escape(req.body.clientName)+', '+
                            mysql.escape(req.body.clientAddress)+', '+
                            mysql.escape(req.body.latitude)+', '+
                            mysql.escape(req.body.longitude)+', '+
                            mysql.escape(req.body.outsideHome)+', '+
                            mysql.escape(req.body.agencyPhoneNumber)+', '+
                            mysql.escape(req.body.attendedBy)+', '+
                            mysql.escape(req.body.timeCompleted)+', '+
                            timeElapsed+', '+
                            mysql.escape(req.body.hasApplication)+', "'+
                            onRelay+'")';

    console.log('save data ' +  sql);
    var connection = mysql.createConnection(db_config);    
    connection.query(sql,
                    function (error) {                                                                       
                        connection.end();         
                          
                        if(error){                            
                            console.log('Save Emergency error: ' + error);
                            
                            res.json({result : 'Fail'});                            
                        }else{       
                            res.json({result : 'Sucess'});                           
                        }
                    }
    );
}

exports.historyResult=function(req, res){
   
    var sql='SELECT clientName, clientPhoneNumber, attendedBy, DATE_FORMAT(time, "%Y-%m-%d %H:%i:%s") time FROM emergencyData '+
                    'WHERE time >= DATE('+mysql.escape(req.query.time)+') AND time < '+
                            'DATE(DATE_ADD('+mysql.escape(req.query.time)+', INTERVAL 1 DAY)) '+
                                'AND agencyPhoneNumber='+mysql.escape(req.query.agencyPhoneNumber);   

    //console.log('history ' + sql); 
    var connection = mysql.createConnection(db_config);    
    connection.query(sql,
                    function (error, rows) {                                                                       
                        connection.end();         
                          
                        if(error){                            
                            console.log('History error: ' + error);
                        }else{                        
                            res.json(rows);                                 
                        }
                    }
    ); 
}

exports.retrieveHistory=function(req, res){
    
    var sql='SELECT * FROM emergencyData '+
                    'WHERE clientPhoneNumber='+mysql.escape(req.query.clientPhoneNumber)+' '+
                            'AND time='+mysql.escape(req.query.time);

    console.log('retrieve history '); 
    var connection = mysql.createConnection(db_config);    
    connection.query(sql,
                    function (error, rows) {                                                                       
                        connection.end();         
                          
                        if(error){                            
                            console.log('Retrieve History: ' + error);
                        }else{ 
                            if(rows.length > 0){                       
                                retrieveHistoryRelay(req, res, rows[0]);
                            }else{
                                res.json({data : rows[0]});
                            }
                        }
                    }
    ); 
}

function retrieveHistoryRelay(req, res, data){
    
    var sql='SELECT * FROM transferDetail '+
                        'WHERE clientPhoneNumber='+mysql.escape(req.query.clientPhoneNumber)+' '+
                            'AND time='+mysql.escape(req.query.time);   
    
    var connection = mysql.createConnection(db_config);    
    connection.query(sql,
                    function (error, rows) {                                                                       
                        connection.end();         
                          
                        if(error){                            
                            console.log('Retrieve History Relay error: ' + error);
                        }else{
                            //only one relay row                        
                            res.json({data : data, detail : rows[0]});
                        }
                    }
    ); 
}

