import React, { Component } from 'react';


class Main extends Component {


    render() {
        return (
            <><div id="content">
                <h1>Sign Up As a Rider</h1>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    const name = this.riderName.value;
                    const location = this.riderLocation.value;
                    this.props.createRider(name, location);
                } }>
                    <div className="form-group mr-sm-2">
                        <input
                            id="riderName"
                            type="text"
                            ref={(input) => { this.riderName = input; } }
                            className="form-control"
                            placeholder="Rider Name"
                            required />
                    </div>
                    <div className="form-group mr-sm-2">
                        <input
                            id="riderLocation"
                            type="text"
                            ref={(input) => { this.riderLocation = input; } }
                            className="form-control"
                            placeholder="Rider Location"
                            required />
                    </div>
                    <button type="submit" className="btn btn-primary">Sign Up</button>
                </form>
                <h1>Sign Up As a Driver</h1>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    const name = this.driverName.value;
                    const location = this.driverLocation.value;
                    const car = this.driverCar.value;
                    this.props.createDriver(name, car, location);
                }}>
                    <div className="form-group mr-sm-2">
                        <input
                            id="driverName"
                            type="text"
                            ref={(input) => { this.driverName = input; }}
                            className="form-control"
                            placeholder="Driver Name"
                            required />
                    </div>
                    <div className="form-group mr-sm-2">
                        <input
                            id="driverCar"
                            type="text"
                            ref={(input) => { this.driverCar = input; }}
                            className="form-control"
                            placeholder="Driver Car"
                            required />
                    </div>
                    <div className="form-group mr-sm-2">
                        <input
                            id="driverLocation"
                            type="text"
                            ref={(input) => { this.driverLocation = input; }}
                            className="form-control"
                            placeholder="Driver Location"
                            required />
                    </div>
                    <button type="submit" className="btn btn-primary">Sign Up</button>
                </form>
                <h1>Request A Ride</h1>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    const id = this.riderId.value
                    const destination = this.destination.value;
                    this.props.requestRide(id, destination);
                }}>
                    
                    <div className="form-group mr-sm-2">
                        <input
                            id="id"
                            type="text"
                            ref={(input) => { this.riderId = input; }}
                            className="form-control"
                            placeholder="Rider Id"
                            required />
                    </div>
                    <div className="form-group mr-sm-2">
                        <input
                            id="destination"
                            type="text"
                            ref={(input) => { this.destination = input; }}
                            className="form-control"
                            placeholder="Destination"
                            required />
                    </div>
                    <button type="submit" className="btn btn-primary">Request Ride</button>
                </form>
                <p>&nbsp;</p>
                
                
            </div>
            <div id="content">
                    <h2>All Riders</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Location</th>
                                <th scope="col">Account</th>
                            </tr>
                        </thead>
                        <tbody id="riderList">
                            {this.props.riders.map((rider, key) => {
                                return (
                                    <tr key={key}>
                                        <th scope="row">{rider.id.toString()}</th>
                                        <td>{rider.name}</td>
                                        <td>{rider.location.toString()}</td>
                                        <td>{rider.account}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <h2>All Drivers</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Car</th>
                                <th scope="col">Location</th>
                                <th scope="col">Account</th>
                            </tr>
                        </thead>
                        <tbody id="driverList">
                            {this.props.drivers.map((driver, key) => {
                                return (
                                    <tr key={key}>
                                        <th scope="row">{driver.id.toString()}</th>
                                        <td>{driver.name}</td>
                                        <td>{driver.car}</td>
                                        <td>{driver.location.toString()}</td>
                                        <td>{driver.account}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <h2>All Rides</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">RiderName</th>
                                <th scope="col">DriverName</th>
                                <th scope="col">Price</th>
                            </tr>
                        </thead>
                        <tbody id="rideList">
                            {this.props.rides.map((ride, key) => {
                                return (
                                    <tr key={key}>
                                        <th scope="row">{ride.id.toString()}</th>
                                        <td>{ride.selectedRider.name}</td>
                                        <td>{ride.selectedDriver.name}</td>
                                        <td>{window.web3.utils.fromWei(ride.price.toString(), 'Ether')} Eth</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    
                    
                </div></>
        );
    }
}

export default Main;
