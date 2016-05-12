
module.exports = {
  setupRenderer: function(canvas, width, height){
    let gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    gl.clearColor(0.1, 0.1, 0.1, 1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, width, height);
    canvas.width = width;
    canvas.height = height;
    this.gl = gl;
  },
  clear: function(){
    let gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }
}
