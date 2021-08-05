import { EventEmitter2 } from "eventemitter2";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

//load draco decoder

require("../lib/draco/draco_wasm_wrapper.js");
require("../lib/draco/draco_decoder.wasm");

export class GLBAssetLoader extends EventEmitter2{
  loader:GLTFLoader;
  isLoaded:boolean;
  constructor(){
    super();
    
    const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('./lib/draco/');

    this.loader = new GLTFLoader();
    this.loader.setDRACOLoader(dracoLoader);
  }
  
  async loadModels(urls:string[]){
    const promises = []

    for (let url of urls) {
      promises.push(this.loadModel(url))
    }
    return Promise.all(promises);
  }

  async loadModel(url:string){
    return this.loader.loadAsync(
      url,
      (xhr:ProgressEvent)=>onProgress("Geometry",xhr)
    ).then(
      (gltf:GLTF)=>{
        this.onModelLoaded(url,gltf);
        return gltf;
      }
    ).catch(
      (error:ErrorEvent)=>{
        this.onError(url,error);
        console.error(error);
      }
    )
  }

  onModelLoaded(url:string,gltf:GLTF){
    console.debug(`modelLoaded ${url}`);
    this.emit("modelLoaded",{url:url,model:gltf});
  }

  onError(url:string,error:ErrorEvent){
    console.debug( 'An error happened' );
    console.debug(error);
  }
}

function onProgress(
  loaderName:string,
  xhr:ProgressEvent)
{

}

export const glbAssetLoaderSingleton = new GLBAssetLoader();