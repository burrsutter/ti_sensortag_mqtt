var mqtt    = require('mqtt');
var SensorTag = require('sensortag');
var client  = mqtt.connect('mqtt://192.168.2.2');

SensorTag.discover(function(device) {
  console.log('discovered device with UUID: ' + device['uuid']);
  device.connect(function() {
    console.log('connected');
    device.discoverServicesAndCharacteristics(function() {
      console.log('discovered services and characteristics');
      device.enableHumidity(function() {

        device.on('humidityChange', function(temperature, humidity) {
            console.log('\ttemperature = %d °C', temperature.toFixed(1));
            console.log('\thumidity = %d %', humidity.toFixed(1));
            client.publish('temp_humidity_topic', temperature.toFixed(2) + ' °C - ' + humidity.toFixed(2) + '%');
        });

        device.notifyHumidity(function() {
          console.log('notifyHumidity');
        });

      }); // enableAccelerometer
    }); // discoverServicesAndCharacteristics
  }); // connect
}); // discover
