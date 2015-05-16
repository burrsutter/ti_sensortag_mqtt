var mqtt    = require('mqtt');
var SensorTag = require('sensortag');
var client  = mqtt.connect('mqtt://192.168.3.2');

SensorTag.discover(function(device) {
  console.log('discovered device with UUID: ' + device['uuid']);
  if(device['uuid'] !== 'b4994c64b96a') {
    console.log("Wrong TI SensorTag, Try Again");
    process.exit();
  }
  device.connect(function() {
    console.log('connected');
    device.discoverServicesAndCharacteristics(function() {
      console.log('discovered services and characteristics');
      device.enableIrTemperature(function() {
        device.on('irTemperatureChange', function(objectTemperature, ambientTemperature) {
          console.log('\tobject temperature is %d °C', objectTemperature.toFixed(1));
          // console.log('\tambient temperature = %d %', ambientTemperature.toFixed(1));
          client.publish('temp_ti_cc2541', 
            '{"sensorid":"ti_cc2541",' +
            ' "temp":' + objectTemperature.toFixed(1) + ',' +
            ' "time":' + Date.now() + '}'
            );
        });

        device.notifyIrTemperature(function() {
          console.log('notifyIrTemperature');
        });
      }); // enableIrTemperature
    }); // discoverServicesAndCharacteristics
  }); // connect
}); // discover
