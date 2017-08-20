math.config({
  number: 'BigNumber',
  precision: 10
});
var coorSetting = [
                {x:math.parse('x * cos((90-y) deg)')  ,y:math.parse('x * sin((90-y) deg)')},
                {x:math.parse('x * cos((y-90) deg)')  ,y:math.parse('x * sin((y-90) deg)')},
                {x:math.parse('x * cos((270-y) deg)'),y:math.parse('x * sin((270-y) deg)')},
                {x:math.parse('x * cos((y-270) deg)'),y:math.parse('x * sin((y-270) deg)')}
              ];
var coorFixer   = [[1,1],[1,-1],[-1,-1],[-1,1]];
var disSetting  = math.parse('x * tan(y deg)');
var ceilSetting = math.parse('x * tan((y-90) deg)');

function getDistance(deviceHeight,alpha,beta){
  var obj = {x:math.bignumber(deviceHeight),y:math.bignumber(beta)};
  var distance = disSetting.eval(obj);
  var re = getCoordinate(alpha, distance);
  re['distance'] = math.format(distance);
  return re;
}

function getCoordinate(alpha,distance){
  var	obj   = {x:math.bignumber(distance),y:math.bignumber(alpha)};
  var index = parseInt(alpha/90);
  return {cx:math.format(coorSetting[index]['x'].eval(obj))*coorFixer[index][0],cy:math.format(coorSetting[index]['y'].eval(obj))*coorFixer[index][1]};
}

function getCeilingHeight(deviceHeight,firstDistance,beta_ceiling){
  var obj = {x:math.bignumber(firstDistance), y:math.bignumber(beta_ceiling)};
  return math.format(math.add(ceilSetting.eval(obj),math.bignumber(deviceHeight)));
}


//console.log(getDistance(define_height, 328.2569,75.01));
//console.log(getCeilingHeight(define_height,578.8719,93.77));
