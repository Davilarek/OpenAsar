if ('<notrack>' === 'true') { // Disable sentry
  try {
    window.__SENTRY__.hub.getClient().getOptions().enabled = false;

    Object.keys(console).forEach(x => console[x] = console[x].__sentry_original__ ?? console[x]);
  } catch { }
}

let lastBgPrimary = '';
const themesync = async () => {
  const getVar = (name, el = document.body) => el && (getComputedStyle(el).getPropertyValue(name) || getVar(name, el.parentElement))?.trim();

  const bgPrimary = getVar('--background-primary');
  if (!bgPrimary || bgPrimary === '#36393f' || bgPrimary === '#fff' || bgPrimary === lastBgPrimary) return; // Default primary bg or same as last
  lastBgPrimary = bgPrimary;

  const vars = [ '--background-primary', '--background-secondary', '--brand-experiment', '--header-primary', '--text-muted' ];

  let cached = await DiscordNative.userDataCache.getCached() || {};

  const value = `body { ${vars.reduce((acc, x) => acc += `${x}: ${getVar(x)}; `, '')} }`;
  const pastValue = cached['openasarSplashCSS'];
  cached['openasarSplashCSS'] = value;

  if (value !== pastValue) DiscordNative.userDataCache.cacheUserData(JSON.stringify(cached));
};


// Settings info version injection
setInterval(() => {
  const host = [...document.querySelectorAll('[class*="info-"] [class*="line-"]')].find(x => x.textContent.startsWith('Host '));
  if (!host || document.querySelector('#openasar-ver')) return;

  const el = document.createElement('span');
  el.id = 'openasar-ver';

  el.textContent = 'OpenAsar <hash>';
  el.onclick = () => DiscordNative.ipc.send('DISCORD_UPDATED_QUOTES', 'o');

  host.append(document.createTextNode(' | '), el);
}, 2000);

const injCSS = x => {
  const el = document.createElement('style');
  el.appendChild(document.createTextNode(x));
  document.body.appendChild(el);
};

injCSS(`
[class^="socialLinks-"] + [class^="info-"] {
  padding-right: 0;
}

#openasar-ver {
  text-transform: none;
  cursor: pointer;
}

#openasar-ver:hover {
  text-decoration: underline;
  color: var(--text-normal);
}`);

injCSS(`<css>`);

openasar = {}; // Define global for any mods which want to know / etc

setInterval(() => { // Try init themesync
  try {
    themesync();
  } catch (e) { }
}, 10000);
themesync();

