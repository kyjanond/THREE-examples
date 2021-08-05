const assetUrls = {
  bb8:require("../assets/models/bb8/scene.glb").default,
  mech:require("../assets/models/mech_drone/scene.glb").default
}
Object.values(assetUrls).forEach(x=>console.debug(x));

export default assetUrls;