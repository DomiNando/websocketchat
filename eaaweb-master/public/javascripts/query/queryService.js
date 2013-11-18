

mysql=require('mysql');

var db_config={
   host:'localhost',     
   user:'root',
   password:'sheis9Ke',
   database:'emergencyAssistantApp'     
};

exports.validateAgency=function(req, res){
    
    var sql='SELECT agencyPhoneNumber FROM agency '+
                    'WHERE agencyPhoneNumber='+mysql.escape(req.query.agencyPhoneNumber);  
   
    var connection=mysql.createConnection(db_config);
    connection.query(sql,
                    function(error, rows){
                        connection.end();
                    
                        if(error){
                            console.log('validate agency error: ' + error);   
                        }else{
                            if(rows.length==0){
                                res.json({exist:false});                                                            
                            }else{
                                res.json({exist:true});                                
                            }
                        }
                    }                        
    );
}

exports.addAgency=function(req, res){

    reAddAgency(req, res);    
}; 

function reAddAgency(req, res){
    
    var value=[ mysql.escape(req.body.altPhoneNumber0),
                mysql.escape(req.body.agencyName),
                mysql.escape(req.body.category),
                mysql.escape(req.body.city),
                mysql.escape(req.body.state),
                mysql.escape(req.body.country)   
    ];         
    var sql='INSERT INTO agency Values( '+
                value[0]+', '+
                value[1]+', '+
                value[2]+', '+ 
                value[3]+', '+
                value[4]+', '+
                value[5]+' )';
    
    var connection=mysql.createConnection(db_config);    
    connection.query(sql,
                        function (error) {  
                            connection.end();                                          
                            
                            if(error){                            
                                console.log('addAgency function error: ' + error);
                            }else{
                                var indexArea=0;
                                addAlternativeArea(req, res, indexArea);                                                               
                            }
                        }
    );     
}; 

function addAlternativeArea(req, res, index){
   
    var sql='INSERT INTO alternativeArea Values( '+
                mysql.escape(req.body.altPhoneNumber0)+', '+
                mysql.escape(req.param('altArea'+index))+' )';

    var connection = mysql.createConnection(db_config);    
    connection.query(sql,
                    function (error) {                                                                       
                        connection.end();         
                          
                        if(error){                            
                            console.log('addAltArea error: ' + error);
                        }else{                        
                            if( index < req.body.altAreaCount ){
                                index++;
                                addAlternativeArea(req, res, index);
                            }else{
                                var indexPhone=0;
                                addAlternativePhone(req, res, indexPhone);        
                            }
                        }
                    }
    );     
}
       
function addAlternativePhone(req, res, index){
 
    var sql='INSERT INTO alternativePhoneNumber Values( '+
                mysql.escape(req.body.altPhoneNumber0)+', '+
                mysql.escape(req.param('altPhoneNumber'+index))+' )';

    var connection = mysql.createConnection(db_config);    
    connection.query(sql,
                    function (error) {                                                                       
                        connection.end();         
                          
                        if(error){                            
                            console.log('Add Alternative Phone error: ' + error);
                        }else{                        
                            if( index < req.body.altPhoneCount ){
                                index++;
                                addAlternativePhone(req, res, index);
                            }else{                                       
                                if(req.body.category=='hospital')
                                    addCoordinate(req, res);
                                else
                                    res.json({result:true});                            
                            }
                        }
                    }
    );     
}

function addCoordinate(req, res){
    
    var sql='INSERT INTO coordinate Values( '+
                mysql.escape(req.body.altPhoneNumber0)+', '+
                mysql.escape(req.body.latitude)+', '+
                mysql.escape(req.body.longitude)+' )';

    var connection = mysql.createConnection(db_config);    
    connection.query(sql,
                    function (error) {                                                                       
                        connection.end();         
                          
                        if(error){                            
                            console.log('Add Alternative Phone error: ' + error);
                        }else{                        
                            res.json({result:true});                            
                        }
                    }
    );             
}

exports.searchService=function(req, res){

    var sql='SELECT agencyPhoneNumber, agencyName, category '+
                'FROM agency ';  
        
    if(req.query.searchCriteria=='agencyName'){    
        sql+='WHERE agencyName=' + mysql.escape(req.query.searchText) + ' ';
    }else{
        sql+='WHERE agencyPhoneNumber=' + mysql.escape(req.query.searchText) + ' ';
    }
   
    var connection=mysql.createConnection(db_config);
    connection.query(sql,
                    function(error, rows){
                        connection.end();
                    
                        if(error){
                            console.log('search service error: ' + error);   
                        }else{
                            res.json(rows);                                
                        }
                    }                        
    );
}

