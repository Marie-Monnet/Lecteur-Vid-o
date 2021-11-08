import "./lib/webaudio-controls.js";

const getBaseURL = () => {
	return new URL('.', import.meta.url);
};

let run = "play";
const template = document.createElement("template");

template.innerHTML = /*html*/`
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>  
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.0/font/bootstrap-icons.css">
<style>
.btn {
  background-color : black;
  color : #0f0;
  font-size: 12px;
}
p {
  font-size: 14px;
  text-decoration: underline;
}
i {
  color : #0f0;
  font-size: 16px;
}
</style>
  <div class="container-fluid p-3 rounded-lg" style="font-family: Verdana, sans-serif; font-size: 12px; background-color: black;">
    <div class="row m-3 p-3 rounded-lg" style="background-color: white;">
      <div class="col-sm-6">
        <video id="player" class="w-100" controls></video>
      </div>
      <div class="col-sm-6">
        <div class="row">
          <div class="col">
            <p>Gestion de la lecture :</p>
            <button type="button" class="btn px-4 py-2 mx-2" id="reload"><i class="bi bi-arrow-clockwise"></i> Reload</button>
            <button type="button" class="btn px-4 py-2 mx-2" id="playPause"><i class="bi bi-play-fill"></i> Play / <i class="bi bi-pause-fill"></i> Pause</button>
            <button type="button" class="btn px-4 py-2 mx-2" id="play"><i class="bi bi-play-fill"></i> Play</button>
            <button type="button" class="btn px-4 py-2 mx-2" id="pause"><i class="bi bi-pause-fill"></i> Pause</button>
            <hr>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <p>Gestion des séquences :</p>
            <button type="button" class="btn px-4 py-2 mx-2" id="debut"><i class="bi bi-skip-start-fill"></i> Au début</button>
            <button type="button" class="btn px-4 py-2 mx-2" id="milieu"><i class="bi bi-align-middle"></i> Au milieu</button>
            <button type="button" class="btn px-4 py-2 mx-2" id="fin"><i class="bi bi-skip-end-fill"></i> A la fin</button>
            <button type="button" class="btn px-4 py-2 mx-2" id="info"><i class="bi bi-info-circle-fill"></i> Get Info</button>
            <hr>
            </div>
        </div>
        <div class="row">
          <div class="col">
            <p>Gestion de la vitesse :</p>
            <button type="button" class="btn px-4 py-2 mx-2" id="avance10"><i class="bi bi-arrow-clockwise"></i> +10 sec</button>
            <button type="button" class="btn px-4 py-2 mx-2" id="recule10"><i class="bi bi-arrow-counterclockwise"></i> -10 sec</button>
            Vitesse :<webaudio-slider class="btn px-0 py-2 mx-2" id="vitesse" min=0.5 max=10 value=1 step="0.5" tooltip="%s" width="200" height="20" colors="#0f0;#333;#ff0"></webaudio-slider>
            <br><br>
            <button type="button" class="btn px-4 py-2 mx-2" id="vitesse05">x0.5</button>
            <button type="button" class="btn px-4 py-2 mx-2" id="vitesse1">x1</button>
            <button type="button" class="btn px-4 py-2 mx-2" id="vitesse2">x2</button>
            <button type="button" class="btn px-4 py-2 mx-2" id="vitesse4">x4</button>
            <button type="button" class="btn px-4 py-2 mx-2" id="vitesse8">x8</button>
            <hr>
            </div>
        </div>
        <div class="row">
          <div class="col">
            <p>Gestion du volume sonore :</p>
            <button type="button" class="btn px-4 py-2 m-2" id="mute"><i class="bi bi-volume-mute-fill"></i> Mute / <i class="bi bi-volume-down-fill"></i> Unmute</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <webaudio-knob id="volumeTurn" min=0 max=1 value=0.5 step="0.1" tooltip="%s" src="./assets/KNOB.png"></webaudio-knob>
            <hr>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <p>Gestion de la fréquence du son :</p>
            <div class="eq">
              <div class="controls">
                <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;60Hz</label>
                <input type="range" value="0" step="1" min="-30" max="30" oninput="changeGain(this.value, 0);"></input>
                <output id="gain0">0 dB</output>
              </div>
              <div class="controls">
                <label>&nbsp;&nbsp;&nbsp;&nbsp;170Hz</label>
                <input type="range" value="0" step="1" min="-30" max="30" oninput="changeGain(this.value, 1);"></input>
                <output id="gain1">0 dB</output>
              </div>
              <div class="controls">
                <label>&nbsp;&nbsp;&nbsp;&nbsp;350Hz</label>
                <input type="range" value="0" step="1" min="-30" max="30" oninput="changeGain(this.value, 2);"></input>
                <output id="gain2">0 dB</output>
              </div>
              <div class="controls">
                <label>&nbsp;&nbsp;1000Hz</label>
                <input type="range" value="0" step="1" min="-30" max="30" oninput="changeGain(this.value, 3);"></input>
                <output id="gain3">0 dB</output>
              </div>
              <div class="controls">
                <label>&nbsp;&nbsp;3500Hz</label>
                <input type="range" value="0" step="1" min="-30" max="30" oninput="changeGain(this.value, 4);"></input>
                <output id="gain4">0 dB</output>
              </div>
              <div class="controls">
                <label>10000Hz</label>
                <input type="range" value="0" step="1" min="-30" max="30" oninput="changeGain(this.value, 5);"></input>
                <output id="gain5">0 dB</output>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br><br>
    </div>
  </div>
`;

