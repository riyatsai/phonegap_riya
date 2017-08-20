function switchView(path){
console.log(path);
  if(path!='camera'){
    camera.stopCamera();
  }
  window.location.assign(path+'.html');
}
