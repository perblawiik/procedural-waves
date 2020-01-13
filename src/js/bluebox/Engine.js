/**
 * Author: Per Blåwiik
 * Date: 2019-12-29
 */

// JavaScript components
import GameEditor from "./GameEditor";
import Time from "./Time";

import EventHandler from "./events/EventHandler";

import Scene from "./Scene";
import Camera from "./Camera";
import GameObject from "./GameObject";
import Mesh from "./Mesh";
import PointLightSource from "./PointLightSource";

import Matrix4 from "./math/Matrix4";

import ConnectionManager from "./ConnectionManager";

// Shaders
import ShaderHandle from "./ShaderHandle";
import PhongLightingShader from "./shaders/PhongLightingShader";
import AmbientShader from "./shaders/AmbientShader";
import ProceduralShader from "./shaders/ProceduralShader";

/***** Settings *****/
// Default camera position and rotation
const CAMERA_POSITION = [90.0, 34.0, -90.0];
const CAMERA_ROTATION = [-15.0, 140.0, 0.0];

// Enum struct for creating different shapes
const SHAPE = {
    CUBE: 0,
    SPHERE: 1,
    CYLINDER_SMOOTH: 2,
    CYLINDER_SHARP: 3,
    PLANE: 4
};

// 60 degrees field of view
const FIELD_OF_VIEW = Math.PI / 3.0;

const MS_PER_UPDATE = 4.0;
const UPDATE_TIME_STEP = 0.01;

class Engine {
    constructor() {
        // Scenes works like blocks in the game world.
        // The active scenes are based on the cameras distance to the origin of each scene.
        this.scenes = [];
        this.shaders = new Map();

        this.viewportAspectRatio = 1.0;
        this.lag = 0.0;
    }

    /*
    * @brief This is the engines main update function and is called every iteration of the main loop
    */
    run() {
        // Update game loop clock
        Time.update();

        // Time start of the loop
        //let startTime =  Time.now;

        // Process mouse and keyboard events
        this.processInputEvents();

        // Communication between GUI and the graphics engine
        this.processInternalSignals();

        // Add elapsed time to the lag variable
        this.lag += Time.deltaTime;

        // Make sure the update function is called on a constant rate
        while (this.lag >= MS_PER_UPDATE) {
            // Updates game object animations, AI, physics, etc.
            this.update();
            // Clear momentary events
            EventHandler.resetMouseEvents();
            this.lag -= MS_PER_UPDATE;
        }

        // Render graphics
        this.render(this.lag/MS_PER_UPDATE);

        // Hold each frame for a specified number of milliseconds (16 ms locks on roughly 60 fps)
        //while ((Time.now - startTime) < 16.0) ; // Sleep
    }

    update() {
        this.scenes.forEach((scene) => {
            scene.update(UPDATE_TIME_STEP);
        });
        this.camera.updateUniforms();
    }

    render(residualLag) {
        // Set the viewport to the canvas dimensions and update the aspect ratio for the projection matrix
        this.updateViewportDimensions();

        // Clear screen 3D
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);

        // Draw scenes
        this.gl.enable(this.gl.DEPTH_TEST);
        this.scenes.forEach((scene) => {
            //scene.updateLightPositions();
            scene.draw();
        });

