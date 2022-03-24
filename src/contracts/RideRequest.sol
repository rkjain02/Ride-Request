pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;


contract RideRequest {
    string public name;

    uint public driverCount = 0;
    mapping(uint => Driver) public drivers;
    
    struct Driver {
        uint id;
        string name;
        string car;
        bool givingRide;
        uint location;
        address payable account;
    }

    function createDriver(string memory _name, string memory _car, uint _location) public{
        require(bytes(_name).length > 0);
        require(bytes(_car).length > 0);
        driverCount++;
        drivers[driverCount] = Driver(driverCount, _name, _car, false, _location, msg.sender);
        emit DriverCreated(driverCount, _name, _car, false, _location, msg.sender);
    }

    event DriverCreated(
        uint id,
        string name,
        string car, 
        bool givingRide,
        uint location,
        address payable account
    );

    uint public riderCount = 0;
    mapping(uint => Rider) public riders;
    
    struct Rider {
        uint id;
        string name;
        bool needsRide;
        uint location;
        address account;
    }

    function createRider(string memory _name, uint _location) public{
        require(bytes(_name).length > 0);
        riderCount++;
        riders[riderCount] = Rider(riderCount, _name, false, _location, msg.sender);
        emit RiderCreated(riderCount, _name, false, _location, msg.sender);
    }

    event RiderCreated(
        uint id,
        string name,
        bool needsRide,
        uint location,
        address account
    );


    struct Ride {
        uint id;
        Driver selectedDriver;
        Rider selectedRider;
        uint price;
    }

    uint public rideCount = 0;
    mapping(uint => Ride) public rides;


    function requestRide(uint _id, uint destination) public payable {
        
        //Find Rider, Driver, Price
        require(_id >0 && _id<=riderCount);

        Rider memory _rider = riders[_id];
        require(!_rider.needsRide);
        _rider.needsRide = true;

        require(destination != _rider.location);

        //emit (msg);
        
        uint price = abs(destination-_rider.location)*10 ether;
        require(msg.value >= price);

        uint minDistance = abs(drivers[0].location-_rider.location);
        uint bestDriver = 0;
        for(uint i=1; i<=driverCount; i++) {
            Driver memory _driver = drivers[i];
            if(_driver.givingRide) {
                continue;
            }
            else {
                uint distance = abs(drivers[i].location-_rider.location);
                if(distance < minDistance) {
                    minDistance = distance;
                    bestDriver = i;
                }
            }
        }
        Driver memory _driver = drivers[bestDriver];
        require(_driver.account !=msg.sender);

        //Pairing of Ride and record of Ride
        rideCount++;
        Ride memory finalizedRide = Ride(rideCount, _driver, _rider, price);
        rides[rideCount] = finalizedRide;
        _rider.needsRide = false;
        _driver.givingRide = true;

        //Ride Completed
        address(_driver.account).transfer(msg.value);
        _driver.location = destination;
        _rider.location = destination;
        _driver.givingRide = false;
        _rider.needsRide = false;

        uint dest = destination;

        riders[_id] = _rider;
        drivers[bestDriver] = _driver;

        emit RideRequested(_rider.id, _rider.name, _rider.location, _rider.account, _driver.id, _driver.name, 
                            _driver.car, _driver.location, _driver.account, price, dest);
    }

    event RideRequested(
        uint riderId,
        string riderName,
        uint riderLocation,
        address riderAccount,

        uint driverId,
        string driverName,
        string driverCar, 
        uint driverLocation,
        address payable driverAccount,

        uint price,
        uint dest
    );

    function abs(uint x) private pure returns (uint){
        return x >= 0 ? x : -x;
    }

    constructor() public {
        name = "Test";
    }
}