function spoofFingerprints() {
  function spoofAudioContext() {
    // code extracted from AudioContext spoofer addon by Yubi
    // https://mybrowseraddon.com/audiocontext-defender.html
    var inject = function () {
      const context = {
        "BUFFER": null,
        "getChannelData": function (e) {
          e.prototype.getChannelData = new Proxy(e.prototype.getChannelData, {
            apply(target, self, args) {
              const results_1 = Reflect.apply(target, self, args);
              //
              if (context.BUFFER !== results_1) {
                context.BUFFER = results_1;
                // window.top.postMessage("audiocontext-fingerprint-defender-alert", '*');
                console.log("Blocking AudioContext fingerprint attempt");
                //
                for (let i = 0; i < results_1.length; i += 100) {
                  let index = Math.floor(Math.random() * i);
                  results_1[index] = results_1[index] + Math.random() * 0.0000001;
                }
              }
              //
              return results_1;
            }
          });
        },
        "createAnalyser": function (e) {
          e.prototype.__proto__.createAnalyser = new Proxy(e.prototype.__proto__.createAnalyser, {
            apply(target, self, args) {
              const results_2 = Reflect.apply(target, self, args);
              //
              results_2.__proto__.getFloatFrequencyData = new Proxy(results_2.__proto__.getFloatFrequencyData, {
                apply(target, self, args) {
                  const results_3 = Reflect.apply(target, self, args);
                  // window.top.postMessage("audiocontext-fingerprint-defender-alert", '*');
                  console.log("Blocking AudioContext fingerprint attempt");
                  //
                  for (let i = 0; i < arguments[0].length; i += 100) {
                    let index = Math.floor(Math.random() * i);
                    arguments[0][index] = arguments[0][index] + Math.random() * 0.1;
                  }
                  //
                  return results_3;
                }
              });
              //
              return results_2;
            }
          });
        }
      };
      //
      context.getChannelData(AudioBuffer);
      context.createAnalyser(AudioContext);
      context.createAnalyser(OfflineAudioContext);
      //
      // Note: this variable is for targeting sandboxed iframes
      document.documentElement.dataset.acxscriptallow = true;
    };

    let script_1 = document.createElement("script");
    script_1.textContent = "(" + inject + ")()";
    document.documentElement.appendChild(script_1);
    script_1.remove();

    if (document.documentElement.dataset.acxscriptallow !== "true") {
      let script_2 = document.createElement("script");
      //
      script_2.textContent = `{
        const iframes = [...window.top.document.querySelectorAll("iframe[sandbox]")];
        for (let i = 0; i < iframes.length; i++) {
          if (iframes[i].contentWindow) {
            if (iframes[i].contentWindow.AudioBuffer) {
              if (iframes[i].contentWindow.AudioBuffer.prototype) {
                if (iframes[i].contentWindow.AudioBuffer.prototype.getChannelData) {
                  iframes[i].contentWindow.AudioBuffer.prototype.getChannelData = AudioBuffer.prototype.getChannelData;
                }
              }
            }
            //
            if (iframes[i].contentWindow.AudioContext) {
              if (iframes[i].contentWindow.AudioContext.prototype) {
                if (iframes[i].contentWindow.AudioContext.prototype.__proto__) {
                  if (iframes[i].contentWindow.AudioContext.prototype.__proto__.createAnalyser) {
                    iframes[i].contentWindow.AudioContext.prototype.__proto__.createAnalyser = AudioContext.prototype.__proto__.createAnalyser;
                  }
                }
              }
            }
            //
            if (iframes[i].contentWindow.OfflineAudioContext) {
              if (iframes[i].contentWindow.OfflineAudioContext.prototype) {
                if (iframes[i].contentWindow.OfflineAudioContext.prototype.__proto__) {
                  if (iframes[i].contentWindow.OfflineAudioContext.prototype.__proto__.createAnalyser) {
                    iframes[i].contentWindow.OfflineAudioContext.prototype.__proto__.createAnalyser = OfflineAudioContext.prototype.__proto__.createAnalyser;
                  }
                }
              }
            }
            //
            if (iframes[i].contentWindow.OfflineAudioContext) {
              if (iframes[i].contentWindow.OfflineAudioContext.prototype) {
                if (iframes[i].contentWindow.OfflineAudioContext.prototype.__proto__) {
                  if (iframes[i].contentWindow.OfflineAudioContext.prototype.__proto__.getChannelData) {
                    iframes[i].contentWindow.OfflineAudioContext.prototype.__proto__.getChannelData = OfflineAudioContext.prototype.__proto__.getChannelData;
                  }
                }
              }
            }
          }
        }
      }`;
      //
      window.top.document.documentElement.appendChild(script_2);
      script_2.remove();
    }
  }

  // code extracted from Font spoofer addon by Yubi
  // https://mybrowseraddon.com/font-defender.html
  function spoofFont() {
    var inject = function () {
      let rand = {
        "noise": function () {
          let SIGN = Math.random() < Math.random() ? -1 : 1;
          return Math.floor(Math.random() + SIGN * Math.random());
        },
        "sign": function () {
          const tmp = [-1, -1, -1, -1, -1, -1, +1, -1, -1, -1];
          const index = Math.floor(Math.random() * tmp.length);
          return tmp[index];
        }
      };
      //
      Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
        "get": new Proxy(Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetHeight").get, {
          apply(target, self, args) {
            const height = Math.floor(self.getBoundingClientRect().height);
            const valid = height && rand.sign() === 1;
            const result = valid ? height + rand.noise() : height;
            //
            if (valid && result !== height) {
              // window.top.postMessage("font-fingerprint-defender-alert", '*');
              console.log("Blocking Font fingerprint attempt");
            }
            //
            return result;
          }
        })
      });
      //
      Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        "get": new Proxy(Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth").get, {
          apply(target, self, args) {
            const width = Math.floor(self.getBoundingClientRect().width);
            const valid = width && rand.sign() === 1;
            const result = valid ? width + rand.noise() : width;
            //
            if (valid && result !== width) {
              // window.top.postMessage("font-fingerprint-defender-alert", '*');
              console.log("Blocking Font fingerprint attempt");
            }
            //
            return result;
          }
        })
      });
      // Note: this variable is for targeting sandboxed iframes
      document.documentElement.dataset.fbscriptallow = true;
    };

    let script_1 = document.createElement("script");
    script_1.textContent = "(" + inject + ")()";
    document.documentElement.appendChild(script_1);
    script_1.remove();

    if (document.documentElement.dataset.fbscriptallow !== "true") {
      let script_2 = document.createElement("script");
      //
      script_2.textContent = `{
        const iframes = [...window.top.document.querySelectorAll("iframe[sandbox]")];
        for (let i = 0; i < iframes.length; i++) {
          if (iframes[i].contentWindow) {
            if (iframes[i].contentWindow.HTMLElement) {
              iframes[i].contentWindow.HTMLElement.prototype.offsetWidth = HTMLElement.prototype.offsetWidth;
              iframes[i].contentWindow.HTMLElement.prototype.offsetHeight = HTMLElement.prototype.offsetHeight;
            }
          }
        }
      }`;
      //
      window.top.document.documentElement.appendChild(script_2);
      script_2.remove();
    }
  }

  // code extracted from WebGL spoofer addon by Yubi
  // https://mybrowseraddon.com/webgl-defender.html
  function spoofWebGL() {
    var inject = function () {
      let config = {
        "random": {
          "value": function () {
            return Math.random();
          },
          "item": function (e) {
            let rand = e.length * config.random.value();
            return e[Math.floor(rand)];
          },
          "number": function (power) {
            let tmp = [];
            for (let i = 0; i < power.length; i++) {
              tmp.push(Math.pow(2, power[i]));
            }
            /*  */
            return config.random.item(tmp);
          },
          "int": function (power) {
            let tmp = [];
            for (let i = 0; i < power.length; i++) {
              let n = Math.pow(2, power[i]);
              tmp.push(new Int32Array([n, n]));
            }
            /*  */
            return config.random.item(tmp);
          },
          "float": function (power) {
            let tmp = [];
            for (let i = 0; i < power.length; i++) {
              let n = Math.pow(2, power[i]);
              tmp.push(new Float32Array([1, n]));
            }
            /*  */
            return config.random.item(tmp);
          }
        },
        "spoof": {
          "webgl": {
            "buffer": function (target) {
              let proto = target.prototype ? target.prototype : target.__proto__;
              //
              proto.bufferData = new Proxy(proto.bufferData, {
                apply(target, self, args) {
                  let index = Math.floor(config.random.value() * args[1].length);
                  let noise = args[1][index] !== undefined ? 0.1 * config.random.value() * args[1][index] : 0;
                  //
                  args[1][index] = args[1][index] + noise;
                  // window.top.postMessage("webgl-fingerprint-defender-alert", '*');
                  console.log("Blocking WebGL fingerprint attempt");
                  //
                  return Reflect.apply(target, self, args);
                }
              });
            },
            "parameter": function (target) {
              let proto = target.prototype ? target.prototype : target.__proto__;
              //
              proto.getParameter = new Proxy(proto.getParameter, {
                apply(target, self, args) {
                  // window.top.postMessage("webgl-fingerprint-defender-alert", '*');
                  console.log("Blocking WebGL fingerprint attempt");
                  //
                  if (args[0] === 3415) return 0;
                  else if (args[0] === 3414) return 24;
                  else if (args[0] === 36348) return 30;
                  else if (args[0] === 7936) return "WebKit";
                  else if (args[0] === 37445) return "Google Inc.";
                  else if (args[0] === 7937) return "WebKit WebGL";
                  else if (args[0] === 3379) return config.random.number([14, 15]);
                  else if (args[0] === 36347) return config.random.number([12, 13]);
                  else if (args[0] === 34076) return config.random.number([14, 15]);
                  else if (args[0] === 34024) return config.random.number([14, 15]);
                  else if (args[0] === 3386) return config.random.int([13, 14, 15]);
                  else if (args[0] === 3413) return config.random.number([1, 2, 3, 4]);
                  else if (args[0] === 3412) return config.random.number([1, 2, 3, 4]);
                  else if (args[0] === 3411) return config.random.number([1, 2, 3, 4]);
                  else if (args[0] === 3410) return config.random.number([1, 2, 3, 4]);
                  else if (args[0] === 34047) return config.random.number([1, 2, 3, 4]);
                  else if (args[0] === 34930) return config.random.number([1, 2, 3, 4]);
                  else if (args[0] === 34921) return config.random.number([1, 2, 3, 4]);
                  else if (args[0] === 35660) return config.random.number([1, 2, 3, 4]);
                  else if (args[0] === 35661) return config.random.number([4, 5, 6, 7, 8]);
                  else if (args[0] === 36349) return config.random.number([10, 11, 12, 13]);
                  else if (args[0] === 33902) return config.random.float([0, 10, 11, 12, 13]);
                  else if (args[0] === 33901) return config.random.float([0, 10, 11, 12, 13]);
                  else if (args[0] === 37446) return config.random.item(["Graphics", "HD Graphics", "Intel(R) HD Graphics"]);
                  else if (args[0] === 7938) return config.random.item(["WebGL 1.0", "WebGL 1.0 (OpenGL)", "WebGL 1.0 (OpenGL Chromium)"]);
                  else if (args[0] === 35724) return config.random.item(["WebGL", "WebGL GLSL", "WebGL GLSL ES", "WebGL GLSL ES (OpenGL Chromium"]);
                  //
                  return Reflect.apply(target, self, args);
                }
              });
            }
          }
        }
      };
      //
      config.spoof.webgl.buffer(WebGLRenderingContext);
      config.spoof.webgl.buffer(WebGL2RenderingContext);
      config.spoof.webgl.parameter(WebGLRenderingContext);
      config.spoof.webgl.parameter(WebGL2RenderingContext);
      //
      // Note: this variable is for targeting sandboxed iframes
      document.documentElement.dataset.wgscriptallow = true;
    };

    let script_1 = document.createElement("script");
    script_1.textContent = "(" + inject + ")()";
    document.documentElement.appendChild(script_1);
    script_1.remove();

    if (document.documentElement.dataset.wgscriptallow !== "true") {
      let script_2 = document.createElement("script");
      //
      script_2.textContent = `{
        const iframes = [...window.top.document.querySelectorAll("iframe[sandbox]")];
        for (let i = 0; i < iframes.length; i++) {
          if (iframes[i].contentWindow) {
            if (iframes[i].contentWindow.WebGLRenderingContext) {
              iframes[i].contentWindow.WebGLRenderingContext.prototype.bufferData = WebGLRenderingContext.prototype.bufferData;
              iframes[i].contentWindow.WebGLRenderingContext.prototype.getParameter = WebGLRenderingContext.prototype.getParameter;
            }
            //
            if (iframes[i].contentWindow.WebGL2RenderingContext) {
              iframes[i].contentWindow.WebGL2RenderingContext.prototype.bufferData = WebGL2RenderingContext.prototype.bufferData;
              iframes[i].contentWindow.WebGL2RenderingContext.prototype.getParameter = WebGL2RenderingContext.prototype.getParameter;
            }
          }
        }
      }`;
      //
      window.top.document.documentElement.appendChild(script_2);
      script_2.remove();
    }
  }

  // code extracted from Canvas spoofer addon by Yubi
  // https://mybrowseraddon.com/canvas-defender.html
  function spoofCanvas() {
    var inject = function () {
      const getImageData = CanvasRenderingContext2D.prototype.getImageData;
      //
      let noisify = function (canvas, context) {
        if (context) {
          const shift = {
            'r': Math.floor(Math.random() * 10) - 5,
            'g': Math.floor(Math.random() * 10) - 5,
            'b': Math.floor(Math.random() * 10) - 5,
            'a': Math.floor(Math.random() * 10) - 5
          };
          //
          const width = canvas.width;
          const height = canvas.height;
          //
          if (width && height) {
            const imageData = getImageData.apply(context, [0, 0, width, height]);
            //
            for (let i = 0; i < height; i++) {
              for (let j = 0; j < width; j++) {
                const n = ((i * (width * 4)) + (j * 4));
                imageData.data[n + 0] = imageData.data[n + 0] + shift.r;
                imageData.data[n + 1] = imageData.data[n + 1] + shift.g;
                imageData.data[n + 2] = imageData.data[n + 2] + shift.b;
                imageData.data[n + 3] = imageData.data[n + 3] + shift.a;
              }
            }
            //
            // window.top.postMessage("canvas-fingerprint-defender-alert", '*');
            console.log("Blocking Canvas fingerprint attempt");
            context.putImageData(imageData, 0, 0);
          }
        }
      };
      //
      HTMLCanvasElement.prototype.toBlob = new Proxy(HTMLCanvasElement.prototype.toBlob, {
        apply(target, self, args) {
          noisify(self, self.getContext("2d"));
          //
          return Reflect.apply(target, self, args);
        }
      });
      //
      HTMLCanvasElement.prototype.toDataURL = new Proxy(HTMLCanvasElement.prototype.toDataURL, {
        apply(target, self, args) {
          noisify(self, self.getContext("2d"));
          //
          return Reflect.apply(target, self, args);
        }
      });
      //
      CanvasRenderingContext2D.prototype.getImageData = new Proxy(CanvasRenderingContext2D.prototype.getImageData, {
        apply(target, self, args) {
          noisify(self.canvas, self);
          //
          return Reflect.apply(target, self, args);
        }
      });
      // Note: this variable is for targeting sandboxed iframes
      document.documentElement.dataset.cbscriptallow = true;
    };

    let script_1 = document.createElement("script");
    script_1.textContent = "(" + inject + ")()";
    document.documentElement.appendChild(script_1);
    script_1.remove();

    if (document.documentElement.dataset.cbscriptallow !== "true") {
      let script_2 = document.createElement("script");
      //
      script_2.textContent = `{
        const iframes = [...window.top.document.querySelectorAll("iframe[sandbox]")];
        for (let i = 0; i < iframes.length; i++) {
          if (iframes[i].contentWindow) {
            if (iframes[i].contentWindow.CanvasRenderingContext2D) {
              iframes[i].contentWindow.CanvasRenderingContext2D.prototype.getImageData = CanvasRenderingContext2D.prototype.getImageData;
            }
            //
            if (iframes[i].contentWindow.HTMLCanvasElement) {
              iframes[i].contentWindow.HTMLCanvasElement.prototype.toBlob = HTMLCanvasElement.prototype.toBlob;
              iframes[i].contentWindow.HTMLCanvasElement.prototype.toDataURL = HTMLCanvasElement.prototype.toDataURL;
            }
          }
        }
      }`;
      //
      window.top.document.documentElement.appendChild(script_2);
      script_2.remove();
    }
  }

  spoofAudioContext();
  spoofFont();
  spoofWebGL();
  spoofCanvas();

}
if ('<notrack>' === 'true') { // spoof fingerprints
  try {
    spoofFingerprints();
  } catch { }
}