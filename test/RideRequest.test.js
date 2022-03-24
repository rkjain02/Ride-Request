import { assert } from "chai"

const RideRequest = artifacts.require('./RideRequest.sol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('RideRequest', ([deployer, driver, driver1, driver2, rider]) => {
    let rideRequest
    before(async() =>{
        rideRequest = await RideRequest.deployed()
    })
    describe('deployment', async() => {
        it('deploys succesfully', async() => {
            const address = await rideRequest.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })
        it('has a name', async() => {
            const name = await rideRequest.name()
            assert.equal(name, "Test")
        })
    })
    describe('driver', async() => {
        let result, driverCount
        before(async() => {
            result = await rideRequest.createDriver('Bob Smith', 'Lexus RX 350', 4, {from: driver})
            driverCount = await rideRequest.driverCount()
        })
        it('creates driver', async() => {
            assert.equal(driverCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), driverCount.toNumber(), 'id is correct')
            assert.equal(event.name, 'Bob Smith', 'name is correct')
            assert.equal(event.car, 'Lexus RX 350', 'car is correct')
            assert.equal(event.location.toNumber(), 4, 'location is corrrect')
            assert.equal(event.account, driver, 'driver account is correct')
            assert.equal(event.givingRide, false, 'givingRide is corrrect')
            await rideRequest.createDriver("", "Lexus", 1).should.be.rejected;
            await rideRequest.createDriver("Bob", "", 1).should.be.rejected;
        })
    })
    describe('rider', async () => {
        let result, riderCount
        before(async () => {
            result = await rideRequest.createRider('RJ', 1)
            riderCount = await rideRequest.riderCount()
        })
        it('creates rider', async () => {
            assert.equal(riderCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), riderCount.toNumber(), 'id is correct')
            assert.equal(event.name, 'RJ', 'name is correct')
            assert.equal(event.location.toNumber(), 1, 'location is corrrect')
            assert.equal(event.needsRide, false, 'givingRide is corrrect')
            await rideRequest.createRider("", 1).should.be.rejected;
        })
    })
    describe('requestRide', async () => {
        let ride, rideCount, r, d1, d2
        before(async () => {
            d1 = await rideRequest.createDriver('RJ Driver', "Ford", 2, {from:driver1})
            d2 = await rideRequest.createDriver('Other driver', 'Jeep', 3, {from:driver2})
        })
        it('finalizes ride', async () => {
            
            let oldDriverBalance = await web3.eth.getBalance(driver1)
            oldDriverBalance = new web3.utils.BN(oldDriverBalance)

            ride = await rideRequest.requestRide(1, 3, { from: rider, value: web3.utils.toWei('20', 'Ether') })
            rideCount = await rideRequest.rideCount()

            assert.equal(rideCount, 1)
            const event = ride.logs[0].args
            assert.equal(event.riderId.toNumber(),1, 'riderId is correct')
            assert.equal(event.riderName,'RJ', 'rider name is correct')
            assert.equal(event.riderLocation, 3, 'rider destination is correct')
            //assert.equal(event.riderNeedsRide, false, 'rider needs ride is correct')
            assert.equal(event.driverId.toNumber(), 2, 'driver id is correct')
            assert.equal(event.driverName, 'RJ Driver', 'driver name is correct')
            assert.equal(event.driverCar, 'Ford', 'driver car is correct')
            //assert.equal(event.driverGivingRide, false, 'driver giving ride is correct')
            assert.equal(event.driverLocation.toNumber(), 3, 'driver location is correct')
            assert.equal(event.driverAccount, driver1, "driver account is correct")
            assert.equal(web3.utils.BN(event.price), web3.utils.toWei('20', 'Ether'), 'price is correct')

            //console.log(event.riderLocation)
            let newDriverBalance = await web3.eth.getBalance(driver1)
            newDriverBalance = new web3.utils.BN(newDriverBalance)

            let price
            price = web3.utils.toWei('20', 'Ether')
            price = new web3.utils.BN(price)

            const expectedBalance = oldDriverBalance.add(price)
            assert.equal(newDriverBalance.toString(), expectedBalance.toString(), 'transfer occured')

            await rideRequest.requestRide(5, 4, { from: rider, value: web3.utils.toWei('20', 'Ether')}).should.be.rejected
            await rideRequest.requestRide(1, 3, { from: rider, value: web3.utils.toWei('20', 'Ether') }).should.be.rejected
            await rideRequest.requestRide(1, 4, { from: rider, value: web3.utils.toWei('9.9', 'Ether') }).should.be.rejected
            //await rideRequest.createDriver('Bob', "", 1).should.be.rejected;
            await rideRequest.requestRide(1, 7, { from: rider, value: web3.utils.toWei('40', 'Ether') })

        })
        
    })
})