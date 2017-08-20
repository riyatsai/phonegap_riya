var camera = {
  startCameraAbove: function(){
    CameraPreview.startCamera({x: 50, y: 50, width: 300, height: 300, toBack: false, previewDrag: true, tapPhoto: true});
  },
  startCameraBelow: function(){
    CameraPreview.startCamera({x:0, y: 0, width:window.screen.width, height:window.screen.height, camera: "back", tapPhoto: true, previewDrag: false, toBack:true});
  },
  stopCamera: function(){
    CameraPreview.stopCamera();
  },
  takePicture: function(){
    CameraPreview.takePicture({width:window.screen.width*2,height:window.screen.height*2,quality:100},function(imgData){
      document.getElementById('originalPicture').src = 'data:image/jpeg;base64,' + imgData;
      gyroObj.img = imgData;
      glAllData.push(gyroObj);
      glAllData[glAllData.length-1]['real'] = getDistance(define_height,glAllData[glAllData.length-1]['a'],glAllData[glAllData.length-1]['b']);
      fileData.export(glFileEntry,JSON.stringify(glAllData));
    });
  },
  switchCamera: function(){
    CameraPreview.switchCamera();
  },
  show: function(){
    CameraPreview.show();
  },
  hide: function(){
    CameraPreview.hide();
  },
  init: function(){
    try{
      document.getElementById('takePictureButton').addEventListener('click', this.takePicture, false);
      this.startCameraBelow();
    }
    catch(e){
      console.log('Not in camera.html');
    }
  }
};

document.addEventListener('deviceready', function(){
  camera.init();
}, false);
