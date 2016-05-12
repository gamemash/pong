attribute vec2 vertexPosition;
uniform vec2 position;
uniform vec2 screenSize;
uniform vec2 blockAspects;

void main(){
  vec2 tileSize = vec2(8);
  //vec2 screenSize = vec2(320);
  gl_Position = vec4((vertexPosition * blockAspects + position) * vec2(2) / screenSize * tileSize - vec2(1) , 0, 1);

}
