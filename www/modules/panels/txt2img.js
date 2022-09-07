import {PromptBuilder} from "/modules/widgets/promptbuilder.js";

export class TextToImage extends HTMLElement {
  static ids = ["steps", "scale", "width", "height", "seed", "prompt"];

  constructor() {
    super();
    let shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = `
      <link rel=stylesheet href=style.css>
      <style>
        :host {
          width: 400px;
          flex: auto;
          background-color: #ccc;
          border-radius: 8px;
          padding: 8px;
        }
      </style>

      <h1 id="titlebar">txt2image</h1>

      <fs-promptbuilder id=promptbuilder></fs-promptbuilder>
      <textarea placeholder=prompt id=prompt>macro photograph, velcro, blue light, color grading</textarea>

      <details>
        <h2>Width</h2>
        <input type=range step=64 min=256 max=1024 value=704 id=width>
        <h2>Height</h2>
        <input type=range step=64 min=256 max=1024 value=448 id=height>
        <button id=squarePresetButton>Square</button>
        <button id=portraitPresetButton>Portrait</button>
        <button id=landcapePresetButton>Landscape</button>

        <summary>Options</summary>
        <h2>Seed</h2>
        <input type=number value=1337 id=seed>

        <h2>Scale</h2>
        <input type=range value=7.5 id=scale>
        <button id=defaultScaleButton>Default 7.5</button>

        <h2>Steps</h2>
        <input type=range step=1 value=30 id=steps min=1 max=100>
        <button id=thirtyPresetButton>30</button>
        <button id=hundredPresetButton>100</button>
      </details>

      <button id=generateButton>Generate</button>
      <button id=nextButton>Next</button>
    `;

    shadow.getElementById("generateButton")
      .addEventListener("click", e => { this.generate() });

    shadow.getElementById("nextButton")
      .addEventListener("click", e => {
        let seedInput = shadow.getElementById("seed");
        seedInput.value = Number.parseInt(seedInput.value) + 1;

        console.log(this);
        this.generate();
    });

    let widthSlider = shadow.getElementById("width");
    let heightSlider = shadow.getElementById("height");
    let stepsSlider = shadow.getElementById("steps");
    let scaleSlider = shadow.getElementById("scale");

    let squarePresetButton = shadow.getElementById("squarePresetButton");
    squarePresetButton.addEventListener("click", e => {
      widthSlider.value = 512;
      heightSlider.value = 512;
    });

    let portraitPresetButton = shadow.getElementById("portraitPresetButton");
    portraitPresetButton.addEventListener("click", e => {
      widthSlider.value = 448;
      heightSlider.value = 704;
    });

    let landcapePresetButton = shadow.getElementById("landcapePresetButton");
    landcapePresetButton.addEventListener("click", e => {
      widthSlider.value = 704;
      heightSlider.value = 448;
    });

    let thirtyPresetButton = shadow.getElementById("thirtyPresetButton");
    thirtyPresetButton.addEventListener("click", e => {
      stepsSlider.value = 30;
    });

    let hundredPresetButton = shadow.getElementById("hundredPresetButton");
    hundredPresetButton.addEventListener("click", e => {
      stepsSlider.value = 100;
    });

    let defaultScaleButton = shadow.getElementById("defaultScaleButton");
    defaultScaleButton.addEventListener("click", e => {
      scaleSlider.value = 7.5;
    });

    shadow.getElementById('promptbuilder').setEditor(
      shadow.getElementById('prompt'));

    this.shadow = shadow;
  }

  setArgs(params) {
    for (let id of TextToImage.ids) {
      this.getElementById(id).value = params[id];
    }
  }

  async generate() {
    // grab parameters
    let params = {};
    for (let id of TextToImage.ids) {
      params[id] = this.shadow.getElementById(id).value
    }

    const response = await fetch("/generate/", {
      method: "POST",
      cache: "no-cache",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify(params)
    });
    let uri = URL.createObjectURL(await response.blob());
    document.getElementById("detail").setImage(uri);
    document.getElementById("detail").setArgs(params);
    document.getElementById("historyList").addImage(uri);
  }
}

window.customElements.define('fs-txt2image', TextToImage);
