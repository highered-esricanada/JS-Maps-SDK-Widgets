
define([], function () {
    return class PerfView{
       
        started= false;

        updatePosition = function(event) {
            var cam = this.view.camera.clone();
            cam.fov = 80;
            cam.tilt -= (event.movementY * this.lookSpeed);
            cam.heading += (event.movementX * this.lookSpeed);
            this.view.camera = cam;
        }.bind(this)

        constructor (args) {
            this.fps = document.getElementById("fps");
            this.startTime = Date.now();
            this.minFps = Math.min();
            this.maxFps =  Math.max()
            this.total = 0;
            this.avgFps = 0;
            this.tf = 0;
            this.view = args.view;
            this.position = args.position;
            this.transparent = args.transparent || false;
            this.minimal = args.minimal || false;
            this.initEvents();
        }
    
        initEvents = function() {
            let textColour = 'black';
            let transparency = 1;
            let shadow = "";
            let hover = "";
            if (this.transparent){
                transparency = 0;
                textColour = 'black';
                shadow = "box-shadow: 0 0; "
                hover = `
                #performanceInfo:hover {
                    backdrop-filter: blur(15px);
                }`
            }
               
        
            var styleString = `
            #performanceInfo {
                background-color: rgba(255, 255, 255, ${transparency});
                padding: 1em;
                color: ${textColour};
                ${shadow} 
              }

              ${hover}
        
              table {
                margin: 1em 0;
              }
        
              .center {
                text-align: center;
              }

              .fps{
                padding-right:20px;
              }
            `;

            const style = document.createElement('style');
            style.textContent = styleString;
            document.head.append(style);

            var div = document.createElement('div');
            div.innerHTML = '<div id="performanceInfo"><h4 id="title"></h4><table id="fps"></table><table id="memory"></table><table id="count"></table></div>'; 
            document.body.appendChild(div);
            this.view.when(() => {
                this.view.ui.add('performanceInfo',this.position)
                this.updatePerformanceInfo();
                window.requestAnimationFrame(this.calcFPS);
              });

        }.bind(this);


        addFramerateRow = function(fpsContainer, title, value, attributes = ""){
            if (value != null){
                const row = document.createElement("tr");
                row.innerHTML = `<td>${title}</td><td ${attributes}>${value.toFixed(1)}</td>`;
                fpsContainer.appendChild(row);
            }
        }

        calcFPS = function(){
            var time = Date.now();
            this.fps = 1000 / (time - this.startTime);
            this.total += ((time - this.startTime) / 1000);
            this.startTime = time;
            this.tf++;

            this.minFps = Math.min(this.fps, this.minFps);
            this.maxFps = Math.max(this.fps, this.maxFps);
            this.avgFps = this.tf / this.total;
            window.requestAnimationFrame(this.calcFPS);
        }.bind(this);

        updatePerformanceInfo = function(){
            const performanceInfo = this.view.performanceInfo;
            this.updateMemoryTitle(performanceInfo.usedMemory, performanceInfo.totalMemory, performanceInfo.quality);
            if (!this.minimal) this.updateTables(performanceInfo);
            setTimeout(this.updatePerformanceInfo, 1000);
          }.bind(this);
  
          updateMemoryTitle = function(used, total, quality) {
            const title = document.getElementById("title");
            title.innerHTML = `Memory: ${this.getMB(used)}MB/${this.getMB(total)}MB  -  Quality: ${Math.round(100 * quality)} %`;
            this.avgFps = this.tf / this.total;
            const frameRate = document.getElementById("fps");
            frameRate.innerHTML = '<tr></tr>';
            this.addFramerateRow(frameRate, "Frames Per Second:", this.fps);
            this.addFramerateRow(frameRate, "Average FPS:",this.avgFps, 'class="fps"');
            
          }.bind(this);
  
          updateTables = function(stats) {
           
            const tableMemoryContainer = document.getElementById("memory");
            const tableCountContainer = document.getElementById("count");
            tableMemoryContainer.innerHTML = `<tr>
              <th>Resource</th>
              <th>Memory(MB)</th>
            </tr>`;
            for (var layerInfo of stats.layerPerformanceInfos) {
              const row = document.createElement("tr");
              row.innerHTML = `<td>${layerInfo.layer.title}</td><td class="center">${this.getMB(layerInfo.memory)}</td>`;
              tableMemoryContainer.appendChild(row);
            }
  
            tableCountContainer.innerHTML = `<tr>
              <th>Layer - Features</th>
              <th>Displayed / Max<br>(count)</th>
              <th>Total<br>(count)</th>
            </tr>`;
  
            for (var layerInfo of stats.layerPerformanceInfos) {
              if (layerInfo.maximumNumberOfFeatures) {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${layerInfo.layer.title}`;
                row.innerHTML += `<td class="center">${
                  layerInfo.displayedNumberOfFeatures ? layerInfo.displayedNumberOfFeatures : "-"
                } / ${layerInfo.maximumNumberOfFeatures ? layerInfo.maximumNumberOfFeatures : "-"}</td>`;
                row.innerHTML += `<td class="center">${
                  layerInfo.totalNumberOfFeatures ? layerInfo.totalNumberOfFeatures : "-"
                }</td>`;
                tableCountContainer.appendChild(row);
              }
            }
          }.bind(this)
  
          getMB = function(bytes) {
            const kilobyte = 1024;
            const megabyte = kilobyte * 1024;
            return Math.round(bytes / megabyte);
          }.bind(this)
 
    };
});