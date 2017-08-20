function gpsSuccess(position){
  glAllData['latitude']  = position.coords.latitude.toFixed(6);
  glAllData['longitude'] = position.coords.longitude.toFixed(6);
  glAllData['altitude']  = position.coords.altitude.toFixed(6);
  glAllData['alpha']     = document.getElementById('inertia_alpha').innerHTML;
  fileData.export(glFileEntry,JSON.stringify(glAllData));
}
function gpsError(error){
  alert('code: '    + error.code    + '\n' +'message: ' + error.message + '\n');
}
function captureGPSSuccess(mediaFiles){
  var i, path, len;
  for (i = 0, len = mediaFiles.length; i < len; i += 1) {
      path = mediaFiles[i].fullPath;
      console.log(path);
      LibraryHelper.saveVideoToLibrary(function(data){
        console.log('success');
        console.log(data);
        document.getElementById('first_latitude').innerHTML  = glAllData['latitude'];
        document.getElementById('first_longitude').innerHTML = glAllData['longitude'];
        document.getElementById('first_altitude').innerHTML  = glAllData['altitude'];
        document.getElementById('first_alpha').innerHTML     = glAllData['alpha'];
      },
      function(data){
        console.log('error');
        console.log(data);
      }, path, 'test');
  }
}
function captureGPSError(){
  navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
}

function captureInertiaSuccess(mediaFiles){
  var i, path, len;
  for (i = 0, len = mediaFiles.length; i < len; i += 1) {
      path = mediaFiles[i].fullPath;
      console.log(path);
      LibraryHelper.saveVideoToLibrary(function(data){
        console.log('success');
        console.log(data);
        window.location.href = '#record';
      },
      function(data){
        console.log('error');
        console.log(data);
      }, path, 'test');
  }
}
function captureGPSVideo(){
  navigator.geolocation.getCurrentPosition(gpsSuccess,gpsError);
  navigator.device.capture.captureVideo(captureGPSSuccess, captureGPSError, {limit:1});
}
function captureInertiaVideo(){
  glAllData['inertia'].push(document.getElementById('inertia_alpha').innerHTML);
  fileData.export(glFileEntry,JSON.stringify(glAllData));
  navigator.device.capture.captureVideo(captureInertiaSuccess, captureGPSError, {limit:1});
}