class MyVideoPlayer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  fixRelativeURLs () {
    //Pour les knobs
    let knobs = this.shadowRoot.querySelectorAll('webaudio-knob');
    knobs.forEach((e) => {
      let path = e.getAttribute('src');
      e.src = getBaseURL() + '/' + path;
    });
  }

  connectedCallback() {
    //appelé avant affichage du composant
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.player = this.shadowRoot.querySelector("#player");
    //recup des attributs
    this.src = this.getAttribute("src");
    this.player.src = this.src;

    //déclarer les écouteurs sur les boutons
    this.definitEcouteurs();

    //fix relative URL
    this.fixRelativeURLs();
  }

  definitEcouteurs() {
    this.shadowRoot.querySelector("#reload").onclick = () => {
      this.player.load();
    }
    this.shadowRoot.querySelector("#playPause").onclick = () => {
      if (this.player.paused == true) {
        this.player.play();
      }
      else {
        this.player.pause();
      }
    }
    this.shadowRoot.querySelector("#play").onclick = () => {
      this.player.play();
    }
    this.shadowRoot.querySelector("#pause").onclick = () => {
      this.player.pause();
    }
    this.shadowRoot.querySelector("#debut").onclick = () => {
      this.player.currentTime = 0;
      this.player.play();
    }
    this.shadowRoot.querySelector("#milieu").onclick = () => {
      this.player.currentTime = this.player.duration/2;
    }
    this.shadowRoot.querySelector("#fin").onclick = () => {
      this.player.currentTime = this.player.duration-1;
    }
    {/* <webaudio-slider id="duree" min=0 max=2 value=0 step="1" tooltip="%s" width="100" height="20" colors="#0f0;#000;#ff0"></webaudio-slider>
    this.shadowRoot.querySelector("#duree").oninput = (event) => {
      const duree = parseFloat(event.target.value);
      this.player.curentTime = duree;
    } */}
    this.shadowRoot.querySelector("#info").onclick = () => {
      console.log("Durée de la vidéo : " + this.player.duration);
      console.log("Temps courant : " + this.player.currentTime);
    }
    this.shadowRoot.querySelector("#avance10").onclick = () => {
      this.player.currentTime += 10;
    }
    this.shadowRoot.querySelector("#recule10").onclick = () => {
      this.player.currentTime -= 10;
    }
    this.shadowRoot.querySelector("#vitesse05").onclick = () => {
      this.player.playbackRate = 0.5;
    }
    this.shadowRoot.querySelector("#vitesse1").onclick = () => {
      this.player.playbackRate = 1;
    }
    this.shadowRoot.querySelector("#vitesse2").onclick = () => {
      this.player.playbackRate = 2;
    }
    this.shadowRoot.querySelector("#vitesse4").onclick = () => {
      this.player.playbackRate = 4;
    }
    this.shadowRoot.querySelector("#vitesse8").onclick = () => {
      this.player.playbackRate = 8;
    }
    this.shadowRoot.querySelector("#vitesse").oninput = (event) => {
      const vit = parseFloat(event.target.value);
      this.player.playbackRate = vit;
    }
    this.shadowRoot.querySelector("#mute").onclick = (event) => {
      if (this.player.volume == 0) {
        this.player.volume = 1;
      }
      else {
        this.player.volume = 0;
      }
    }
    this.shadowRoot.querySelector("#volumeTurn").oninput = (event) => {
      const vol = parseFloat(event.target.value);
      this.player.volume = vol;
    }

    //buil an equalizer with multiple biquad filters
    var ctx = window.AudioContext || window.webkitAudioContext;
    var context = new ctx();

    var mediaElement = document.getElementById('player');
    var sourceNode = context.createMediaElementSource(mediaElement);
    mediaElement.onplay = function() {
      context.resume();
    }
    // create the equalizer. It's a set of biquad Filters

    var filters = [];

        // Set filters
        [60, 170, 350, 1000, 3500, 10000].forEach(function(freq, i) {
          var eq = context.createBiquadFilter();
          eq.frequency.value = freq;
          eq.type = "peaking";
          eq.gain.value = 0;
          filters.push(eq);
        });

    // Connect filters in serie
      sourceNode.connect(filters[0]);
      for(var i = 0; i < filters.length - 1; i++) {
          filters[i].connect(filters[i+1]);
        }

    // connect the last filter to the speakers
    filters[filters.length - 1].connect(context.destination);

    function changeGain(sliderVal,nbFilter) {
      var value = parseFloat(sliderVal);
      filters[nbFilter].gain.value = value;
      
      // update output labels
      var output = document.querySelector("#gain"+nbFilter);
      output.value = value + " dB";
    }
  } 
}


  // API de mon composant

customElements.define("my-player", MyVideoPlayer);
