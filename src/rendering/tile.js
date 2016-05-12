let ShaderHelper = require('./shader_helper.js');
let Renderer = require('../renderer.js');

let Tile = {
  setup: function(){
    let gl = Renderer.gl;
    Tile.shaderProgram = ShaderHelper.initShaders('tile', gl);
    Tile.buffer = ShaderHelper.initBuffers(gl);
    gl.useProgram(Tile.shaderProgram);
    gl.uniform2fv(gl.getUniformLocation(Tile.shaderProgram, "screenSize"), [gl.drawingBufferWidth, gl.drawingBufferHeight]);
  },
  display: function(data){
    let position = data.get('position').toArray();
    let size = data.get('size').toArray();

    Tile.render(position, size);
  },
  render: function(position, blockAspects){
    let gl = Renderer.gl;
    gl.useProgram(Tile.shaderProgram);
    gl.bindBuffer(gl.ARRAY_BUFFER, Tile.buffer);
    let vertexPositionAttribute = gl.getAttribLocation(Tile.shaderProgram, "vertexPosition");
    gl.vertexAttribPointer(vertexPositionAttribute, 2, gl.FLOAT, false, 0, 0);

    let positionUniformLocation = gl.getUniformLocation(Tile.shaderProgram, "position");
    gl.uniform2fv(positionUniformLocation, position);

    gl.uniform2fv(
        gl.getUniformLocation(Tile.shaderProgram, "blockAspects"),
        blockAspects);
    
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  },
};

module.exports = Tile;
