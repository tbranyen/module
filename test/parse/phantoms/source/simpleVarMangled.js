function(x){

var funcFour = x('funcFour');

var Three = function (arg) {
  return arg + '-' + funcFour.suffix();
};

Three.suffix = function () {
  return 'THREE_SUFFIX';
};

x.export = Three;

}