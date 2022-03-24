import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import './App.css';
import RideRequest from '../abis/RideRequest.json';
import Navbar from './Navbar';
import Main from './Main';



class App extends Component {
  
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  
  async loadWeb3 () {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    console.log(accounts[0])
    this.setState({account: accounts[0]})

    const networkId = await web3.eth.net.getId()
    const networkData = RideRequest.networks[networkId]
    if (networkData) {
      const riderequest = web3.eth.Contract(RideRequest.abi, networkData.address)
      this.setState({riderequest})
      const ridersCount = await riderequest.methods.riderCount().call()
      this.setState({ridersCount: ridersCount})
      const driversCount = await riderequest.methods.driverCount().call()
      this.setState({driversCount: driversCount})

      const rideCount = await riderequest.methods.rideCount().call()

      for(var i =1; i<=ridersCount; i++) {
        const rider = await riderequest.methods.riders(i).call()
        this.setState({
          riders: [...this.state.riders, rider]
        })
      }

      for (var i = 1; i <= driversCount; i++) {
        const driver = await riderequest.methods.drivers(i).call()
        this.setState({
          drivers: [...this.state.drivers, driver]
        })
      }

      for (var i = 1; i <= rideCount; i++) {
        const ride = await riderequest.methods.rides(i).call()
        this.setState({
          rides: [...this.state.rides, ride]
        })
      }

      var id = 1
      this.setState({loading: false})
      console.log(this.state.riders[id-1].location.toString())
    
    } else {
      window.alert('Marketplace contract not deployed to detected network.')
    }

    // console.log(RideRequest.abi, RideRequest.networks[5777].address)
    // const abi = RideRequest.abi
    // const address = RideRequest.networks[5777].address
    // const riderequest = web3.eth.Contract(abi, address)
    // console.log(riderequest)
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      ridersCount: 0,
      driversCount: 0,
      rideCount: 0,
      riders: [],
      drivers: [],
      rides: [],
      loading: true
    }
    this.createRider = this.createRider.bind(this)
    this.createDriver = this.createDriver.bind(this)
    this.requestRide = this.requestRide.bind(this)
  }

  createRider(name, location) {
    this.setState({loading: true})
    this.state.riderequest.methods.createRider(name, location).send({from: this.state.account})
      .once('receipt', (receipt) => {
        this.setState({loading: false})
      })
  }

  createDriver(name, car, location) {
    this.setState({ loading: true })
    this.state.riderequest.methods.createDriver(name, car, location).send({ from: this.state.account })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
  }

  requestRide(id, destination) {
    this.setState({ loading: true })

    var riderLocation = this.state.riders[id - 1].location.toString()  
    var price = Math.abs(destination - riderLocation)*10
    price = window.web3.utils.toWei(price.toString(), 'Ether')
    console.log("price", price)
    this.state.riderequest.methods.requestRide(id, destination).send({ from: this.state.account, value: price})
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      })
  }

  render() {
    return (
      <div>
        <Navbar account = {this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              {this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main 
                  riders={this.state.riders}
                  drivers={this.state.drivers}
                  rides = {this.state.rides}
                  createRider={this.createRider}
                  createDriver={this.createDriver}
                  requestRide = {this.requestRide} />
              }
              
            </main> 

          </div>

        </div>
      </div>
    );
  }
}

export default App;
