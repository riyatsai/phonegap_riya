Number.prototype.map = function (in_min, in_max, out_min, out_max){
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
var drawStart = 2;
var glFileEntry;
var glAllData;
var lock = false;
var trackers = [];
var fileData = {
  path:function(){
    return 'store.txt';
  },
  init:function(){
    window.resolveLocalFileSystemURL(cordova.file.documentsDirectory+fileData.path(),fileData.import,fileData.createFile);
  },
  createFile:function(){
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
        fs.root.getFile(fileData.path(), { create: true, exclusive: false }, function (fileEntry) {
            fileData.export(fileEntry, '{height:"",phoneHeight:"",latitude:"",longitude:"",altitude:"",alpha:"",space:[],inertia:[]}');// fileEntry.name == 'someFile.txt' // fileEntry.fullPath == '/someFile.txt'
            //fileData.import(fileEntry);
            if(sessionStorage.getItem('index')==null
             ||sessionStorage.getItem('index')==undefined
             ||sessionStorage.getItem('index')==''){
               sessionStorage.setItem('index',0);
            }
        }, fileData.errorHandler);
    }, fileData.errorHandler);
  },
  import:function(fileEntry){
    glFileEntry = fileEntry;
    fileEntry.file(function (file) {
        var reader = new FileReader();
        reader.onloadend = function() {
            try{
              glAllData = JSON.parse(this.result);
              if(sessionStorage.getItem('index')==null
               ||sessionStorage.getItem('index')==undefined
               ||sessionStorage.getItem('index')==''){
                 sessionStorage.setItem('index',parseInt(glAllData.space.length));
              }
            }
            catch(e){
              glAllData = {height:"",phoneHeight:"",latitude:"",longitude:"",altitude:"",alpha:"",space:[],inertia:[]};
              if(sessionStorage.getItem('index')==null
               ||sessionStorage.getItem('index')==undefined
               ||sessionStorage.getItem('index')==''){
                 sessionStorage.setItem('index',0);
              }
            }
            console.log("Successful file read: " + this.result);
            try{
              var spaceL = glAllData.space.length-1;
              var spaceLL= glAllData.space[spaceL].length-1;
              document.getElementById('originalPicture').src ='data:image/jpeg;base64,'+glAllData.space[spaceL][spaceLL]['img'];
            }
            catch(e){
              console.log('No previous data or #originalPicture');
            }
            try{
              var text = '';
              //document.querySelector("#textArea").innerHTML = this.result;
              if(glAllData.space.length>0){
                var space = glAllData.space;
                for(let i=0;i<space.length;i++){
                  text+='<center style="background:#4286f4; color:#fff;">GROUP '+(i+1);
                  for(let j=0;j<space[i].length;j++){
                    text+=DOMfileBlock(space[i][j],i,j);
                  }
                  text+='</center>';
                }
              }
              else{
                text = '<center style="margin-top:40vh; font-size:20px;">目前沒有任何資料</center>';
              }
              document.getElementById('fileList').innerHTML = text;
            }
            catch(e){
              console.log('Not in file.html');
            }
        };
        reader.readAsText(file);
    }, fileData.errorHandler);
  },
  export:function(fileEntry, dataObj,isAppend=false){
    fileEntry.createWriter(function (fileWriter) {
        fileWriter.onwriteend = function() {
            fileData.import(fileEntry);
        };
        fileWriter.onerror = function (e) {
            console.log("Failed file read: " + e.toString());
        };
        if (isAppend) {
            try {
                fileWriter.seek(fileWriter.length);
            }
            catch (e) {
                console.log("file doesn't exist!");
            }
        }
        fileWriter.write(new Blob([dataObj], { type: 'text/plain' }));
    });
  },
  truncate:function(fileEntry, dataObj){
    fileEntry.createWriter(function (fileWriter) {
        fileWriter.onwriteend = function() {
            if (fileWriter.length === 0) {
              fileData.export(glFileEntry,JSON.stringify(glAllData));
                //fileWriter has been reset, write file
            } else {
                //file has been overwritten with blob
                //use callback or resolve promise
            }
        };
        fileWriter.truncate(0);
    });
  },
  errorHandler:function(e){
    console.log("FileSystem Error");
  	console.log(e);
  }
}

