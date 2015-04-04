var mqtt    = require('mqtt');
var SensorTag = require('sensortag');
var client  = mqtt.connect('mqtt://192.168.3.3');

SensorTag.discover(function(device) {
  console.log('discovered device with UUID: ' + device['uuid']);
  device.connect(function() {
    console.log('connected');
    device.discoverServicesAndCharacteristics(function() {
      console.log('discovered services and characteristics');
      device.enableMagnetometer(function() {
        device.setMagnetometerPeriod(1000, function() {
          device.on('magnetometerChange', function(x, y, z) {
            console.log('\tx = %d ', x);
            console.log('\ty = %d ', y);
            console.log('\tz = %d ', z);
            client.publish('mag_topic', 'X:' + x.toFixed(1) +  ' Y:' + y.toFixed(1) + ' Z:' + z.toFixed(1) );
          });

          device.notifyMagnetometer(function() {
            console.log('notifyMagnetometer');
          });
        }); // setMagnetometerPeriod
      }); // enableAccelerometer
    }); // discoverServicesAndCharacteristics
  }); // connect
}); // discover
