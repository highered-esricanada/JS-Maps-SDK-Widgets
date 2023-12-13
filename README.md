# ArcGIS Maps SDK for JavaScript Widgets

This repository contains widgets developed for the [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/latest/). The widgets are as follows:

1. FPView - This widget allows the user of your app to Shift-click on the map to move the camera to ground level and use the T, F, G, and H keys to move along the ground. Holding down the shift key allows the user to move faster and moving the mouse controls the camera view.
1. PerfView - This widget is based on the sample code from Esri found [here](https://developers.arcgis.com/javascript/latest/sample-code/sceneview-memory/). You can view memory usage per layer as well as the number of displayed features. The current and average frame rate is also displayed.

## Requirements
The widgets have been tested with the ArcGIS Maps SDK for JavaScript version 4.28. You will need to include the JavaScript file for the widget you're interested in using in the same directory as your html file and follow the instruction below to instiate the widget.

## Instructions for adding the widget
1. Add the following script tags before the inclusion of the ArcGIS Maps SDK for JavaScript.
    ```javascript
     <script type="text/javascript">
      var locationPath = location.pathname.replace(/\/[^\/]+$/, "");
      var dojoConfig = {
        packages: [
          {
              name: "localWidget",
              location: locationPath
          }
        ]
      };

    </script>
    ```
1. Include the custom widgets in your require block, as shown in the following sample code:
    ```javascript
    require([
        "esri/WebScene",
        "esri/views/SceneView",
        "localWidget/FPView",
        "localWidget/PerfView"
      ], (WebScene, SceneView, FPView, PerfView) => {
    ```

1. Instantiate the widget as shown below. The arguments for the FPView and Perf widget are defined later in this document.
    ```javascript
    let fpview = new FPView({view: view, map:webscene, ground:false, groundHeight:1.7 });
    let fps = new PerfView({view: view, position:"top-left", transparent:true, minimal:false});
     ```

## Demos

### FPView
![demo](/fpview.gif)
1. [Building Scene Layer]("building-scene-layer-slice.html") - The FPView widget has been added to this Esri [sample](https://developers.arcgis.com/javascript/latest/sample-code/building-scene-layer-slice/). This lets you walk into the building to get a first person perspective of the interior.
1. [Integrated Mesh Layer]("layers-integratedmeshlayer.html") - The FPView widget has been added to this Esri [sample](https://developers.arcgis.com/javascript/latest/sample-code/layers-integratedmeshlayer/). The ground parameter is set to true which prevents the use from walking through the integrated mesh when in first person view.

| Argument Name | Type | Description |
| --- | --- | --- |
| view | [Sceneview](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-SceneView.html)  | The current view |
| ground | Boolean | If false, underground navigation is allowed, enabling the user to move the camera through scene layers |
| groundHeight | Float | The height of the camera in first person view | 


### PerfView
![demo](/perfview.gif)
1.[Building Scene Layer]("building-scene-layer-slice.html") - The PerView widget has been added to this [sample](https://developers.arcgis.com/javascript/latest/sample-code/sceneview-memory/) from where the code to calculate memory usage. The arguments are as follows:

| Argument Name | Type | Description |
| --- | --- | --- |
| `view` | [Sceneview](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-SceneView.html) or [MapView]("esri/views/MapView") | The current view |
| `position` | String ('top-right' or 'top-left' or 'bottom-right' or 'bottom-left') | Where to place the widget |
| `transparent` (optional) | Boolean | Control whether the widget contains a background
| `minimal` (optional) | Boolean | Create a smaller widget panel that doesn't itemize the memory of each layer |
