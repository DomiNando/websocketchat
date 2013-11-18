

exports.displayHtml=function(req, res, 
                                emergencyType, total, averageTime, 
                                outside, resolved, hasApplication,
                                employee){    

    res.render('./stat/agencyStat', 
                {
                    title : 'Agency Stat', 
                    agencyPhoneNumber : req.query.agencyPhoneNumber,
                    emergencyType : emergencyType,
                    total : total,
                    averageTime : averageTime,
                    outside : outside,
                    resolved : resolved,
                    hasApplication : hasApplication,
                    employee : employee
                }
    );
}

exports.displayEmployeeStat=function(req, res, 
                                emergencyType, total, averageTime, 
                                outside, resolved, hasApplication,
                                employee){    

    res.render('./stat/employeeStat', 
                {
                    title : 'Agency Stat', 
                    agencyPhoneNumber : req.query.agencyPhoneNumber,
                    username : req.query.username,//difference with previous
                    emergencyType : emergencyType,
                    total : total,
                    averageTime : averageTime,
                    outside : outside,
                    resolved : resolved,
                    hasApplication : hasApplication,
                    employee : employee
                }
    );
}

exports.displayEmergency=function(req, res, rows){
    
    res.render('./stat/emergencyResult', { title : 'Emergency Result', rows : rows });
}