        // Display fps and other useful information
        this.editor.render(this.scenes);
    }

    processInputEvents() {
        // Process editor commands
        this.editor.processUserInput();
    }

    processInternalSignals() {
        if(ConnectionManager.signalPending) {
            this.updateWaveParameter(ConnectionManager.message);
            ConnectionManager.resetSignal();
        }
    }

    // This function is called before the game loop is started
    preload() {
        // Initiate static classes
        Time.init();
        EventHandler.init();

        // Set up webgl 2D and 3D context from html canvas. Viewport and render settings are also set.
        this.setUpWebGL();

        // Create shaders
        let mainShader = new ShaderHandle(this.canvas, PhongLightingShader.vertex, PhongLightingShader.fragment);
        let ambientShader = new ShaderHandle(this.canvas, AmbientShader.vertex, AmbientShader.fragment);
        let proceduralShader = new ShaderHandle(this.canvas, ProceduralShader.vertex, ProceduralShader.fragment);

        // Add them to the shaders container
        this.shaders.set("phong", mainShader);
        this.shaders.set("ambient", ambientShader);
        this.shaders.set("procedural", proceduralShader);

        // Initialize the main camera
        this.camera = new Camera(this.shaders);
        this.camera.setPosition(CAMERA_POSITION);
        this.camera.setRotation(CAMERA_ROTATION);

        // Initialize the game engine editor used for managing the game scenes
        this.editor = new GameEditor(this.gl, this.context2D, this.shaders, this.camera, this.canvas);

        // Create and set the projection matrix for the shaders
        this.fieldOfView = FIELD_OF_VIEW;
        this.viewportAspectRatio = this.canvas.width / this.canvas.height;
        this.refreshProjectionMatrix();

        this.setUpScene();
    }

    setUpScene() {
        // Create a scene for the objects
        let defaultScene = new Scene(this.shaders);

        // Create a objects for the scene
        this.loadDefaultScene(defaultScene);

        // Add default scene to scenes
        this.scenes.push(defaultScene);
    }

    updateViewportDimensions() {
        // Calculate current aspect ratio
        let currentAspectRatio = this.canvas.width / this.canvas.height;

        // Check if the aspect ratio has changed before going further
        if (Math.abs(this.viewportAspectRatio - currentAspectRatio) < 0.001)
            return;

        // Save new aspect ratio
        this.viewportAspectRatio = currentAspectRatio;

        // Refresh the projection matrix and send set it in the shaders
        this.refreshProjectionMatrix();

        // Update the viewport dimensions to the canvas width
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }

    createGameObject (settings) {
        let mesh = new Mesh(this.gl);
        if (settings.shape === SHAPE.CUBE) {
            mesh.createCube();
        }
        else if (settings.shape === SHAPE.SPHERE) {
            mesh.createSphere(32);
        }
        else if (settings.shape === SHAPE.CYLINDER_SMOOTH) {
            mesh.createCylinderSmooth(32, 1, 1, 2);
        }
        else if(settings.shape === SHAPE.CYLINDER_SHARP) {
            mesh.createCylinderSharp(8, 1, 2);
        }
        else if (settings.shape === SHAPE.PLANE) {
            mesh.createPlane(200, 200);
        }
        mesh.setColor(settings.color);

        let obj = new GameObject (settings.name);
        obj.setPosition(settings.position);
        obj.setScale(settings.scale);
        obj.addMesh(mesh);
        obj.setShader(settings.shader);

        return obj;
    }

    createPointLightSource(settings) {
        // Create the light source component
        let lightSource = new PointLightSource(settings.name);
        lightSource.setPosition(settings.position);
        lightSource.setScale(settings.scale);
        lightSource.setLightColor(settings.color);
        lightSource.setAttenuation(settings.attenuation.kLinear, settings.attenuation.kQuadratic);

        // Create a model for the light source
        let lightSourceModel = new Mesh(this.gl);
        lightSourceModel.createSphere(8);
        lightSourceModel.setColor(settings.color);
        lightSource.addMesh(lightSourceModel);

        return lightSource;
    }

    loadDefaultScene(scene) {
        // Initiate procedural shader inputs
        this.updateWaveParameter("harmonicAmplitude");
        this.updateWaveParameter("harmonicWaveLength");
        this.updateWaveParameter("harmonicSpeed");
        this.updateWaveParameter("waveSharpness");
        this.updateWaveParameter("harmonicDirectionAngle");
        const color = ConnectionManager.getItemValue('waterColor');

        // Create four planes for visualizing a water surface
        let plane1 = this.createGameObject({
            shape: SHAPE.PLANE,
            name: 'Waves',
            scale: [1.0, 1.0, 1.0],
            position: [0.0, 10.0, 100.0],
            color: [color.r, color.g, color.b],
            shader: 'procedural'
        });

        // Add water planes to the scene
        scene.addGameObject(plane1);
        this.water =[];
        this.water.push(plane1);

        // Wall dimensions
        const wallHeight = 20.0;
        const wallWidth = 100.0;

        // Create gray floor
        scene.addGameObject(this.createGameObject({
            shape: SHAPE.CUBE,
            name: 'Floor',
            scale: [wallWidth, 0.1, wallWidth],
            position: [0.0, -0.1, 0.0],
            color: [0.75, 0.75, 0.75],
            shader: 'phong'
        }));

        // Create blue walls
        let wallColor = [1.0, 1.0, 1.0];
        scene.addGameObject(this.createGameObject({
            shape: SHAPE.CUBE,
            name: 'Left Wall',
            scale: [0.1, wallHeight, wallWidth],
            position: [-wallWidth, wallHeight, 0.0],
            color: wallColor,
            shader: 'phong'
        }));
        scene.addGameObject(this.createGameObject({
            shape: SHAPE.CUBE,
            name: 'Right Wall',
            scale: [0.1, wallHeight, wallWidth],
            position: [wallWidth, wallHeight, 0.0],
            color: wallColor,
            shader: 'phong'
        }));
        scene.addGameObject(this.createGameObject({
            shape: SHAPE.CUBE,
            name: 'Back Wall',
            scale: [wallWidth, wallHeight, 0.1],
            position: [0.0, wallHeight, -wallWidth],
            color: wallColor,
            shader: 'phong'
        }));
        scene.addGameObject(this.createGameObject({
            shape: SHAPE.CUBE,
            name: 'Front Wall',
            scale: [wallWidth, wallHeight, 0.1],
            position: [0.0, wallHeight, wallWidth],
            color: wallColor,
            shader: 'phong'
        }));

        // Create a point lights for the scene
        // Add the light source to our scene
        let atten = {// The attenuation constants should make the light travel a maximum distance of 325
            kLinear: 0.014,
            kQuadratic: 0.0007
        };

        let lampRadius = 1.0;
        let lampHeight = 2.0 * wallHeight - lampRadius;
        scene.addLightSource(this.createPointLightSource({
            name: "Middle Lamp",
            scale: [lampRadius, lampRadius, lampRadius],
            position: [0.0, lampHeight, -wallWidth*0.75],
            color: [1.0, 1.0, 1.0],
            attenuation: atten
        }));
        scene.addLightSource(this.createPointLightSource({
            name: "Right Lamp",
            scale: [lampRadius, lampRadius, lampRadius],
            position: [wallWidth*0.75, lampHeight, -wallWidth*0.75],
            color: [1.0, 1.0, 1.0],
            attenuation: atten
        }));
        scene.addLightSource(this.createPointLightSource({
            name: "Left Lamp",
            scale: [lampRadius, lampRadius, lampRadius],
            position: [-wallWidth*0.75, lampHeight, -wallWidth*0.75],
            color: [1.0, 1.0, 1.0],
            attenuation: atten
        }));
        scene.addLightSource(this.createPointLightSource({
            name: "Middle Lamp",
            scale: [lampRadius, lampRadius, lampRadius],
            position: [0.0, lampHeight, wallWidth*0.75],
            color: [1.0, 1.0, 1.0],
            attenuation: atten
        }));
        scene.addLightSource(this.createPointLightSource({
            name: "Right Lamp",
            scale: [lampRadius, lampRadius, lampRadius],
            position: [wallWidth*0.75, lampHeight, wallWidth*0.75],
            color: [1.0, 1.0, 1.0],
            attenuation: atten
        }));
        scene.addLightSource(this.createPointLightSource({
            name: "Left Lamp",
            scale: [lampRadius, lampRadius, lampRadius],
            position: [-wallWidth*0.75, lampHeight, wallWidth*0.75],
            color: [1.0, 1.0, 1.0],
            attenuation: atten
        }));
        // Middle section
        scene.addLightSource(this.createPointLightSource({
            name: "Middle Left Lamp",
            scale: [lampRadius, lampRadius, lampRadius],
            position: [-wallWidth*0.75, lampHeight, 0.0],
            color: [1.0, 1.0, 1.0],
            attenuation: atten
        }));
        scene.addLightSource(this.createPointLightSource({
            name: "Middle Right Lamp",
            scale: [lampRadius, lampRadius, lampRadius],
            position: [wallWidth*0.75, lampHeight, 0.0],
            color: [1.0, 1.0, 1.0],
            attenuation: atten
        }));
        scene.addLightSource(this.createPointLightSource({
            name: "Middle Lamp",
            scale: [lampRadius, lampRadius, lampRadius],
            position: [0.0, lampHeight, 0.0],
            color: [1.0, 1.0, 1.0],
            attenuation: atten
        }));
    }

    setUpWebGL() {
        // 2D Canvas for text display
        this.context2D = document.getElementById('text-canvas').getContext('2d');

        // WebGL canvas
        this.canvas = document.getElementById("gl-canvas");
        // Initialize the WebGL context
        this.gl = this.canvas.getContext("webgl");

        // If WebGL isn't supported
        if (!this.gl) {
            console.log("WebGL is not supported");
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return 0;
        }

        // Set the viewport dimensions to the same as the canvas
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        // Set clear color to dark blue, fully opaque
        this.gl.clearColor(0.02, 0.02, 0.02, 1.0);
        // Enable depth so that triangles closer to the camera don't get overlapped by those further away
        this.gl.enable(this.gl.DEPTH_TEST);
        // Only draw "visible" sides (memory saving)
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.cullFace(this.gl.BACK);
        this.gl.frontFace(this.gl.CCW);
    }

    refreshProjectionMatrix() {
        // Create a new projection matrix
        this.projectionMatrix = Matrix4.perspective(this.fieldOfView, this.viewportAspectRatio, 0.1, 10000.0);

        // Update the projection matrix in the editor
        this.editor.projectionMatrix = this.projectionMatrix;

        // Update the projection matrix for the shaders
        this.shaders.forEach((shader) => {
            shader.activate();
            shader.setProjectionUniform(this.projectionMatrix);
        });
    }

    updateWaveParameter(tag) {
        let newValue = ConnectionManager.getItemValue(tag);

        if(tag === "waterColor") {
            this.water.forEach((o)=> {
                o.meshes[0].setColor([newValue.r, newValue.g, newValue.b]);
            });
        }
        else {
            let proceduralShader = this.shaders.get("procedural");
            proceduralShader.activate();

            let uniformLocation = proceduralShader.getUniformLoc(tag);
            proceduralShader.setUniformFloat(uniformLocation, newValue);
        }
    }
}

export default Engine;