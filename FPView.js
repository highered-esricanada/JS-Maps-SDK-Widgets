
define([], function () {
    return class FPView{
        keyPressed = {};
        started= false;

        updatePosition = function(event) {
            var cam = this.view.camera.clone();
            cam.fov = 80;
            cam.tilt -= (event.movementY * this.lookSpeed);
            cam.heading += (event.movementX * this.lookSpeed);
            this.view.camera = cam;
        }.bind(this)

        constructor (args) {
            this.lookSpeed = 0.05;
            this.speed = 1.34; //metres per second;
            this.view = args.view;
            this.map = args.map;
            this.groundHeight = args.groundHeight;
            this.initEvents();
            if (args.ground == false){
                this.view.when(() => {
                    this.map.ground.navigationConstraint = {
                        type: "none"
                    };
                });
            }
        }
    
        initEvents = function() {
            var _this = this;
            
            this.view.on("click", ["Shift"], function (event) {
                if (!_this.started) {
                    _this.startTime = Date.now();
                    _this.lastUpdate = Date.now();
                    _this.view.map.ground.createElevationSampler(_this.view.extent).then(function (elevationSampler) {
                        this.elevationS = elevationSampler;
                    }.bind(_this)).catch(function (error) {
                        var x = 1;
                    }.bind(_this)).then(function () {
                        var canvas = document.getElementsByTagName("canvas")[0];
                        var cam = this.view.camera.clone();
                        cam.position.x = event.mapPoint.x;
                        cam.position.y = event.mapPoint.y;
                        cam.position = this.getElevation(cam.position);
                        cam.tilt = 90;
                        this.view.camera = cam;
                        canvas.requestPointerLock();
                    }.bind(_this));
                }
                else {
                    _this.view.navigation.mouseWheelZoomEnabled = true;
                    _this.started = false;
                    document.removeEventListener("mousemove", _this.updatePosition, false);
                }

                window.requestAnimationFrame(_this.keyControl);
                document.addEventListener('keydown', _this.updateKeys, false);
                document.addEventListener('keyup', _this.updateKeysDown, false);
                document.addEventListener('pointerlockchange', _this.lockChangeAlert, false);
            });

        }

        updateKeys = function(event) {
            var key = event.key.toLowerCase();
            this.keyPressed[key] = true;
        }.bind(this)

        updateKeysDown = function(event) {
            var key = event.key.toLowerCase();
            this.keyPressed[key] = false;
        }.bind(this)

        lockChangeAlert = function() {
            if (document.pointerLockElement == this.view['canvas']) {
                this.started = true;
                document.addEventListener("mousemove", this.updatePosition, false);
            }
            else {
                this.started = false;
                document.removeEventListener("mousemove", this.updatePosition, false);
            }
        }.bind(this)
    
        getElevation = function(position) {
            if (this.elevationS != undefined) {
                position.z = this.elevationS.queryElevation(position).z + this.groundHeight + 0.1;
            }
            else {
                position.z = this.groundHeight;
            }
            return position;
        }.bind(this)

        keyControl = function() {
            var time = Date.now();
            
            var deltaTime = (time - this.lastUpdate)/1000;
            this.lastUpdate = time
            var localSpeed = deltaTime * this.speed;                

            var cam = this.view.camera.clone();
            
            if (this.keyPressed['h'] || this.keyPressed['f'] || this.keyPressed['t'] || this.keyPressed['g']) {
                var x = Math.cos(cam.heading * Math.PI / 180);
                var y = Math.sin(cam.heading * Math.PI / 180);
                var strafe = localSpeed;

                if (this.keyPressed['shift']) {
                    strafe = localSpeed * 2;
                    localSpeed = localSpeed * 2;
                }
                if (this.keyPressed['h']) {
                    cam.position.x += x *  strafe;
                    cam.position.y -= y * strafe;
                }
                if (this.keyPressed['f']) {
                    cam.position.x -= x * strafe;
                    cam.position.y += y * strafe;
                }
                if (this.keyPressed['t']) {
                    cam.position.x += y * localSpeed;
                    cam.position.y += x * localSpeed;
                }
                if (this.keyPressed['g']) {
                    cam.position.x -= y * localSpeed;
                    cam.position.y -= x * localSpeed;
                }
                cam.position = this.getElevation(cam.position);
                if (cam.position.z != this.groundHeight + 0.1) {
                    this.view.camera = cam;
                }
            }
            window.requestAnimationFrame(this.keyControl);
        }.bind(this)
    };
});