var mqtt    = require('mqtt');
var SensorTag = require('sensortag');
var client  = mqtt.connect('mqtt://192.168.3.3');

SensorTag.discover(function(device) {
  console.log('discovered device with UUID: ' + device['uuid']);
  device.connect(function() {
    console.log('connected');
    device.discoverServicesAndCharacteristics(function() {
      console.log('discovered services and characteristics');
      device.enableIrTemperature(function() {

        device.on('irTemperatureChange', function(objectTemperature, ambientTemperature) {
          console.log('\tobject temperature=%d', objectTemperature.toFixed(1));
          console.log('\tambient temperature=%d', ambientTemperature.toFixed(1));
          client.publish('ti_temp', objectTemperature.toFixed(1));
        });

        device.notifyHumidity(function() {
          console.log('notifyHumidity');
        });

      }); // enableIrTemperature
    }); // discoverServicesAndCharacteristics
  }); // connect
}); // discover
