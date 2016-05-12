
let TextureLoader = {
  textures: {},
  imageObjects: {},

  load: function(name, gl){
    return new Promise(function(resolve){
      let imageObject = new Image();
      imageObject.onload = function() {
        resolve();
      }
      imageObject.src = 'images/' + name;
      this.imageObjects[name] = imageObject;
    }.bind(this));
  },
  get: function(name){
    return this.textures[name];
  },
  createTexture: function(name, imageObject, gl){
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageObject);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
    return texture;
  },
  buildTextures: function(gl){
    for (name in this.imageObjects){
      let imageObject = this.imageObjects[name];
      this.textures[name] = this.createTexture(name, imageObject, gl);
    }
  }

}
module.exports = TextureLoader;

