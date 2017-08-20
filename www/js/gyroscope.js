var gyroObj = {x:'',y:'',z:'',xG:'',yG:'',zG:'',a:'',b:'',g:'',real:'',img:''};
var gyro = {
  handleMotionEvent:function(event){
   try{
      this.x.innerHTML = gyroObj.x = event.accelerationIncludingGravity.x.toFixed(4);
    	this.y.innerHTML = gyroObj.y  = event.accelerationIncludingGravity.y.toFixed(4);
    	this.z.innerHTML = gyroObj.z  = event.accelerationIncludingGravity.z.toFixed(4);
    	this.x2.innerHTML = gyroObj.xG = event.acceleration.x.toFixed(4);
    	this.y2.innerHTML = gyroObj.yG = event.acceleration.y.toFixed(4);
    	this.z2.innerHTML = gyroObj.zG = event.acceleration.z.toFixed(4);
    }
    catch(e){
    //  console.log('some value can\'t be read');
    }
  	if(this.trigger){
  		if(this.second%2==0 && !this.st){
  			this.st = true;
  			this.magicZ[this.second/2] = [event.acceleration.z.toFixed(4),event.interval];
  			this.st = false;
  		}
  	}
  },
  start:function(){
    if(this.trigger==false){
       this.trigger = true;
       this.myVar = setInterval(this.myTimer ,500);
    }
  },
  stop:function(){
    if(this.trigger==true){
       $('#hahaha').html(JSON.stringify(this.magicZ));
       clearInterval(this.myVar);
       this.second = 0;
       this.magicZ = [];
       this.trigger= false;
    }
  },
  myTimer:function(){
    this.second++;
    document.getElementById('time').innerHTML = this.second;
  },
  init:function(){
      this.trigger = false;
      this.magicZ  = [];
      this.second  = 0;
      this.st      = false;
      this.x = document.getElementById('x');
      this.y = document.getElementById('y');
      this.z = document.getElementById('z');
      this.x2= document.getElementById('x2');
      this.y2= document.getElementById('y2');
      this.z2= document.getElementById('z2')
      this.a = document.getElementById('alpha');
      this.b = document.getElementById('beta');
      this.g = document.getElementById('gamma');
  }
};


document.addEventListener('deviceready', function(){
  //gyro.init();
  if(window.DeviceOrientationEvent) {
  	 window.addEventListener('deviceorientation', function(event) {
       try{
         document.getElementById('inertia_alpha').innerHTML = event.webkitCompassHeading.toFixed(4);
       }
       catch(e){}
       try{
         gyro.a.innerHTML = gyroObj.a = event.webkitCompassHeading.toFixed(4);
  			 gyro.b.innerHTML = gyroObj.b = event.beta.toFixed(2);
  			 gyro.g.innerHTML = gyroObj.g = event.gamma.toFixed(2);
       }
       catch(e){
         //   console.log('some value can\'t be read');
       }
      },false);
  }
  else{
    console.log('not supported');
  }
  window.addEventListener("devicemotion", gyro.handleMotionEvent, true);
}, false);