exports.getServiceDetail=function(req, res){

    var sql='SELECT * FROM agency, alternativePhoneNumber, alternativeArea '+                            
                            'WHERE agency.agencyPhoneNumber=alternativePhoneNumber.agencyPhoneNumber '+
                            'AND agency.agencyPhoneNumber=alternativeArea.agencyPhoneNumber '+ 
                            'AND agency.agencyPhoneNumber='+mysql.escape(req.query.agencyPhoneNumber)+' ';

    var connection=mysql.createConnection(db_config);
    connection.query(sql,
                    function(error, rows){
                        connection.end();

                        if(error){                            
                            console.log('getServiceDetail error: ' + error);
                        }else{
                            getServicePhoneNumber(req, res, rows[0]);
                        }
                    }
    );
}

function getServicePhoneNumber(req, res, detail){

    var sql='SELECT DISTINCT(alternativePhoneNumber.altPhoneNumber) FROM agency, alternativePhoneNumber '+                            
                            'WHERE agency.agencyPhoneNumber=alternativePhoneNumber.agencyPhoneNumber '+
                            'AND agency.agencyPhoneNumber='+mysql.escape(req.query.agencyPhoneNumber)+' ';

    var connection=mysql.createConnection(db_config);
    connection.query(sql,
                    function(error, rows){
                        connection.end();

                        if(error){                            
                            console.log('getServiceDetail error: ' + error);
                        }else{
                            getServiceArea(req, res, detail, rows);
                        }
                    }
    );
}

function getServiceArea(req, res, detail, phone){

    var sql='SELECT DISTINCT(alternativeArea.altArea) FROM agency, alternativeArea '+                            
                            'WHERE agency.agencyPhoneNumber=alternativeArea.agencyPhoneNumber '+ 
                            'AND agency.agencyPhoneNumber='+mysql.escape(req.query.agencyPhoneNumber)+' ';

    var connection=mysql.createConnection(db_config);
    connection.query(sql,
                    function(error, rows){
                        connection.end();

                        if(error){                            
                            console.log('getServiceDetail error: ' + error);
                        }else{
                            if( req.query.category == 'hospital' ){
                                   getCoordinate(req, res, detail, phone, rows);  
                            }else{                                
                                res.json({detail:detail, phone:phone, area:rows});                                    
                            }
                        }
                    }
    );
}

function getCoordinate(req, res, detail, phone, area){

    var sql='SELECT latitude, longitude FROM coordinate '+                            
                            'WHERE agencyPhoneNumber='+mysql.escape(req.query.agencyPhoneNumber);

    var connection=mysql.createConnection(db_config);
    connection.query(sql,
                    function(error, rows){
                        connection.end();

                        if(error){                            
                            console.log('getServiceDetail error: ' + error);
                        }else{
                            res.json({detail:detail, phone:phone, area:area, coordinate:rows[0]});
                        }
                    }
    );
}

exports.deleteAgency=function(req, res){
 
    var sql='DELETE From agency '+
                     'WHERE agencyPhoneNumber='+mysql.escape(req.body.currentAltPhoneNumber)+' '; 

    var connection = mysql.createConnection(db_config);    
    connection.query(sql,
                    function (error) {  
                        connection.end();         
                        
                        if(error){                            
                            console.log('Delete Agency error: ' + error);
                        }else{
                            if( req.body.areaCount > 1 ){
                                req.body.areaCount = req.body.areaCount - 1;

                                deleteArea(req, res);
                            }else{                                       
                                deleteAlternativeArea(req, res);                            
                            }
                        }
                    }
    );     
}

function deleteAlternativeArea(req, res){
 
    var sql='DELETE FROM alternativeArea '+
                     'WHERE agencyPhoneNumber='+mysql.escape(req.body.currentAltPhoneNumber)+' '; 

    var connection = mysql.createConnection(db_config);    
    connection.query(sql,
                    function (error) {  
                        connection.end();         
                        
                        if(error){                            
                            console.log('Delete Alternative Area error: ' + error);
                        }else{
                            deleteAlternativePhone(req, res);                                                        
                        }
                    }
    );     
}

function deleteAlternativePhone(req, res){
 
    var sql='DELETE From alternativePhoneNumber '+
                     'WHERE agencyPhoneNumber='+mysql.escape(req.body.currentAltPhoneNumber)+' '; 

    var connection = mysql.createConnection(db_config);    
    connection.query(sql,
                    function (error) {  
                        connection.end();         
                        
                        if(error){                            
                            console.log('Delete Alternative Phone error: ' + error);
                        }else{
                            if(req.body.category == 'hospital')
                                deleteCoordinate(req, res);
                            else
                                afterDelete(req, res);                                                        
                        }
                    }
    );     
}

function deleteCoordinate(req, res){
 
    var sql='DELETE From coordinate '+
                     'WHERE agencyPhoneNumber='+mysql.escape(req.body.currentAltPhoneNumber)+' '; 

    var connection = mysql.createConnection(db_config);    
    connection.query(sql,
                    function (error) {  
                        connection.end();         
                        
                        if(error){                            
                            console.log('Delete Alternative Phone error: ' + error);
                        }else{
                            afterDelete(req, res);                                                        
                        }
                    }
    );     
}

function afterDelete(req, res){
    
    if(req.url=='/update')
        reAddAgency(req, res); 
    else
        res.json({exist:true});                                
}