document.addEventListener("deviceready", fileData.init, false);
function rearrange(space){
    let newArr = [];
    for(let i=0;i<space.length;i++){
      if(space[i].length>0){
        if(space[i][0]!=null){
          newArr.push(space[i]);
        }
      }
    }
    return newArr;
}
function fileRemove(index,index2){
  glAllData.space[index].splice(index2,1);
  glAllData.space = rearrange(glAllData.space);
  fileData.export(glFileEntry,JSON.stringify(glAllData));
  //console.log(glFileEntry.toURL());
}
function fileUpload(){//spaceLAST WORK
  if(glAllData.length>0 && lock==false){
    lock = true;
    $.post('http://140.119.55.119/youshariya/post/save.php',{data:glAllData,key:'divacriya',height:getCeilingHeight(define_height,glAllData[0]['real']['distance'],glAllData[1]['b'])}).done(function(data){
      navigator.notification.alert(JSON.parse(data)['res'],function(){lock = false;}, '上傳結果', '確定');
    });
  }
}
function fileCalculate(){
  let space = glAllData.space;
  for(let i=0;i<space.length;i++){
    let range = getRange(space[i]);
    let re    = remap(space[i],range);
    let plat  = document.getElementById('2d_canvas_'+i);
    let poly  = document.getElementById('3d_canvas_'+i);
    let height= getCeilingHeight(glAllData.height,space[i][0]['real']['distance'],space[i][1]['b']);
    draw2D(plat.getContext('2d'),plat,re);
    draw3D(poly,space[i],height);
  }
}
function draw2D(ctx,canvas,re){
  drawBackground(ctx,canvas);
  //drawCoordinate(ctx,canvas);
  drawTarget(ctx,re);
  drawAim(ctx,canvas);
}
function draw3D(canvas,re,height){
  var scene = new THREE.Scene();
  var renderer = new THREE.WebGLRenderer({ canvas: canvas });
  var camera = new THREE.PerspectiveCamera(45,canvas.width/canvas.height, 1, 10000);
  var controls = new THREE.TrackballControls( camera, renderer.canvas );
  var axes = new THREE.AxisHelper(1000);
  trackers.push(controls);
  renderer.setSize(canvas.width,canvas.height);
  renderer.setClearColor(0xffffff,1);
  camera.position.y = 150;
  camera.position.z = 2000;

  // var cube = new THREE.Mesh(
  //     new THREE.BoxGeometry(200,200,200,1,1,1),
  //     new THREE.MeshBasicMaterial({color:0xff0000,wireframe:true})
  //   );

  // var colors = [0xfc63b3, 0xfff48d, 0x94fff5, 0xd68fff];
  // var spheres, sphere;
  // spheres = new THREE.Group();
  // for(var i = 0; i < 4; i++) {
  //     sphere = createMesh(new THREE.SphereGeometry(25 - (i * 5), 10, 10), i);
  //     sphere.rotation.x = Math.random() * 100;
  //     spheres.add(sphere);
  // }

  var platShape = new THREE.Shape();
  platShape.moveTo(re[drawStart]['real']['cx'],re[drawStart]['real']['cy']);
  for(var i=drawStart;i<re.length;i++){
    platShape.lineTo(re[i]['real']['cx'],re[i]['real']['cy']);
  }
  var geometry = new THREE.ShapeGeometry(platShape);
  var material = new THREE.MeshBasicMaterial({color:0x000000});
  var mesh = new THREE.Mesh(geometry,material) ;
  //scene.add(mesh);

  var extrudedGeometry = new THREE.ExtrudeGeometry(platShape, {amount: height, bevelEnabled: false});
  var extrudedMesh = new THREE.Mesh(extrudedGeometry, new THREE.MeshPhongMaterial({color: 0x123456,wireframe:true}));
  scene.add(extrudedMesh);

  //scene.add(spheres);
  //scene.add(cube);
  scene.add(axes);

  (function animate(){
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene,camera);
  })();

  // function createMesh(geometry, index) {
  //     var material = new THREE.MeshBasicMaterial({
  //         color: colors[index],
  //         wireframe: true
  //     });
  //     var mesh = new THREE.Mesh(geometry, material);
  //     return mesh;
  // }
}
function drawTarget(ctx,re){
    ctx.strokeStyle="#000";//"#888888";
    ctx.fillStyle ="#888"; //"#082058";
    ctx.strokeWidth = 10;
    ctx.beginPath();
    ctx.moveTo(re[0]['x'],re[0]['y']);
    for(var i=0;i<re.length;i++){
        ctx.lineTo(re[i]['x'],re[i]['y']);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.font = "12px Arial";
    ctx.fillStyle = "#0000ff";
    for(var i=drawStart;i<glAllData.length;i++){
      ctx.fillText("("+parseFloat(glAllData[i]['real']['cx']).toFixed(2)+","+parseFloat(glAllData[i]['real']['cy']).toFixed(2)+")",re[i-drawStart]['x'],re[i-drawStart]['y']+10);
    }
}
function drawBackground(ctx,canvas){
  ctx.fillStyle = "#fff";//"#000000";
  ctx.fillRect(0,0,canvas.width,canvas.height);
}
function drawAim(ctx,canvas){
  ctx.strokeStyle = "#00ff00";
  ctx.strokeWidth = 1;
  ctx.beginPath();
  ctx.moveTo(canvas.width/2,0);
  ctx.lineTo(canvas.width/2,canvas.height);
  ctx.stroke();
  ctx.closePath();
  ctx.strokeStyle = "#ff0000";
  ctx.beginPath();
  ctx.moveTo(0,canvas.height/2);
  ctx.lineTo(canvas.width,canvas.height/2);
  ctx.stroke();
  ctx.closePath();
}
function drawCoordinate(ctx,canvas){
  ctx.strokeStyle = "#202820";
  ctx.strokeWidth = 1;
  for(var i=10;i+canvas.width/2<canvas.width;i+=10){
    for(var j=10;j+canvas.height/2<canvas.height;j+=10){
      ctx.beginPath();
      ctx.moveTo(canvas.width/2+i,0);
      ctx.lineTo(canvas.width/2+i,canvas.height);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.moveTo(0,canvas.height/2+j);
      ctx.lineTo(canvas.width,canvas.height/2+j);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.moveTo(canvas.width/2-i,0);
      ctx.lineTo(canvas.width/2-i,canvas.height);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.moveTo(0,canvas.height/2-j);
      ctx.lineTo(canvas.width,canvas.height/2-j);
      ctx.stroke();
      ctx.closePath();
    }
  }
}
function remap(obj,range){
  var boundary   = 0.6;
  var canvasW = 337.5;
  var canvasH = 250;
  var scale   =(canvasW>canvasH?canvasH:canvasW)*boundary; //統一XY的比例尺
  var re = [];
  var ori = 0.0.map(range.min,range.max,0,scale);
  for(var i=drawStart;i<obj.length;i++){
    re.push({
      x:parseFloat(obj[i]['real']['cx']).map(range.min,range.max,0,scale)-ori+canvasW/2,
      y:canvasH-(parseFloat(obj[i]['real']['cy']).map(range.min,range.max,0,scale)-ori+canvasH/2)
    });
  }
  return re;
}
function getRange(obj){
  var minX=0,maxX=0,minY=0,maxY=0;
  for(var i=drawStart;i<obj.length;i++){
    minX = (obj[i]['real']['cx']<minX?obj[i]['real']['cx']:minX);
    maxX = (obj[i]['real']['cx']>maxX?obj[i]['real']['cx']:maxX);
    minY = (obj[i]['real']['cy']<minY?obj[i]['real']['cy']:minY);
    maxY = (obj[i]['real']['cy']>maxY?obj[i]['real']['cy']:maxY);
  }
  return {
      minX:minX,
      maxX:maxX,
      minY:minY,
      maxY:maxY,
      min:(minX<minY?minX:minY),
      max:(maxX>maxY?maxX:maxY)
  };
}
