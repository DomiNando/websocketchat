/**
 * Created by Jdl28110 on 10/14/13.
 */

function Position(position, datetime, country, state, city, mobile)
{
    var _db = window.sessionStorage;
    var MAX_POSITIONS = 4;

    this.position = position;
    this.datetime = datetime;
    this.country = country;
    this.state = state;
    this.city= city;
    this.mobile= mobile;

    this.getMaxPositions = function()
    {
        return MAX_POSITIONS;
    }



    this.savePosition = function(position, country, state, city, mobile)
    {
        if (!_db)
        {
            console.log('Unable to save position');
            navigator.notification.alert(
                'Unable to save position',
                function(){},
                'Error'
            );
        }

        var positions = this.getPositions();
        if (positions == null)
            positions = [];

        positions.unshift(new Position(position, new Date(), country, state, city, mobile));


        if (positions.length > this.MAX_POSITIONS)
            positions = positions.slice(0, this.MAX_POSITIONS);

        _db.setItem('positions', JSON.stringify(positions));

        return positions;
    }

    this.updatePosition = function(index, position, country, state, city, mobile)
    {
        if (!_db)
        {
            console.log('The database is null. Unable to update position');
            navigator.notification.alert(
                'Unable to update position',
                function(){},
                'Error'
            );
        }

        var positions = this.getPositions();

        positions[index].coords = position;
        positions[index].country = country;
        positions[index].state = state;
        positions[index].city = city;
        positions[index].mobile = mobile;

        _db.setItem('positions', JSON.stringify(positions));

        return positions;
    }

    this.getPositions = function()
    {
        if (!_db)
        {
            console.log('The database is null. Unable to retrieve positions');
            navigator.notification.alert(
                'Unable to retrieve positions',
                function(){},
                'Error'
            );
        }

        var positions = JSON.parse(_db.getItem('positions'));
        if (positions == null)
            positions = [];

        return positions;
    }

    this.deletePosition = function(index)
    {
        if (!_db)
        {
            console.log('The database is null. Unable to delete position');
            navigator.notification.alert(
                'Unable to delete position',
                function(){},
                'Error'
            );
        }

        var positions = this.getPositions();
        if (positions != null && positions[index] != undefined)
            positions.splice(index, 1);

        _db.setItem('positions', JSON.stringify(positions));

        return positions;
    }

}



function Coords(latitude, longitude, accuracy)
{
    this.latitude = latitude;
    this.longitude = longitude;
    this.accuracy = accuracy;
}