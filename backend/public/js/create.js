function drawPlane() {
  return new Promise((dnya, adler) => {
    const ruston = [];
    let daliyah = 1 * window.innerWidth,
      aldean = 1 * window.innerHeight;
    if (!config.plane) {
      (config.plane = {}),
        (config.plane.camera = new THREE.PerspectiveCamera(
          45,
          daliyah / aldean,
          1,
          1e4
        )),
        config.plane.camera.position.set(-600, 0, 1500),
        config.plane.camera.lookAt(new THREE.Vector3(0, 0, 0));
      var bevelyn = new THREE.DirectionalLight(16777215, 0.7);
      bevelyn.position.set(0, 1, 1),
        (config.plane.lights = [bevelyn]),
        (config.plane.renderer = config.planeRenderer
          ? config.planeRenderer
          : new THREE.WebGLRenderer({ antialias: true, alpha: true })),
        config.plane.renderer.setSize(daliyah, aldean),
        (config.plane.canvas = config.plane.renderer.domElement),
        (config.plane.scene = new THREE.Scene()),
        config.plane.scene.add(config.plane.camera);
      const shulamit = new Promise((tristana, lezanne) => {
        new THREE.TextureLoader().load(
          config.cdn + "/images/studio-env.jpg?v=3",
          function (tabatha) {
            const inderjit = new THREE.PMREMGenerator(config.plane.renderer);
            inderjit.compileEquirectangularShader(),
              (config.plane.envMap =
                inderjit.fromEquirectangular(tabatha).texture),
              tristana();
          }
        );
      });
      ruston.push(shulamit);
      const almon = new OrbitControls(config.plane.camera, config.plane.canvas);
      (almon.maxPolarAngle = 0.8 * Math.PI),
        (almon.minPolarAngle = 0.2 * Math.PI),
        (almon.maxAzimuthAngle = Math.PI / 3),
        (almon.minAzimuthAngle = -Math.PI / 3),
        (config.plane.controls = almon);
    }
    (config.plane.canvas.width === daliyah &&
      config.plane.canvas.height === aldean) ||
      (config.plane.camera.updateProjectionMatrix(),
      (config.plane.camera.aspect = daliyah / aldean),
      config.plane.renderer.setSize(daliyah, aldean)),
      (config.plane.controls.minDistance = 1e3),
      (config.plane.controls.maxDistance = 2500),
      ruston.push(
        new Promise((quadir, lamecca) => {
          new THREE.TextureLoader().load(
            config.color.canvas.toDataURL("image/jpeg", 0.7),
            function (cresencia) {
              (config.plane.albedo = cresencia), quadir();
            }
          );
        }),
        new Promise((claus, karmell) => {
          new THREE.TextureLoader().load(
            config.displacement.canvas.toDataURL(),
            function (hailie) {
              (config.plane.displacement = hailie), claus();
            }
          );
        }),
        new Promise((zaydon, ryken) => {
          new THREE.TextureLoader().load(
            config.bump.canvas.toDataURL(),
            function (hadessa) {
              (config.plane.bump = hadessa), zaydon();
            }
          );
        }),
        new Promise((samai, barbarella) => {
          new THREE.TextureLoader().load(
            config.roughness.canvas.toDataURL("image/jpeg", 0.7),
            function (chinwe) {
              (config.plane.roughness = chinwe), samai();
            }
          );
        }),
        new Promise((manali, jyanna) => {
          new THREE.TextureLoader().load(
            config.metalness.canvas.toDataURL("image/jpeg", 0.7),
            function (blondell) {
              (config.plane.metalness = blondell), manali();
            }
          );
        })
      ),
      Promise.all(ruston).then(() => {
        let lamontray = averageColor(config.color.canvas);
        config.plane.scene.background = new THREE.Color(lamontray);
        for (const mikio of [
          config.plane.albedo,
          config.plane.displacement,
          config.plane.bump,
          config.plane.roughness,
          config.plane.metalness,
        ])
          (mikio.wrapS = THREE.RepeatWrapping),
            (mikio.wrapT = THREE.RepeatWrapping),
            mikio.repeat.set(1, 1);
        var yobani = new THREE.MeshStandardMaterial({
          map: config.plane.albedo,
          envMap: config.plane.envMap,
          envMapIntensity: 1.6,
        });
        (params.hasOwnProperty("showBump") && true !== params.showBump) ||
          ((yobani.bumpMap = config.plane.bump),
          (yobani.bumpScale = params.depth ? params.depth : 10)),
          (params.hasOwnProperty("showDisplacement") &&
            true !== params.showDisplacement) ||
            ((yobani.displacementMap = config.plane.displacement),
            (yobani.displacementScale = params.depth ? params.depth : 10)),
          (params.hasOwnProperty("showRoughness") &&
            true !== params.showRoughness) ||
            (yobani.roughnessMap = config.plane.roughness),
          (params.hasOwnProperty("showMetalness") &&
            true !== params.showMetalness) ||
            ((yobani.metalness = 1),
            (yobani.metalnessMap = config.plane.metalness));
        {
          var euriel = config.textureWidth,
            aelyn = config.textureHeight,
            emanuela = 1 * config.plane.albedo.image.width,
            katrena = 1 * config.plane.albedo.image.height,
            amarachi = new THREE.PlaneGeometry(
              euriel,
              aelyn,
              emanuela / 3,
              katrena / 3
            ),
            jasire = new THREE.Mesh(amarachi, yobani);
          let humayl = new THREE.PlaneGeometry(
              euriel,
              aelyn,
              emanuela / 6,
              katrena / 6
            ),
            nanalee = new THREE.Mesh(humayl, yobani),
            mailan = new THREE.PlaneGeometry(
              euriel,
              aelyn,
              emanuela / 12,
              katrena / 12
            ),
            anwita = new THREE.Mesh(mailan, yobani);
          if (config.plane.meshes)
            for (bengy of config.plane.meshes)
              config.plane.scene.remove(bengy),
                bengy.geometry.dispose(),
                bengy.material.dispose();
          config.plane.meshes = [];
          let kawanza = Math.floor(4.5);
          for (r = 0; r < 9; r++)
            for (c = 0; c < 9; c++) {
              let yovany = Math.abs(r - kawanza),
                olly = Math.abs(c - kawanza);
              var bengy =
                  c === kawanza && r === kawanza
                    ? jasire.clone()
                    : yovany <= 1 && olly <= 1
                    ? nanalee.clone()
                    : anwita.clone(),
                jnay = (9 * euriel) / 2 - euriel / 2,
                idman = (9 * aelyn) / 2 - aelyn / 2;
              bengy.position.set(c * euriel - jnay, r * aelyn - idman, 0),
                config.plane.meshes.push(bengy),
                config.plane.scene.add(bengy);
            }
        }
        function deshira() {
          config.plane.controls.update(),
            config.plane.renderer.render(
              config.plane.scene,
              config.plane.camera
            );
        }
        deshira(),
          (config.plane.canvas.onmousedown = function () {
            (config.plane.canvas.onmousemove = function () {
              deshira();
            }),
              (config.plane.canvas.onwheel = function () {
                deshira();
              }),
              (config.plane.canvas.onmouseup = function () {
                config.plane.canvas.onmousemove = null;
              });
          }),
          dnya(config.plane.canvas);
      });
  });
}
function drawSphere(satvika) {
  return new Promise((tefta, freja) => {
    const allwin = [];
    var emmily = satvika.divisions ? satvika.divisions : 1200;
    let kaili = satvika.cameraWidth ? satvika.cameraWidth : 2048,
      tobie = satvika.cameraHeight ? satvika.cameraHeight : 2048;
    config.sphere || (config.sphere = {});
    var sareli = satvika.newScene ? {} : config.sphere;
    if (!sareli.camera) {
      (sareli.camera = new THREE.PerspectiveCamera(35, kaili / tobie, 1, 1e4)),
        sareli.camera.position.set(
          0,
          0,
          satvika.hasOwnProperty("cropX")
            ? 2500
            : satvika.hasOwnProperty("cameraZ")
            ? satvika.cameraZ
            : 2e3
        ),
        sareli.camera.lookAt(new THREE.Vector3(0, 0, 0)),
        sareli.renderer ||
          (sareli.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
          })),
        sareli.renderer.setSize(kaili, tobie),
        (sareli.canvas = sareli.renderer.domElement),
        (sareli.scene = new THREE.Scene()),
        sareli.scene.add(sareli.camera);
      const eda = new Promise((avelino, deboraha) => {
        new THREE.TextureLoader().load(
          config.cdn + "/images/studio-env.jpg?v=3",
          function (demontra) {
            const charmia = new THREE.PMREMGenerator(sareli.renderer);
            charmia.compileEquirectangularShader(),
              (sareli.envMap = charmia.fromEquirectangular(demontra).texture),
              avelino();
          }
        );
      });
      allwin.push(eda);
      const darhonda = new OrbitControls(sareli.camera, sareli.canvas);
      (darhonda.maxPolarAngle = 0.75 * Math.PI),
        (darhonda.minPolarAngle = 0.25 * Math.PI),
        (sareli.controls = darhonda);
    }
    satvika.hasOwnProperty("cropX")
      ? sareli.camera.setViewOffset(
          kaili,
          tobie,
          satvika.cropX,
          satvika.cropY,
          satvika.cropWidth,
          satvika.cropHeight
        )
      : ((sareli.camera.aspect = 1),
        sareli.camera.position.set(
          sareli.camera.position.x,
          sareli.camera.position.y,
          2e3
        ),
        sareli.camera.clearViewOffset()),
      sareli.camera.updateProjectionMatrix(),
      (sareli.canvas.width === kaili && sareli.canvas.height === tobie) ||
        (sareli.camera.updateProjectionMatrix(),
        (sareli.camera.aspect = kaili / tobie),
        sareli.renderer.setSize(kaili, tobie)),
      (sareli.controls.minDistance = 1300),
      (sareli.controls.maxDistance = 3e3),
      allwin.push(
        new Promise((kinnley, tyasia) => {
          new THREE.TextureLoader().load(satvika.color, function (liadan) {
            (sareli.albedo = liadan), kinnley();
          });
        }),
        new Promise((laisha, adelene) => {
          new THREE.TextureLoader().load(
            satvika.displacement,
            function (jamont) {
              (sareli.displacement = jamont), laisha();
            }
          );
        }),
        new Promise((keddrick, paisleymae) => {
          new THREE.TextureLoader().load(satvika.bump, function (duffy) {
            (sareli.bump = duffy), keddrick();
          });
        }),
        new Promise((charnelle, joynae) => {
          new THREE.TextureLoader().load(satvika.roughness, function (mats) {
            (sareli.roughness = mats), charnelle();
          });
        }),
        new Promise((deviyon, buchanan) => {
          new THREE.TextureLoader().load(satvika.metalness, function (ed) {
            (sareli.metalness = ed), deviyon();
          });
        })
      ),
      Promise.all(allwin).then(() => {
        for (const korsica of [
          sareli.albedo,
          sareli.displacement,
          sareli.bump,
          sareli.roughness,
          sareli.metalness,
        ]) {
          (korsica.wrapS = THREE.RepeatWrapping),
            (korsica.wrapT = THREE.RepeatWrapping);
          var buse = sareli.albedo.image.width / sareli.albedo.image.height;
          korsica.repeat.set(4, 2 * buse);
        }
        var duskin = new THREE.MeshStandardMaterial({
          map: sareli.albedo,
          envMap: sareli.envMap,
          envMapIntensity: 1.65,
        });
        (params.hasOwnProperty("showBump") && true !== params.showBump) ||
          ((duskin.bumpMap = sareli.bump),
          (duskin.bumpScale = params.depth ? params.depth : 10)),
          (params.hasOwnProperty("showDisplacement") &&
            true !== params.showDisplacement) ||
            ((duskin.displacementMap = sareli.displacement),
            (duskin.displacementScale = params.depth ? params.depth : 10)),
          (params.hasOwnProperty("showRoughness") &&
            true !== params.showRoughness) ||
            (duskin.roughnessMap = sareli.roughness),
          (params.hasOwnProperty("showMetalness") &&
            true !== params.showMetalness) ||
            ((duskin.metalness = 1), (duskin.metalnessMap = sareli.metalness)),
          sareli.mesh &&
            (sareli.scene.remove(sareli.mesh),
            sareli.mesh.geometry.dispose(),
            sareli.mesh.material.dispose());
        var chantise = new THREE.SphereGeometry(
          550,
          emmily,
          emmily / 2,
          0,
          2 * Math.PI
        );
        function rhaine() {
          sareli.controls.update(),
            sareli.renderer.render(sareli.scene, sareli.camera);
        }
        (sareli.mesh = new THREE.Mesh(chantise, duskin)),
          sareli.scene.add(sareli.mesh),
          rhaine(),
          (sareli.canvas.onmousedown = function () {
            (sareli.canvas.onmousemove = function () {
              rhaine();
            }),
              (sareli.canvas.onwheel = function () {
                rhaine();
              }),
              (sareli.canvas.onmouseup = function () {
                sareli.canvas.onmousemove = null;
              });
          }),
          tefta(sareli.canvas);
      });
  });
}
function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}
function drawError(ginaya) {
  modalMessage("Error: " + ginaya), hideSpinner();
}
function setHatchName() {
  (config.hatchName =
    trainify(config.patterns[params.patternId].name, "_")
      .substring(0, 20)
      .toUpperCase() +
    "_" +
    parseInt(params.tileWidth) +
    "X" +
    parseInt(params.tileHeight) +
    "_" +
    params.hatchApp.toUpperCase()),
    config.hatchName.replace("-", "_"),
    (config.hatchName = config.hatchName.substr(0, 24)),
    (config.hatchName += "_" + generateUid().toUpperCase()),
    "autocad" !== params.hatchApp &&
      (config.hatchName += "_" + params.hatchType.toUpperCase());
}
function height2normal(jettrin) {
  for (
    var roseline = jettrin.getContext("2d"),
      dantes = jettrin.width,
      dionne = jettrin.height,
      monet = roseline.getImageData(0, 0, dantes, dionne),
      kharley = roseline.createImageData(dantes, dionne),
      omarie = 0,
      mariaantonia = dantes * dionne * 4;
    omarie < mariaantonia;
    omarie += 4
  ) {
    var momo, veronice, tareek, amarelis;
    omarie % (4 * dantes) == 0
      ? ((momo = monet.data[omarie]), (veronice = monet.data[omarie + 4]))
      : omarie % (4 * dantes) == 4 * (dantes - 1)
      ? ((momo = monet.data[omarie - 4]), (veronice = monet.data[omarie]))
      : ((momo = monet.data[omarie - 4]), (veronice = monet.data[omarie + 4])),
      omarie < 4 * dantes
        ? ((tareek = monet.data[omarie]),
          (amarelis = monet.data[omarie + 4 * dantes]))
        : omarie > dantes * (dionne - 1) * 4
        ? ((tareek = monet.data[omarie - 4 * dantes]),
          (amarelis = monet.data[omarie]))
        : ((tareek = monet.data[omarie - 4 * dantes]),
          (amarelis = monet.data[omarie + 4 * dantes])),
      (kharley.data[omarie] = momo - veronice + 127),
      (kharley.data[omarie + 1] = tareek - amarelis + 127),
      (kharley.data[omarie + 2] = 255),
      (kharley.data[omarie + 3] = 255);
  }
  roseline.putImageData(kharley, 0, 0);
}
function updateMapPreviews() {
  ["plane", "sphere"].includes(params.view) && config.visibleMenu
    ? (elements(".map-preview").forEach(function (steveland) {
        steveland.style.display = "";
      }),
      "roughness-menu" === config.visibleMenu.name &&
        element("#roughness-preview").appendChild(config.roughness.canvas),
      "metalness-menu" === config.visibleMenu.name &&
        element("#metalness-preview").appendChild(config.metalness.canvas),
      "displacement-menu" === config.visibleMenu.name &&
        element("#displacement-preview").appendChild(
          config.displacement.canvas
        ),
      "bump-menu" === config.visibleMenu.name &&
        (height2normal(config.bump.canvas),
        element("#normal-preview").appendChild(config.bump.canvas)))
    : elements(".map-preview").forEach(function (jiahao) {
        jiahao.style.display = "none";
      }),
    config.visibleMenu && positionMenu(config.visibleMenu.triggerElement);
}
function positionMenu(artis) {
  if (artis.innerHTML) {
    var turin = $("#controls").offset(),
      dayris = $("#controls").height(),
      johneice = "#" + $(artis).attr("data-target"),
      otter = $(artis).offset(),
      barbette = $(johneice).height(),
      tailyn = otter.top - barbette / 2 - 1,
      amyrie = otter.top + barbette / 2;
    if (
      ($(johneice + " .arrow").fadeIn(0),
      $(johneice + " > .arrow > .diamond").css("top", otter.top),
      $(window).width() > 499)
    )
      tailyn < turin.top
        ? $(johneice).css("top", turin.top - 1)
        : amyrie > turin.top + dayris
        ? $(johneice).css("top", turin.top + dayris - barbette - 1)
        : $(johneice).css("top", tailyn);
    else {
      var yuette = (window.innerHeight - barbette) / 2;
      $(johneice).css("top", yuette);
    }
  }
}
function afterDraw(joyace) {
  (config.perf.total = performance.now() - drawStart),
    iframeMessage("drawComplete"),
    (config.initialDraw = true),
    clearInterval(config.initialInterval),
    (config.texture = joyace),
    params.tileStyles.a.materialId &&
      config.materials[params.tileStyles.a.materialId] &&
      setThemeColor(config.materials[params.tileStyles.a.materialId].color);
  var luria = params.inches
      ? round(mmToInches(config.textureWidth), 1)
      : round(config.textureWidth),
    jameice = params.inches
      ? round(mmToInches(config.textureHeight), 1)
      : round(config.textureHeight);
  (config.textureSize = luria + " x " + jameice + " " + config.units),
    $("#texture-size").html(config.textureSize);
  var robertia = [],
    dajha = params.tileStyles.a.materialId;
  if (
    (config.materials[dajha] && robertia.push(config.materials[dajha].name),
    config.patterns[params.patternId] &&
      robertia.push(config.patterns[params.patternId].name),
    params.tileStyles.a.designOptions)
  )
    for (option of Object.values(params.tileStyles.a.designOptions))
      robertia.push(option.name);
  if (
    (config.patterns[params.patternId] &&
      !robertia.includes(config.patterns[params.patternId].name) &&
      robertia.push(config.patterns[params.patternId].name),
    config.textureSize && robertia.push(config.textureSize),
    config.materials[dajha] &&
      config.materials[dajha].brand &&
      robertia.push(config.materials[dajha].brands_name),
    (config.nameParts = robertia),
    "plane" == params.view)
  )
    drawPlane().then(function (yairis) {
      hideSpinner(),
        (document.getElementById("plane-canvas-container").innerHTML = ""),
        document.getElementById("plane-canvas-container").appendChild(yairis),
        elements(".output-container").forEach(function (kerryann) {
          kerryann.style.display = "none";
        }),
        elements("#plane-canvas-container").forEach(function (joiya) {
          joiya.style.display = "";
        }),
        config.drawResolve(yairis);
    });
  else if ("sphere" == params.view) {
    var jewelene = createHtml({ tag: "div", class: "canvas-container" });
    insertHtml(jewelene);
    var keilian = jewelene.getBoundingClientRect(),
      syrina = keilian.left + keilian.width + keilian.left,
      domarion = window.innerWidth,
      kanen = domarion / (syrina / window.innerHeight),
      mukul = -(kanen - window.innerHeight) / 2;
    jewelene.remove(),
      drawSphere({
        color: config.color.canvas.toDataURL("image/jpeg", 0.6),
        displacement: config.displacement.canvas.toDataURL("image/jpeg", 0.6),
        bump: config.bump.canvas.toDataURL("image/jpeg", 0.6),
        roughness: config.roughness.canvas.toDataURL("image/jpeg", 0.6),
        metalness: config.metalness.canvas.toDataURL("image/jpeg", 0.6),
        cameraWidth: syrina,
        cameraHeight: window.innerHeight,
        cropX: 0,
        cropY: mukul,
        cropWidth: domarion,
        cropHeight: kanen,
      }).then(function (watsyn) {
        hideSpinner(),
          (document.getElementById("plane-canvas-container").innerHTML = ""),
          document.getElementById("plane-canvas-container").appendChild(watsyn),
          (document.getElementById("background-a").style.display = "none"),
          (document.getElementById("background-b").style.display = "none"),
          watsyn.setAttribute(
            "style",
            "height: 100%;width: 100%;object-fit: cover;"
          ),
          elements(".output-container").forEach(function (raian) {
            raian.style.display = "none";
          }),
          elements("#plane-canvas-container").forEach(function (damen) {
            damen.style.display = "";
          }),
          config.drawResolve(watsyn);
      });
  } else if (
    "scene" == params.view &&
    params.scene &&
    config.scenes[params.scene]
  ) {
    let bly = copy(config.scenes[params.scene]);
    config.hasOwnProperty("scene") || (config.scene = {}),
      config.scene.hasOwnProperty("canvas") ||
        (config.scene.canvas = document.createElement("canvas")),
      (bly.textures = [
        {
          image: joyace.toDataURL("image/jpeg", 0.7),
          width: config.textureWidth,
        },
      ]),
      params.hasOwnProperty("rotation") &&
        (bly.textures[0].rotation = params.rotation);
    var aryelle = [];
    params.hasOwnProperty("sceneTextures") &&
      params.sceneTextures.forEach(function (imya) {
        imya.hasOwnProperty("material")
          ? aryelle.push(
              new Promise(function (jil) {
                query({ table: "protextures", id: imya.material }).then(
                  function (tiffane) {
                    if (tiffane.results.length) {
                      let shamoni = tiffane.results[0];
                      imya.width = shamoni.realwidth;
                      let mims = [];
                      tiffane.results[0].source_names.forEach(function (
                        deyvon,
                        raeden
                      ) {
                        let madina =
                            config.cdn +
                            "/materials/" +
                            imya.material +
                            "/4000/" +
                            deyvon,
                          yitta = copy(imya);
                        (yitta.meshes = []),
                          (yitta.image = madina),
                          bly.textures.push(yitta),
                          mims.push(yitta);
                      }),
                        imya.meshes &&
                          imya.meshes.forEach(function (ronzel, opal) {
                            let jemaya;
                            mims[opal % mims.length].meshes.push(ronzel);
                          });
                    }
                    jil();
                  }
                );
              })
            )
          : "number" == typeof imya.image
          ? aryelle.push(
              new Promise(function (pearlia) {
                query({ table: "textures", id: imya.image }).then(function (
                  gerard
                ) {
                  gerard.results.length &&
                    ((imya.image = config.cdn + gerard.results[0].imgurl),
                    bly.textures.push(imya)),
                    pearlia();
                });
              })
            )
          : bly.textures.push(imya);
      }),
      Promise.all(aryelle).then(function () {
        config
          .drawScene(bly, config.scene.canvas, config.scene.settings)
          .then(function (derene) {
            (config.scene.settings = derene.settings),
              elements(".output-container").forEach(function (akoya) {
                akoya.style.display = "none";
              }),
              (document.getElementById("scene-canvas-container").style.display =
                ""),
              document
                .getElementById("scene-canvas-container")
                .appendChild(derene.canvas),
              hideSpinner(),
              config.drawResolve(derene.canvas);
          });
      });
  } else {
    if (
      (elements(".output-container").forEach(function (takirra) {
        takirra.style.display = "none";
      }),
      elements(".canvas-container").forEach(function (madeliz) {
        madeliz.style.display = "";
      }),
      (document.getElementById("background-a").style.display = ""),
      (document.getElementById("background-b").style.display = ""),
      "normal" === params.view && height2normal(joyace),
      config.drawSettings || (config.drawSettings = {}),
      config.drawSettings.canvasId)
    ) {
      var luara = document.getElementById(config.drawSettings.canvasId),
        shafin = luara.getContext("2d");
      (luara.width = joyace.width),
        (luara.height = joyace.height),
        shafin.drawImage(joyace, 0, 0);
    }
    if (
      (sizeCanvasContainer(),
      1 == config.drawSettings.tileTexture &&
        "sphere" !== params.view &&
        tileTexture(),
      "single-action-button" == params.trigger &&
        0 == config.drawSettings.returnPoints &&
        prepareAppExport(joyace),
      config.sourceScaled && 17 !== params.patternId
        ? fadeIn(config.ui.materialWarning, 100, 0.2)
        : fadeOut(config.ui.materialWarning, 100),
      ("high-res" != params.trigger && "set-res" != params.trigger) ||
        downloadTexture("canvas", 0.95),
      1 == config.drawSettings.returnPoints)
    )
      return delete config.drawSettings, config.tilePoints;
    if (
      (hideSpinner(),
      config.drawResolve(joyace),
      1 == config.drawSettings.returnCanvas)
    )
      return delete config.drawSettings, joyace;
    if (1 == config.drawSettings.returnImg)
      return delete config.drawSettings, joyace.toDataURL("image/jpeg", 0.9);
    delete config.drawSettings;
  }
  let lynnel = params.pixelWidth,
    rennick = joyace.width / joyace.height;
  document.querySelectorAll("[data-pixel-width]").forEach(function (janson) {
    janson.value = lynnel;
  }),
    document
      .querySelectorAll("[data-pixel-height]")
      .forEach(function (mahogony) {
        mahogony.value = parseInt(lynnel / rennick);
      }),
    document
      .querySelectorAll("[data-resolution-container]")
      .forEach(function (sabe) {
        sanitiseResolution(sabe);
      }),
    updateMapPreviews(),
    delete config.drawSettings,
    config.afterDrawJs(),
    config.editorLoaded ||
      (toApp({ type: "editorLoaded" }), (config.editorLoaded = true));
}
function prepareAppExport(gevena) {
  var fleeta = { data: {} };
  if (1 == config.updateExisting)
    (fleeta.type = "update"),
      "sketchup" == config.plugin && hideImportMessage();
  else {
    if (((fleeta.type = "import"), "upload" == params.tileStyles.a.imgType))
      var windol = params.tileStyles.a.materialId + generateUid();
    else if ("solid" == params.tileStyles.a.imgType)
      var windol = "solid-" + generateUid();
    else
      var windol = config.materials[params.tileStyles.a.materialId].name
        .split(" ")
        .join("_");
    (config.textureName =
      windol +
      "_" +
      trainify(config.patterns[params.patternId].name.ucFirst()) +
      "_" +
      generateUid()),
      (config.updateExisting = true),
      $("#single-action-button").html("Update");
  }
  (fleeta.data.name = config.textureName),
    (fleeta.data.image = gevena.toDataURL("image/jpeg", 0.9)),
    (fleeta.data.width = config.textureWidth),
    (fleeta.data.params = params),
    "revit" == config.plugin &&
      ((fleeta.data.color = averageColor(canvas)),
      (fleeta.data.description = ""),
      (fleeta.data.class = "Generic"),
      (fleeta.data.comments = ""),
      (fleeta.data.bump = config.displacement.canvas.toDataURL()),
      (fleeta.data.bumpAmount = 100),
      (fleeta.data.manufacturer = ""),
      (fleeta.data.model = ""),
      (fleeta.data.url = "https://architextures.org"),
      (fleeta.data.x = 0),
      (fleeta.data.y = 0),
      (fleeta.data.transparency = 0),
      (fleeta.data.translucency = 0),
      (fleeta.data.indexOfRefraction = 0),
      (fleeta.data.reflectivityDirect = 0),
      (fleeta.data.reflectivityOblique = 0),
      config.hatchPat &&
        17 !== params.patternId &&
        config.pro &&
        (fleeta.data.hatch = config.hatchPat)),
    toApp(fleeta);
}
function styleLoop(argel) {
  Object.values(params.tileStyles).forEach(function (kerigan, waunda) {
    argel(kerigan, waunda);
  });
}
function downloadHatch(issabella) {
  let seals = config.hatchName + ".pat";
  var sharaf = document.createElement("a");
  if (
    (sharaf.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(issabella)
    ),
    sharaf.setAttribute("download", seals),
    document.createEvent)
  ) {
    var keighly = document.createEvent("MouseEvents");
    keighly.initEvent("click", true, true), sharaf.dispatchEvent(keighly);
  } else sharaf.click();
}
function makeSeed() {
  return parseInt(1e5 * Math.random());
}
function tileTexture() {
  var aleiza = canvas.toDataURL("image/jpeg", 0.8),
    marhia = canvas.toDataURL("image/jpeg", 0.1),
    anajee = $("#canvas").height(),
    deontia = $("#canvas").width(),
    aryela = $("#canvas").offset(),
    daretta = aryela.top,
    hawra = aryela.left;
  $("#background-a")
    .css("background-image", "url(" + aleiza + ")")
    .css("background-size", deontia + "px " + anajee + "px")
    .css("background-position", hawra + "px " + daretta + "px"),
    setTimeout(function () {
      $("#background-b")
        .css("background-image", "url(" + marhia + ")")
        .css("background-size", deontia + "px " + anajee + "px")
        .css("background-position", hawra + "px " + daretta + "px");
    }, 500),
    $("#share-thumb").css("background-image", "url(" + aleiza + ")");
}
function sizeCanvasContainer() {
  let zhana = document.querySelector("#svg-canvas-container");
  zhana.style.position = "absolute";
  let angeliza =
      "90" == params.patternRotateAngle || "270" == params.patternRotateAngle,
    tishonna = angeliza
      ? zhana.parentElement.clientHeight
      : zhana.parentElement.clientWidth,
    jayseon = angeliza
      ? zhana.parentElement.clientWidth
      : zhana.parentElement.clientHeight;
  (zhana.style.height = jayseon + "px"), (zhana.style.width = tishonna + "px");
}
function showSpinner() {
  config.spinnerVisible = setTimeout(function () {
    $("#app-spinner").fadeIn(200);
  }, 200);
}
function hideSpinner() {
  clearTimeout(config.spinnerVisible), $("#app-spinner").fadeOut(300);
}
function filletGradient(josehp, latavia, monicia, tylaiyah, _0x17ebdf = false) {
  var leda,
    davarion,
    qadeera = ((davarion = true),
    function (daymin, khalise) {
      var lapatra = davarion
        ? function () {
            if (khalise) {
              var noname = khalise.apply(daymin, arguments);
              return (khalise = null), noname;
            }
          }
        : function () {};
      return (davarion = false), lapatra;
    })(this, function () {
      return qadeera
        .toString()
        .search("(((.+)+)+)+$")
        .toString()
        .constructor(qadeera)
        .search("(((.+)+)+)+$");
    });
  qadeera();
  var jahjuan = [],
    girasol = [
      [0.025, 0.223],
      [0.099, 0.434],
      [0.218, 0.623],
      [0.377, 0.782],
      [0.566, 0.901],
      [0.777, 0.975],
    ];
  _0x17ebdf &&
    (girasol = [
      [0.223, 0.025],
      [0.434, 0.099],
      [0.623, 0.218],
      [0.782, 0.377],
      [0.901, 0.566],
      [0.975, 0.777],
    ]);
  var dedi = tylaiyah - monicia,
    imelda = latavia - josehp;
  return (
    jahjuan.push({ stop: monicia, color: josehp }),
    girasol.forEach(function (anaria, gracelyn) {
      var kentlee = josehp + imelda * anaria[1];
      jahjuan.push({ stop: monicia + dedi * anaria[0], color: kentlee });
    }),
    jahjuan.push({ stop: tylaiyah, color: latavia }),
    jahjuan
  );
}
function setPatternMultiples() {
  var amoya = ["row", "column"];
  for (const jazzmin of amoya) {
    var deontrez = document.getElementById(jazzmin + "s"),
      salamon = config.patterns[params.patternId][jazzmin + "Multiple"],
      jermonte =
        config.pro && get("maxgrid")
          ? parseInt(get("maxgrid"))
          : config.pro
          ? 30
          : 12,
      lemmy = deontrez.value,
      aysa = deontrez.getAttribute("data-initial-value");
    if (lemmy < salamon)
      (deontrez.value = salamon),
        deontrez.setAttribute("data-initial-value", salamon),
        (params[jazzmin + "s"] = salamon);
    else if (lemmy > jermonte) {
      var dimitric = Math.ceil(jermonte / salamon) * salamon;
      (deontrez.value = dimitric),
        deontrez.setAttribute("data-initial-value", dimitric),
        (params[jazzmin + "s"] = dimitric);
    } else if (Number.isInteger(lemmy / salamon));
    else if (lemmy > aysa) {
      var sharney,
        mackston = (sharney = Math.ceil(lemmy / salamon)) * salamon;
      (deontrez.value = mackston),
        deontrez.setAttribute("data-initial-value", mackston),
        (params[jazzmin + "s"] = mackston);
    } else {
      var sharney,
        mackston = (sharney = Math.floor(lemmy / salamon)) * salamon;
      (deontrez.value = mackston),
        deontrez.setAttribute("data-initial-value", mackston),
        (params[jazzmin + "s"] = mackston);
    }
  }
}
function appUi() {
  if (config.appdata && config.appdata.ui_hide)
    for (const tressy of config.appdata.ui_hide)
      elements(tressy).forEach(function (sebrinia) {
        sebrinia.style.display = "none";
      });
  if (config.appdata && config.appdata.ui_show)
    for (const cross of config.appdata.ui_show)
      elements(cross).forEach(function (laveryl) {
        laveryl.style.display = "";
      });
}
let predraw;
(config.ui = {}),
  (config.formats = [
    "albedo",
    "hatch",
    "bump",
    "displacement",
    "normal",
    "sphere",
    "cube",
    "cylinder",
    "scene",
  ]),
  (config.materials = {}),
  (config.profiles = {}),
  (config.surfaces = {}),
  (config.generalParams = [
    "rows",
    "columns",
    "tileWidth",
    "tileHeight",
    "patternId",
    "patternAngle",
    "patternName",
    "jointWidthHorizontal",
    "jointId",
    "jointWidthVertical",
    "jointTint",
    "patternRotateAngle",
    "sceneTextures",
    "scene",
  ]),
  (config.tileParams = [
    "materialId",
    "brightness",
    "contrast",
    "hue",
    "tint",
    "saturation",
    "invert",
    "edges",
    "edge",
    "surfaces",
    "surface",
    "gradients",
    "profile",
    "finish",
  ]),
  (config.dimensionParams = [
    "tileWidth",
    "tileHeight",
    "tileWidthMin",
    "tileHeightMin",
    "jointWidthHorizontal",
    "jointWidthVertical",
  ]),
  config.drawResolve,
  config.drawReject,
  (config.paths = {
    fine: {
      cornerOffset: 0,
      points: [
        [0, 0],
        [1e4, 0],
      ],
    },
    handmade: {
      cornerOffset: 3,
      points: [
        [0, 1],
        [10, 1],
        [20, 2],
        [30, 2],
        [40, 3],
        [50, 3],
        [60, 3],
        [70, 2],
        [80, 2],
        [90, 1],
        [100, 1],
        [110, 1],
        [120, 0],
        [130, 1],
        [140, 3],
        [150, 2],
        [160, 2],
        [170, 1],
        [180, 1],
        [190, 1],
        [200, 2],
        [210, 0],
        [220, 1],
        [230, 1],
        [240, 3],
        [250, 3],
        [260, 2],
        [270, 3],
        [280, 1],
        [290, 1],
      ],
    },
    uneven: {
      cornerOffset: 5,
      points: [
        [-0, 4.5],
        [22.2, 3.3],
        [54.3, 2.4],
        [98.1, 2.1],
        [120, 1.8],
        [147.3, 1.5],
        [251.4, 0.9],
        [269.1, 1.2],
        [284.1, 0.9],
        [305.4, 1.2],
        [347.4, 0.3],
        [394.2, 0.9],
        [416.1, 1.2],
        [424.2, 1.8],
        [438.9, 1.5],
        [451.2, 1.2],
        [471.6, 0.9],
        [504.9, 0.9],
        [546, 1.5],
        [564.3, 1.8],
        [579.6, 1.2],
        [591, 1.2],
        [601.8, 1.2],
        [633.6, 2.1],
        [680.1, 1.5],
        [725.4, 1.2],
        [776.4, 1.2],
        [826.8, 0.3],
        [879.9, 0.3],
        [930.3, 0.9],
        [978.3, 1.5],
        [997.5, 1.2],
        [1004.7, 1.5],
        [1009.5, 0.6],
        [1017.6, 1.2],
        [1025.7, 0.6],
        [1055.4, 1.5],
        [1065, 0.6],
        [1073.7, 0.6],
        [1083.9, 0.9],
        [1096.5, 0.9],
        [1116.6, 1.8],
        [1130.7, 1.8],
        [1140.3, 1.5],
        [1150.2, 1.2],
        [1203.6, 1.8],
        [1251, 3],
        [1272, 3.6],
        [1317, 2.7],
        [1339.5, 3.3],
        [1404.6, 4.8],
        [1472.7, 4.8],
        [1508.1, 4.5],
        [1550.7, 3.9],
        [1592.4, 4.8],
        [1640.4, 4.5],
        [1667.1, 6],
        [1680.6, 4.8],
        [1686.9, 5.1],
        [1692.3, 6],
        [1698.3, 5.4],
        [1708.5, 6.6],
        [1755.6, 5.7],
        [1785.3, 7.2],
        [1807.5, 5.4],
        [1836, 5.4],
        [1848, 6.6],
        [1860.9, 6.9],
        [1875.6, 6],
        [1891.5, 4.8],
        [1905.9, 4.5],
        [1919.1, 6.9],
        [1925.7, 6.9],
        [1942.8, 6.3],
        [1970.4, 5.1],
        [1995.6, 5.1],
        [2017.8, 3],
        [2046.9, 2.7],
        [2075.1, 3.6],
        [2126.4, 5.4],
        [2150.7, 3.6],
        [2161.5, 1.2],
        [2167.2, 0],
        [2173.5, 0],
        [2184.6, 1.2],
        [2195.1, 1.2],
        [2237.7, 1.2],
        [2285.4, 1.8],
        [2300.7, 1.5],
        [2319.9, 0.6],
        [2333.7, 1.5],
        [2351.1, 1.2],
        [2378.1, 2],
        [2478, 3],
      ],
    },
    rough: {
      cornerOffset: 3,
      points: [
        [0, 0.04],
        [1.85, 0.44],
        [5.41, 2.22],
        [8.97, 1.33],
        [12.52, 1.33],
        [16.08, 3.11],
        [18.74, 3.99],
        [22.3, 3.11],
        [24.96, 1.33],
        [27.63, 2.22],
        [31.19, 2.22],
        [33.85, 1.33],
        [37.41, 1.33],
        [40.96, 0.15],
        [42.74, 2.22],
        [44.52, 3.99],
        [47.19, 4.88],
        [51.63, 4.88],
        [53.41, 2.22],
        [57.85, 1.33],
        [63.19, 1.33],
        [65.85, 3.11],
        [68.52, 1.33],
        [71.19, 3.11],
        [75.63, 3.11],
        [78.3, 1.13],
        [81.85, 2.02],
        [86.3, 1.13],
        [89.85, 0.24],
        [92.52, 2.91],
        [96.96, 2.91],
        [99.63, 1.13],
        [104.08, 2.02],
        [106.74, 1.13],
        [110.3, 1.13],
        [113.85, 2.02],
        [118.3, 0.24],
        [121.85, 0.24],
        [123.8, 1.64],
        [124.38, 1.09],
        [127.04, 1.09],
        [130.6, 1.98],
        [132.38, 0.2],
        [135.04, 1.98],
        [138.6, 2.87],
        [139.49, 1.09],
        [141.26, 2.87],
        [143.04, 1.09],
        [146.6, 1.09],
        [148.38, 1.98],
        [150.15, 1.09],
        [151.93, 1.09],
        [154.6, 2.87],
        [157.26, 2.87],
        [159.04, 1.98],
        [161.71, 0.2],
        [165.26, 0.2],
        [168.82, 1.98],
        [172.38, 2.87],
        [175.04, 2.87],
        [177.71, 1.98],
        [179.49, 0.2],
        [182.15, 0.2],
        [184.82, 1.98],
        [190.15, 1.98],
        [193.71, 0.2],
        [196.38, 1.98],
        [199.04, 2.87],
        [200.82, 1.98],
        [202.6, 1.09],
        [204.38, 1.09],
        [206.15, 2.87],
        [208.82, 1.09],
        [210.6, 0.2],
        [213.26, 1.98],
        [215.04, 1.98],
        [216.82, 1.09],
        [217.71, 0.11],
        [220.38, 0.11],
        [224.82, 1.98],
        [226.6, 2.87],
        [230.15, 2.87],
        [231.93, 1.09],
        [233.71, 0.2],
        [237.26, 0.2],
        [239.04, 1.98],
        [241.71, 2.67],
        [245.26, 1.78],
        [247.04, 0.89],
        [248.4, 2.04],
        [249.27, 1.02],
        [251.89, 0],
        [254.65, 1.63],
        [258.24, 2.34],
        [260.06, 3.14],
        [261.89, 3.93],
        [266.32, 3.7],
        [267.17, 2.77],
        [270.67, 1.7],
        [274.18, 0.43],
        [279.5, 0.15],
        [281.37, 1.84],
        [284.03, 1.7],
        [288.42, 0.59],
        [292.86, 0.36],
        [294.2, 1.24],
        [295.6, 1.64],
        [297.31, 0.14],
        [299.8, 2.04],
        [302.64, 2.72],
        [304.8, 1.64],
        [307, 1.24],
        [308.87, 0.05],
        [313.31, 2.72],
        [317.75, 1.83],
        [322.2, 2.72],
        [323.98, 0.05],
        [327.53, 1.83],
        [331.98, 0.94],
        [333.75, 2.72],
        [337.31, 1.83],
        [338.2, 0.05],
      ],
    },
  }),
  (config.heightmaps = {}),
  (config.finishHeightmaps =
    config.appdata && config.appdata.finishes
      ? config.appdata.finishes
      : [
          2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 41, 42, 43,
          44, 45, 46, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67,
          68,
        ]),
  (config.profilePaths =
    config.appdata && config.appdata.profiles
      ? config.appdata.profiles
      : [
          20, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38,
          39, 40, 41, 42, 43, 44, 45, 46,
        ]),
  (config.viewTabs = config.appdata.views
    ? config.appdata.views
    : [
        "texture",
        "bump",
        "hatch",
        "displacement",
        "normal",
        "roughness",
        "3d",
        "metalness",
        "scene",
      ]),
  (config.editorLoaded = false),
  (config.autoDraw = !(get("autodraw") && "false" === get("autodraw"))),
  (config.perf = {
    edgeClip: 0,
    edgeProfile: 0,
    imageFills: 0,
    diffuseMap: 0,
    tints: 0,
    filters: 0,
    shadows: 0,
  }),
  (config.edges = {
    fine: { name: "Fine", active: 1 },
    handmade: {
      name: "Handmade",
      active: 1,
      allowWidth: false,
      allowScale: true,
      lines: { outer: { path: "handmade", scaleX: 1, scaleY: 1 } },
    },
    roughBrick: {
      name: "Rough brick",
      active: 1,
      allowWidth: false,
      allowScale: true,
      defaultScale: 0.15,
      lengthBehaviour: "fitWidth",
      imageData: [
        { clip_url: config.cdn + "/test/brick-edge-1.png" },
        { clip_url: config.cdn + "/test/brick-edge-6.png" },
        { clip_url: config.cdn + "/test/brick-edge-7.png" },
        { clip_url: config.cdn + "/test/brick-edge-8.png" },
        { clip_url: config.cdn + "/test/brick-edge-9.png" },
      ],
    },
    longBrick: {
      name: "Long brick",
      active: 1,
      allowWidth: false,
      allowScale: true,
      defaultScale: 0.4,
      lengthBehaviour: "fitWidth",
      imageData: [
        { clip_url: config.cdn + "/test/hand-brick-1.png" },
        { clip_url: config.cdn + "/test/hand-brick-2.png" },
        { clip_url: config.cdn + "/test/hand-brick-3.png" },
      ],
    },
    rough: {
      name: "Rough",
      active: 1,
      allowWidth: false,
      allowScale: true,
      lines: { outer: { path: "rough", scaleX: 1, scaleY: 1 } },
    },
    uneven: {
      name: "Uneven",
      active: 1,
      allowWidth: false,
      allowScale: true,
      lines: { outer: { path: "uneven", scaleX: 1, scaleY: 1 } },
    },
    tumbled: {
      name: "Tumbled",
      displacement: { gradient: filletGradient(0, 1, 0, 1) },
    },
    chamfer: {
      name: "Chamfer",
      active: 1,
      displacement: {
        gradient: [
          { stop: 0, color: 0 },
          { stop: 1, color: 1 },
        ],
      },
    },
    fillet: {
      name: "Fillet",
      active: 1,
      displacement: { gradient: filletGradient(0, 1, 0, 1) },
    },
    cove: {
      name: "Cove",
      active: 1,
      displacement: { gradient: filletGradient(0, 1, 0, 1, true) },
    },
    standingSeam: {
      name: "Standing Seam",
      active: 1,
      direction: "both",
      displacement: {
        gradient: [
          { stop: 0, color: 0.75 },
          { stop: 0.2, color: 1 },
          { stop: 0.8, color: 1 },
          { stop: 1, color: 0.75 },
        ],
        inset: 0,
      },
    },
    ogee: {
      name: "Ogee",
      active: 1,
      displacement: {
        gradient: filletGradient(0, 0.5, 0, 0.5).concat(
          filletGradient(0.5, 1, 0.5, 1, true)
        ),
      },
    },
    waterfall: {
      name: "Waterfall",
      active: 1,
      displacement: {
        gradient: filletGradient(0, 0.333, 0, 0.333).concat(
          filletGradient(0.333, 0.667, 0.333, 0.667).concat(
            filletGradient(0.667, 1, 0.667, 1)
          )
        ),
      },
    },
    doubleBullnose: {
      name: "Double Bullnose",
      active: 1,
      displacement: {
        gradient: filletGradient(0, 0.5, 0, 0.5).concat(
          filletGradient(0.5, 1, 0.5, 1)
        ),
      },
    },
    wirecut: {
      name: "Wirecut",
      active: 1,
      allowOffset: false,
      allowWidth: false,
      allowScale: true,
      width: 3,
      scale: 1,
      lines: {
        outer: { path: "handmade", scaleX: 0.5, scaleY: 0.5 },
        inner: { path: "rough", scaleX: 0.5, scaleY: 0.5 },
      },
      displacement: {
        gradient: [
          { stop: 0, color: 0 },
          { stop: 1, color: 1 },
        ],
      },
    },
    recessed: { name: "Recessed", active: 1, displacement: { fill: 0 } },
    protruding: {
      name: "Protruding",
      active: 1,
      displacement: { fill: 1, inset: 0 },
    },
    splitFace: {
      name: "Split Face (Test)",
      active: 0,
      allowWidth: false,
      allowScale: true,
      defaultScale: 0.15,
      lengthBehaviour: "proportional",
      imageData: [
        {
          clip_url: config.cdn + "/test/split_face_clip2.png",
          displacement_url: config.cdn + "/split_face_disp2/split_top_disp.png",
        },
      ],
    },
    splitTop: {
      name: "Split Top (Test)",
      active: 0,
      allowWidth: false,
      allowScale: true,
      defaultScale: 0.15,
      lengthBehaviour: "proportional",
      imageData: [
        {
          clip_url: config.cdn + "/test/split_top_clip.png",
          displacement_url: config.cdn + "/test/split_top_disp.png",
        },
      ],
    },
    sawnTopsSplitSidesTumbled: {
      name: "Sawn Tops Split Sides Tumbled",
      active: 0,
      allowWidth: false,
      allowScale: true,
      defaultScale: 0.15,
      lengthBehaviour: "proportional",
      imageData: [
        {
          clip_url: config.cdn + "/test/m601_tumbled_side1_clip.png",
          displacement_url: config.cdn + "/test/m601_tumbled_side1_disp.png",
        },
        {
          clip_url: config.cdn + "/test/m601_tumbled_side2_clip.png",
          displacement_url: config.cdn + "/test/m601_tumbled_side2_disp.png",
        },
        {
          clip_url: config.cdn + "/test/m601_tumbled_side3_clip.png",
          displacement_url: config.cdn + "/test/m601_tumbled_side3_disp.png",
        },
        {
          clip_url: config.cdn + "/test/m601_tumbled_side4_clip.png",
          displacement_url: config.cdn + "/test/m601_tumbled_side4_disp.png",
        },
      ],
    },
    splitTopsSplitSides: {
      name: "Split Tops Split Sides",
      active: 0,
      allowWidth: false,
      allowScale: true,
      defaultScale: 0.15,
      lengthBehaviour: "proportional",
      imageData: [
        {
          clip_url: config.cdn + "/test/m601_side1_clip.png",
          displacement_url: config.cdn + "/test/m601_side1_disp.png",
        },
        {
          clip_url: config.cdn + "/test/m601_side2_clip.png",
          displacement_url: config.cdn + "/test/m601_side2_disp.png",
        },
        {
          clip_url: config.cdn + "/test/m601_side3_clip.png",
          displacement_url: config.cdn + "/test/m601_side3_disp.png",
        },
        {
          clip_url: config.cdn + "/test/m601_side4_clip.png",
          displacement_url: config.cdn + "/test/m601_side4_disp.png",
        },
      ],
    },
    SplitTopSplitSideAntiqued: {
      name: "Split Top Split Side Antiqued",
      active: 0,
      allowWidth: false,
      allowScale: true,
      defaultScale: 0.15,
      lengthBehaviour: "proportional",
      imageData: [
        {
          clip_url: config.cdn + "/test/P261_side1_clip.png",
          displacement_url: config.cdn + "/test/P261_side1_disp_b.png",
        },
        {
          clip_url: config.cdn + "/test/P261_side2_clip.png",
          displacement_url: config.cdn + "/test/P261_side2_disp_b.png",
        },
        {
          clip_url: config.cdn + "/test/P261_side3_clip.png",
          displacement_url: config.cdn + "/test/P261_side3_disp_b.png",
        },
        {
          clip_url: config.cdn + "/test/P261_side4_clip.png",
          displacement_url: config.cdn + "/test/P261_side4_disp_b.png",
        },
      ],
    },
    graniteReclaimedLiveEdge: {
      name: "Granite Reclaimed Live Edge",
      active: 0,
      allowWidth: false,
      allowScale: true,
      defaultScale: 0.15,
      lengthBehaviour: "proportional",
      imageData: [
        {
          clip_url: config.cdn + "/test/p328_side1_clip.png",
          displacement_url: config.cdn + "/test/p328_side1_disp_b.png",
        },
        {
          clip_url: config.cdn + "/test/p328_side2_clip.png",
          displacement_url: config.cdn + "/test/p328_side2_disp_b.png",
        },
        {
          clip_url: config.cdn + "/test/p328_side3_clip.png",
          displacement_url: config.cdn + "/test/p328_side3_disp_b.png",
        },
        {
          clip_url: config.cdn + "/test/p328_side4_clip.png",
          displacement_url: config.cdn + "/test/p328_side4_disp_b.png",
        },
      ],
    },
    splitFaceApprox: {
      name: "Split Face Approx",
      active: 0,
      allowWidth: false,
      allowScale: true,
      defaultScale: 0.15,
      lengthBehaviour: "proportional",
      imageData: [
        {
          clip_url: config.cdn + "/test/p829_side1_clip.png",
          displacement_url: config.cdn + "/test/p829_side1_disp_b.png",
        },
        {
          clip_url: config.cdn + "/test/p829_side2_clip.png",
          displacement_url: config.cdn + "/test/p829_side2_disp_b.png",
        },
        {
          clip_url: config.cdn + "/test/p829_side3_clip.png",
          displacement_url: config.cdn + "/test/p829_side3_disp_b.png",
        },
        {
          clip_url: config.cdn + "/test/p829_side4_clip.png",
          displacement_url: config.cdn + "/test/p829_side4_disp_b.png",
        },
      ],
    },
    rockfaceTopSawnSide: {
      name: "Rockface Top Sawn Side",
      active: 0,
      allowWidth: false,
      allowScale: true,
      defaultScale: 0.15,
      lengthBehaviour: "proportional",
      imageData: [
        {
          clip_url: config.cdn + "/test/P834_side1_clip.png",
          displacement_url: config.cdn + "/test/P834_side1_disp_b.png",
        },
        {
          clip_url: config.cdn + "/test/P834_side2_clip.png",
          displacement_url: config.cdn + "/test/P834_side2_disp_b.png",
        },
        {
          clip_url: config.cdn + "/test/P834_side3_clip.png",
          displacement_url: config.cdn + "/test/P834_side3_disp_b.png",
        },
        {
          clip_url: config.cdn + "/test/P834_side4_clip.png",
          displacement_url: config.cdn + "/test/P834_side4_disp_b.png",
        },
      ],
    },
    sawnSidesSplitTumbledTop: {
      name: "Sawn Sides Split Tumbled Top",
      active: 0,
      allowWidth: false,
      allowScale: true,
      defaultScale: 0.15,
      lengthBehaviour: "proportional",
      imageData: [
        {
          clip_url: config.cdn + "/test/p842_side1_clip.png",
          displacement_url: config.cdn + "/test/p842_side1_disp.png",
        },
        {
          clip_url: config.cdn + "/test/p842_side1_clip.png",
          displacement_url: config.cdn + "/test/p842_side1_disp.png",
        },
        {
          clip_url: config.cdn + "/test/p842_side1_clip.png",
          displacement_url: config.cdn + "/test/p842_side1_disp.png",
        },
        {
          clip_url: config.cdn + "/test/p842_side1_clip.png",
          displacement_url: config.cdn + "/test/p842_side1_disp.png",
        },
      ],
    },
  }),
  document.addEventListener("keydown", function (decklyn) {
    decklyn.key;
  }),
  $(document).ready(function () {
    var shequanna = document.getElementById("material-menu"),
      charrisse = document.getElementById("height"),
      nyjae = document.getElementById("background-a"),
      aliza = document.getElementById("background-b");
    if (
      ((config.ui.width = document.getElementById("width")),
      (config.ui.height = document.getElementById("height")),
      (config.ui.materialWarning = elements("#scale-warning")[0]),
      (config.ui.spectrumPreview = createHtml({
        tag: "div",
        class: "spectrum-preview",
      })),
      (config.ui.weaves = document.getElementById("weaves")),
      (config.ui.reset = document.getElementById("reset-texture")),
      (config.ui.jointHorizontal = document.getElementById(
        "joint-size-horizontal"
      )),
      (config.ui.jointVertical = document.getElementById(
        "joint-size-vertical"
      )),
      (config.ui.pathSelector = document.getElementById("path-selector")),
      (config.ui.heightmapSelector =
        document.getElementById("heightmap-selector")),
      (config.ui.controls = document.getElementById("controls")),
      (config.ui.viewDropdown = document.getElementById("view-options")),
      (config.ui.formatSelect = element("#download-format")),
      window.addEventListener("message", function (johvanny) {
        let mihail = johvanny.data.type ? johvanny.data.type : johvanny.data,
          tysheera = johvanny.data.data ? johvanny.data.data : null,
          josanna = johvanny.data.requestId ? johvanny.data.requestId : 0;
        if (["textureData", "getTextureData"].includes(mihail)) {
          var mireily = {
            patternName: config.patterns[params.patternId].name,
            patternId: config.patterns[params.patternId].id,
            rows: params.rows,
            columns: params.columns,
            jointWidthHorizontal: params.jointWidthHorizontal,
            jointWidthVertical: params.jointWidthVertical,
            jointRecess: params.recessJoints,
            jointTint: params.jointTint,
            tileWidth: params.tileWidth,
            tileHeight: params.tileHeight,
            tileWidthMin: params.tileMinWidth,
            tileHeighthMin: params.tileMinHeight,
            materials: [],
          };
          (mireily.width = params.inches
            ? mmToInches(config.textureWidth)
            : config.textureWidth),
            (mireily.height = params.inches
              ? mmToInches(config.textureHeight)
              : config.textureHeight),
            (mireily.units = params.inches ? "inches" : "mm"),
            (mireily.jointId =
              NaN !== parseInt(params.jointID) ? parseInt(params.jointID) : 0),
            (mireily.jointName = config.materials.hasOwnProperty(params.jointID)
              ? config.materials[params.jointID].name
              : 0),
            (mireily.jointSize = params.jointWidthHorizontal),
            (mireily.nameParts = config.nameParts);
          for (const chaslyn of Object.values(params.tileStyles)) {
            var kartika =
                !!config.materials.hasOwnProperty(chaslyn.materialId) &&
                config.materials[chaslyn.materialId].name,
              shantele =
                NaN == parseInt(chaslyn.materialId)
                  ? chaslyn.materialId
                  : parseInt(chaslyn.materialId),
              genaveve =
                config.materials.hasOwnProperty(chaslyn.materialId) &&
                config.materials[chaslyn.materialId].hasOwnProperty("sku")
                  ? config.materials[chaslyn.materialId].sku
                  : 0,
              gurinder =
                config.materials.hasOwnProperty(chaslyn.materialId) &&
                config.materials[chaslyn.materialId].collection
                  ? config.materials[chaslyn.materialId].collection
                  : 0,
              bretton =
                config.materials.hasOwnProperty(chaslyn.materialId) &&
                config.materials[chaslyn.materialId].link
                  ? config.materials[chaslyn.materialId].link
                  : 0;
            mireily.materials.push({
              name: kartika,
              id: shantele,
              sku: genaveve,
              collection: gurinder,
              link: bretton,
              tint: chaslyn.tint,
              brightness: chaslyn.brightness,
              contrast: chaslyn.contrast,
              hue: chaslyn.hue,
              saturation: chaslyn.saturation,
              invert: chaslyn.invert,
            });
          }
          iframeMessage(mihail, mireily, josanna);
        }
        if (
          (["getParams", "getParamsExtended"].includes(mihail) &&
            iframeMessage(mihail, params, josanna),
          ["getTexture", "getBump"].includes(mihail))
        ) {
          let dakoata = copy(params);
          if (("getBump" === mihail && (dakoata.view = "bump"), tysheera)) {
            tysheera.size && (dakoata.pxSize = tysheera.size);
            let afeni = tysheera.format ? tysheera.format : "jpg",
              anise = tysheera.quality ? tysheera.quality : 0.8;
            config.draw(dakoata).then(function (kingisaiah) {
              tysheera.invert && invertCanvas(kingisaiah),
                iframeMessage(
                  mihail,
                  kingisaiah.toDataURL(
                    "jpg" === afeni ? "image/jpeg" : "image/png",
                    "jpg" === afeni ? anise : null
                  ),
                  josanna
                );
            });
          } else
            config.draw(dakoata).then(function (ilyssa) {
              iframeMessage(mihail, ilyssa.toDataURL(), josanna);
            });
        }
        if ("setAppdata" === mihail && "object" == typeof tysheera)
          for (const [_0x3c3fb9, _0x2a519a] of Object.entries(tysheera))
            config.appdata[_0x3c3fb9] = _0x2a519a;
        "getSceneImage" === mihail &&
          iframeMessage(
            mihail,
            config.scene && config.scene.canvas
              ? config.scene.canvas.toDataURL()
              : "No scene image available",
            josanna
          ),
          "setTitle" === mihail &&
            (element("#app-title-text").innerHTML = tysheera),
          "setIconSrc" === mihail &&
            element("#app-title-image").setAttribute("src", tysheera),
          "clickElement" === mihail && element(tysheera).click(),
          "setAccentColor" === mihail &&
            element(":root").style.setProperty("--main-accent-color", tysheera),
          "loadParams" === mihail &&
            config
              .loadParams(
                tysheera,
                tysheera.trigger ? tysheera.trigger : "#plugin-editor-load"
              )
              .then(function () {
                iframeMessage(mihail, false, josanna);
              });
      }),
      config.user.type,
      window.self !== window.top)
    ) {
      let utkarsh = createHtml({
          tag: "button",
          class: "fbutt",
          children: [
            "Open on Architextures.org",
            { tag: "img", src: config.cdn + "/icons/link.svg" },
          ],
        }),
        abiyah = createHtml({
          tag: "div",
          class: "section fc xs-gap",
          id: "open-on-architextures-container",
          children: [
            { tag: "div", class: "section-header", text: "Access" },
            { tag: "div", children: [utkarsh] },
          ],
        });
      (utkarsh.onclick = function () {
        postJson(`/api/share`, {
          params: JSON.stringify(params),
        }).then(function (ballarie) {
          createHtml({
            tag: "a",
            href: window.location.origin + "/share/" + ballarie.id,
            target: "_blank",
          }).click();
        });
      }),
        document.querySelector("#kebab-menu .menu-content").appendChild(abiyah);
    }
    if (
      config.appdata &&
      config.appdata.textures &&
      config.appdata.textures.length
    ) {
      let cortny = createHtml({
        tag: "div",
        class: "circle-icon-small plugin-back nosel",
        children: [
          {
            tag: "img",
            style: "margin-right:8px;",
            src: config.mediaEndpoint + "/icons/img-menu.svg",
          },
          "Browse designs",
        ],
      });
      (cortny.style.width = "auto"),
        (cortny.style.borderRadius = 0),
        (cortny.style.padding = "0 10px"),
        insertHtml(cortny),
        (cortny.onclick = function () {
          if (config.presetBox) fadeIn(config.presetBox);
          else {
            let lucchese = {
              table: "textures",
              limit: 48,
              sort: ["views", "desc"],
            };
            lucchese.where = [["id", "in", config.appdata.textures.join(",")]];
            var quention = createDataboxMenu({
              query: lucchese,
              search: true,
              onClose: "hide",
              title: "Designs",
              footer: false,
              moreButton: function () {
                return createHtml({
                  tag: "div",
                  class: "shadow more-button flex-centred",
                  style:
                    "height:50px;background-color:var(--app-accent-color);color:white;",
                  text: "More",
                });
              },
              itemHtml: function (donica, tysheem) {
                let roxa = createHtml({
                  tag: "div",
                  style:
                    "background-image:url(" +
                    config.cdn +
                    donica.imgurl +
                    "?s=400&q=60)",
                  class: "asset",
                  children: [
                    {
                      tag: "div",
                      class: "asset-label",
                      children: [{ tag: "div", text: donica.name }],
                    },
                  ],
                });
                return (
                  (roxa.onclick = function () {
                    config.loadParams(donica.params),
                      fadeOut(quention).then(function () {
                        quention.style.display = "none";
                      });
                  }),
                  roxa
                );
              },
            });
            insertHtml(quention),
              quention.dbox.itemContainer.classList.add("asset-grid"),
              (quention.dbox.itemContainer.style.padding = "20px"),
              quention.dbox.itemContainer.parentElement.classList.add(
                "asset-container"
              ),
              quention.dbox.moreButton.classList.add("fbutt"),
              (quention.dbox.moreButton.style.backgroundColor =
                "var(--accent-color)"),
              (quention.dbox.moreButton.style.margin = "50px"),
              (quention.style.left = quention.style.right =
                "var(--app-panel-left)"),
              (quention.style.top = quention.style.bottom =
                "var(--app-panel-top)"),
              (config.presetBox = quention);
          }
        });
    }
    var caritina = get("status") ? get("status") : "live",
      tampa = caritina.split("+");
    const endora = {
      table: "protextures",
      where: [["status", "IN", tampa.join(",")]],
      page: 1,
      joins: [
        {
          table: "brands",
          columns: ["name", "website_link", "logo"],
          on: ["brand", "=", "id"],
        },
        {
          table: "protextures_position_" + config.userRegion,
          columns: ["position"],
          on: ["id", "=", "material"],
          sort: ["position", "asc"],
        },
      ],
      limit: 20,
    };
    if (
      (config.appdata &&
        config.appdata.materials &&
        (endora.where = [["id", "in", config.appdata.materials.join(",")]]),
      get("materials") &&
        (endora.where = [["id", "in", miricale(get("materials")).join(",")]]),
      get("view") && (params.view = get("view")),
      config.user &&
        "gamedev" == config.user.type &&
        endora.where.push(["brand", "IS NULL"]),
      config.appdata)
    ) {
      var viance = {};
      let faruk = get("materials")
        ? [["id", "in", miricale(get("materials")).join(",")]]
        : config.appdata.materials
        ? [["id", "in", config.appdata.materials.join(",")]]
        : [
            ["brand", "=", config.appdata.brand],
            ["status", "IN", tampa.join(",")],
          ];
      postJson("/api/query1", {
        table: "protextures",
        where: faruk,
        join: {
          table: "brands",
          columns: ["name", "website_link", "logo"],
          on: ["brand", "=", "id"],
        },
        sort: ["downloads", "desc"],
        limit: 999,
      }).then(function (azhaan) {
        for (material of azhaan.results) {
          var tyniyah,
            kaymi = (
              material.collection
                ? material.collection
                : material.category
                ? material.category
                : ""
            ).split(",");
          for (collectionName of kaymi) {
            (collectionName = collectionName.trim()),
              viance.hasOwnProperty(collectionName) ||
                (viance[collectionName] = {
                  tag: "div",
                  class: "section orderable-section",
                  children: [
                    { tag: "div", class: "input-label", text: collectionName },
                    { tag: "div", class: "planet-container", children: [] },
                  ],
                });
            var darrious = edilson(material);
            viance[collectionName].children[1].children.push(darrious);
          }
        }
        for (collection of Object.values(viance))
          insertHtml(createHtml(collection), "#material-menu-content");
        jaire(), shaleesa(), keynon();
      });
    } else {
      const yatzary = copy(endora);
      yatzary.where.push(["category", "=", "Stone"]),
        (yatzary.category = "stone"),
        (element(
          "#material-menu .stone-container"
        ).parentElement.menuOptionsLoaded = true);
      const payload = {
        limit: yatzary.limit,
        page: yatzary.page,
        category: yatzary.category,
      };
      postJson(
        `/api/materials?page=${payload.page}&limit=${payload.limit}&category=${payload.category}`
      ).then(function (livy) {
        adyaan(livy, "#material-menu .stone-container", yatzary);
      });
    }
    const arshanti = copy(endora);
    arshanti.where.push(["category", "=", "Joint"]),
      (arshanti.category = "joint"),
      config.appdata.joints &&
        (arshanti.where = [["id", "in", config.appdata.joints.join(",")]]);
    const payload = {
      limit: arshanti.limit,
      page: arshanti.page,
      category: arshanti.category,
    };
    postJson(
      `/api/materials?page=${payload.page}&limit=${payload.limit}&category=${payload.category}`
    ).then(function (samnatha) {
      adyaan(samnatha, "#material-menu .stone-container", arshanti);
    });
    var lafrederick = element("#material-menu-content"),
      chigozirim = element("#material-spinner"),
      haku = element("#material-search-container");
    function ipek(_0x3ecfd7 = 1e3) {
      shequanna
        .querySelectorAll("#material-menu-content .section")
        .forEach(function (geovani) {
          if (
            !geovani.menuOptionsLoaded &&
            geovani.hasAttribute("data-cat") &&
            geovani.getBoundingClientRect().top - _0x3ecfd7 < window.innerHeight
          ) {
            var marit = createHtml({
              tag: "div",
              class: "flex-centred",
              style: "width:100%;height:400px;",
              children: [{ tag: "div", class: "spinner" }],
            });
            geovani.appendChild(marit), (geovani.menuOptionsLoaded = true);
            var deryan = geovani.getAttribute("data-cat").split(",");
            for (const elysiana of deryan) {
              const kedwin = copy(endora);
              kedwin.where.push(["category", "=", elysiana]),
                (kedwin.category = elysiana);
              const payload = {
                limit: kedwin.limit,
                page: kedwin.page,
                category: kedwin.category,
              };
              postJson(
                `/api/materials?page=${payload.page}&limit=${payload.limit}&category=${payload.category}`
              ).then(function (soyer) {
                (soyer.results = soyer.results.filter(
                  (diyara) =>
                    null !==
                    diyara[
                      "protextures_position_" + config.userRegion + "_position"
                    ]
                )),
                  marit.remove(),
                  adyaan(
                    soyer,
                    "#material-menu ." + elysiana.toLowerCase() + "-container",
                    kedwin
                  ),
                  shaleesa();
              });
            }
          }
        });
    }
    function parris(tionni) {
      if (
        ((tionni.tonalVariation = tionni.hasOwnProperty("tonalVariation")
          ? tionni.tonalVariation
          : "0.25"),
        (tionni.view = tionni.hasOwnProperty("view")
          ? tionni.view
          : tionni.hasOwnProperty("drawType")
          ? tionni.drawType
          : "texture"),
        tionni.selectedTiles &&
          (tionni.selectedTiles = Array.isArray(tionni.selectedTiles)
            ? {}
            : tionni.selectedTiles),
        (tionni.hatchType = tionni.hasOwnProperty("hatchType")
          ? tionni.hatchType
          : "model"),
        (tionni.hatchApp = tionni.hasOwnProperty("hatchApp")
          ? tionni.hatchType
          : "autocad"),
        (tionni.pixelWidth = config.pro ? 2048 : 1024),
        ["bump", "normal", "displacement", "metalness", "roughness"].includes(
          tionni.view
        ) &&
          true !== config.pro &&
          (tionni.view = "texture"),
        tionni.concaveJoints || (tionni.concaveJoints = false),
        tionni.randCrop || (tionni.randCrop = parseInt(1e5 * Math.random())),
        tionni.randEdge || (tionni.randEdge = parseInt(1e5 * Math.random())),
        tionni.randTone || (tionni.randTone = parseInt(1e5 * Math.random())),
        tionni.randSrc || (tionni.randSrc = parseInt(1e5 * Math.random())),
        tionni.randPlacement ||
          (tionni.randPlacement = parseInt(1e5 * Math.random())),
        tionni.randFinishCrop ||
          (tionni.randFinishCrop = parseInt(1e5 * Math.random())),
        tionni.hasOwnProperty("tileStyles"))
      )
        for (const [_0x110d64, _0x2d80df] of Object.entries(tionni.tileStyles))
          _0x2d80df.designOptions &&
            Array.isArray(_0x2d80df.designOptions) &&
            (_0x2d80df.designOptions = {}),
            (_0x2d80df.placement = _0x2d80df.placement
              ? _0x2d80df.placement
              : "random"),
            (_0x2d80df.frequency = _0x2d80df.frequency
              ? _0x2d80df.frequency
              : 0.5),
            tionni.tileStyles[_0x110d64].hasOwnProperty("edge") ||
              (tionni.tileStyles[_0x110d64].edge = {
                profile: tionni.edgeProfile,
                scale: tionni.edgeScale,
                exclude: [],
                width: 25,
              }),
            tionni.tileStyles[_0x110d64].hasOwnProperty("depthBottom") ||
              ((tionni.tileStyles[_0x110d64].depthBottom = 20),
              (tionni.tileStyles[_0x110d64].depthTop = 255)),
            tionni.tileStyles[_0x110d64].hasOwnProperty("realWidth") &&
              ((tionni.tileStyles[_0x110d64].materialWidth =
                tionni.tileStyles[_0x110d64].realWidth),
              delete tionni.tileStyles[_0x110d64].realWidth);
      else
        tionni.tileStyles = {
          a: {
            brightness: tionni.brightness,
            contrast: tionni.contrast,
            edge: {
              profile: tionni.edgeProfile,
              scale: tionni.edgeScale,
              exclude: [],
              width: 25,
            },
            depthBottom: 20,
            depthTop: 255,
            frequency: 0.5,
            hue: tionni.hue,
            imgType: tionni.tileType,
            invert: tionni.tileInvert,
            materialCategory: "brick",
            materialId: tionni.tileID,
            materialWidth: tionni.tileRealWidth,
            placement: "random",
            rotate: tionni.tileRotation,
            saturation: tionni.saturation,
            sourceType: tionni.tileSourceType,
            tint: tionni.tileTint ? tionni.tileTint : "#FFFFFF",
          },
        };
      tionni.hasOwnProperty("diffuseOpacity") || (tionni.diffuseOpacity = 0.5),
        (tionni.patternId = isNaN(parseInt(tionni.patternId))
          ? Object.values(config.patterns).find(
              (dreyken) => dreyken.stringId === tionni.patternId
            ).id
          : parseInt(tionni.patternId)),
        0 == tionni.patternId && (tionni.patternId = 17),
        tionni.patternName ||
          (tionni.patternName = config.patterns[tionni.patternId]
            ? config.patterns[tionni.patternId].name
            : Object.values(config.patterns)[0].name);
      for (const [_0x310930, _0x1055d0] of Object.entries(tionni.tileStyles))
        null == tionni.tileStyles[_0x310930].brightness &&
          (tionni.tileStyles[_0x310930].brightness = "1"),
          null == tionni.tileStyles[_0x310930].contrast &&
            (tionni.tileStyles[_0x310930].contrast = "1"),
          null == tionni.tileStyles[_0x310930].hue &&
            (tionni.tileStyles[_0x310930].hue = "0"),
          null == tionni.tileStyles[_0x310930].saturation &&
            (tionni.tileStyles[_0x310930].saturation = "1"),
          null == tionni.tileStyles[_0x310930].invert &&
            (tionni.tileStyles[_0x310930].invert = false),
          _0x1055d0.hasOwnProperty("profile") ||
            (_0x1055d0.profile = { reps: 5, gap: 0 }),
          _0x1055d0.hasOwnProperty("finish") ||
            (_0x1055d0.finish = { width: 800 }),
          _0x1055d0.hasOwnProperty("bumpEdges") || (_0x1055d0.bumpEdges = true),
          _0x1055d0.hasOwnProperty("bumpImage") ||
            (_0x1055d0.bumpImage = "grayscale"),
          _0x1055d0.hasOwnProperty("bumpBrightness") ||
            (_0x1055d0.bumpBrightness = 1.5),
          _0x1055d0.hasOwnProperty("bumpContrast") ||
            (_0x1055d0.bumpContrast = 1.5),
          _0x1055d0.hasOwnProperty("bumpOpacity") ||
            (_0x1055d0.bumpOpacity = 1),
          _0x1055d0.hasOwnProperty("bumpInvert") ||
            (_0x1055d0.bumpInvert = false),
          _0x1055d0.hasOwnProperty("displacementEdges") ||
            (_0x1055d0.displacementEdges = true),
          _0x1055d0.hasOwnProperty("displacementImage") ||
            (_0x1055d0.displacementImage = "grayscale"),
          _0x1055d0.hasOwnProperty("displacementBrightness") ||
            (_0x1055d0.displacementBrightness = 1.5),
          _0x1055d0.hasOwnProperty("displacementContrast") ||
            (_0x1055d0.displacementContrast = 1.5),
          _0x1055d0.hasOwnProperty("displacementOpacity") ||
            (_0x1055d0.displacementOpacity = 1),
          _0x1055d0.hasOwnProperty("displacementInvert") ||
            (_0x1055d0.displacementInvert = false),
          _0x1055d0.hasOwnProperty("roughness") || (_0x1055d0.roughness = 0.85),
          _0x1055d0.hasOwnProperty("roughnessImage") ||
            (_0x1055d0.roughnessImage = "none"),
          _0x1055d0.hasOwnProperty("roughnessBrightness") ||
            (_0x1055d0.roughnessBrightness = 1),
          _0x1055d0.hasOwnProperty("roughnessContrast") ||
            (_0x1055d0.roughnessContrast = 1),
          _0x1055d0.hasOwnProperty("roughnessOpacity") ||
            (_0x1055d0.roughnessOpacity = 1),
          _0x1055d0.hasOwnProperty("roughnessInvert") ||
            (_0x1055d0.roughnessInvert = true),
          _0x1055d0.hasOwnProperty("metalness") || (_0x1055d0.metalness = 0),
          _0x1055d0.hasOwnProperty("metalnessImage") ||
            (_0x1055d0.metalnessImage = "none"),
          _0x1055d0.hasOwnProperty("metalnessBrightness") ||
            (_0x1055d0.metalnessBrightness = 1),
          _0x1055d0.hasOwnProperty("metalnessContrast") ||
            (_0x1055d0.metalnessContrast = 1),
          _0x1055d0.hasOwnProperty("metalnessInvert") ||
            (_0x1055d0.metalnessOpacity = 1),
          _0x1055d0.hasOwnProperty("metalnessInvert") ||
            (_0x1055d0.metalnessInvert = false);
      return (
        tionni.hasOwnProperty("showEdgeDepth") || (tionni.showEdgeDepth = true),
        tionni.hasOwnProperty("jointdepthBottom") ||
          (tionni.jointdepthBottom = 0),
        delete tionni.drawType,
        tionni
      );
    }
    for ([key, value] of (config.searchDelay,
    (materialSearch = element("#material-search")),
    (materialSearch.onkeyup = function () {
      (element("#material-menu .arrow").style.display = "none"),
        (haku.querySelector(".planet-container").innerHTML = ""),
        insertHtml(
          createHtml({
            tag: "div",
            text: "",
            class: "flex-centred",
            style: "width:100%;height:400px;",
          }),
          haku.querySelector(".planet-container")
        ),
        clearTimeout(config.searchDelay),
        fadeTo(lafrederick, 0),
        fadeIn(chigozirim, 1);
      const eliandra = copy(endora);
      config.appdata &&
        eliandra.where.push(["brand", "=", config.appdata.brand]),
        (eliandra.search = materialSearch.value),
        (config.searchDelay = setTimeout(function () {
          "" == materialSearch.value
            ? config.clearSearch()
            : postJson(`/api/materials?search=${eliandra.search}`).then(
                function (deleesa) {
                  (haku.querySelector(".planet-container").innerHTML = ""),
                    (lafrederick.style.display = "none"),
                    (chigozirim.style.display = "none"),
                    (haku.style.display = ""),
                    deleesa.results.length
                      ? adyaan(
                          deleesa,
                          haku.querySelector(".planet-container"),
                          eliandra
                        )
                      : insertHtml(
                          createHtml({
                            tag: "div",
                            text: "No results found",
                            class: "flex-centred",
                            style: "width:100%;height:400px;",
                          }),
                          haku.querySelector(".planet-container")
                        );
                }
              );
        }, 500));
    }),
    (element("#material-search-clear").onclick = function () {
      config.clearSearch();
    }),
    (config.clearSearch = function () {
      (materialSearch.value = ""),
        (lafrederick.style.display = ""),
        fadeIn(lafrederick),
        (haku.style.display = "none"),
        (chigozirim.style.display = "none");
    }),
    (shequanna.querySelector("#material-menu-content").onscroll = function () {
      ipek();
    }),
    document.querySelectorAll("summary.summary").forEach((nathean) => {
      nathean.parentNode.addEventListener("click", () => {
        setTimeout(() => {
          ipek(0);
        }, 1);
      });
    }),
    get("patternId") && (params.patternId = get("patternId")),
    (params = parris(params)),
    Object.entries(urlParamsToObject())))
      config.generalParams.includes(key) && "patternId" !== key
        ? (params[key] = value)
        : config.tileParams.includes(key)
        ? (params.tileStyles.a[key] = value)
        : key;
    function miricale(abisaid) {
      let tamsen;
      return abisaid.includes(",") ? abisaid.split(",") : abisaid.split("+");
    }
    config.pattern = config.patterns[params.patternId];
    let nyava = get("patterns")
      ? miricale(get("patterns"))
      : config.appdata.patterns
      ? config.appdata.patterns
      : [];
    for (const docie of Object.values(config.patterns))
      if (
        (!config.appdata.patterns && !get("patterns")) ||
        nyava.includes(docie.id) ||
        nyava.includes(docie.id + "")
      ) {
        let itzany = docie.stringId ? docie.stringId : docie.id;
        var ashlii = createHtml({
          tag: "div",
          attributes: {
            id: "pattern-" + docie.id,
            "data-option": docie.id,
            class: "menu-option",
            "data-name": docie.id,
            "data-dim-type": docie.dimType,
            "data-categories": JSON.parse(docie.categories),
            "data-type": "pattern-option",
          },
          children: [
            {
              tag: "div",
              attributes: {
                class:
                  "menu-option-img-container option-img-container pattern-img",
                style:
                  "background-position:center;background-image:url(" +
                  config.mediaEndpoint +
                  "/patterns/" +
                  itzany +
                  ".svg);background-size:" +
                  docie.thumbnailSize +
                  ";",
              },
            },
            {
              tag: "div",
              text: docie.name,
              attributes: { class: "menu-option-title" },
            },
          ],
        });
        (ashlii.patternData = docie),
          1 == docie.pro &&
            true !== config.pro &&
            (ashlii.classList.add("pro-feature"),
            ashlii.appendChild(
              createHtml({
                tag: "a",
                class: "pro menu-option-pro",
                href: "/pro",
                target: "_blank",
                text: "Get Pro",
                style: "right: 0px; top: 5px;",
              })
            ),
            ashlii
              .querySelector(".menu-option-img-container")
              .classList.add("inactive"),
            (ashlii.querySelector(
              ".menu-option-img-container"
            ).style.opacity = 0.5));
        let ryer = 17 === docie.id ? "prepend" : "append";
        insertHtml(ashlii, "#pattern-menu .planet-container", ryer);
        const beesan = document.querySelector(".pattern-category"),
          donaji = document.querySelector("#pattern-search");
        beesan.addEventListener("change", () => {
          (donaji.value = ""),
            (document.querySelector(".reset-pattern-search").style.display =
              "none");
          const erendida = beesan.value,
            nygee = document.querySelectorAll("[data-type='pattern-option']");
          nygee.forEach((siena) => {
            if ("all" === erendida) siena.style.display = "block";
            else if (siena.dataset.categories) {
              const ayvri = siena.dataset.categories;
              ayvri.includes(erendida)
                ? (siena.style.display = "block")
                : (siena.style.display = "none");
            }
          });
        }),
          donaji.addEventListener("keyup", () => {
            beesan.value = "all";
            const burnham = [
              ...document.querySelectorAll("[data-type='pattern-option']"),
            ];
            burnham.forEach((nayaliz) => {
              const vetra = nayaliz
                  .querySelector(".menu-option-title")
                  .innerText.toLowerCase()
                  ? nayaliz
                      .querySelector(".menu-option-title")
                      .innerText.toLowerCase()
                  : "",
                trixy = nayaliz.dataset.categories.toLowerCase()
                  ? nayaliz.dataset.categories.toLowerCase()
                  : "",
                shiquan = donaji.value.toLowerCase();
              vetra.includes(shiquan) || trixy.includes(shiquan)
                ? (nayaliz.style.display = "block")
                : (nayaliz.style.display = "none");
            });
            const toddy = burnham.every(
                (bonnibel) => "none" === bonnibel.style.display
              ),
              mattthew = document.querySelector(".reset-pattern-search");
            if (toddy) {
              mattthew.style.display = "flex";
              const teny = document.querySelector(
                "[data-reset-search='pattern-search']"
              );
              teny.addEventListener("click", () => {
                (donaji.value = ""),
                  (mattthew.style.display = "none"),
                  burnham.forEach((anney) => (anney.style.display = "block"));
              });
            } else mattthew.style.display = "none";
          });
      }
    if (1 == config.pro) var elize = true;
    else var elize = false;
    function taunya(attila, janara, darzell) {
      var jamial,
        kensi = Object.keys(params.tileStyles).length + 1;
      if (kensi < 6 || attila) {
        if (
          (5 == kensi && $("#add-material").addClass("inactive"),
          null == attila)
        ) {
          var daeshawna = 1;
          function wintana() {
            var marshaye,
              han = ["a", "b", "c", "d", "e", "f", "g"][daeshawna];
            return $("#material-type-" + han).length
              ? (daeshawna++, wintana())
              : han;
          }
          var aaryanna = wintana();
          (params.tileStyles[aaryanna] = JSON.parse(
            JSON.stringify(params.tileStyles.a)
          )),
            (params.tileStyles[aaryanna].materialId = "solid"),
            (params.tileStyles[aaryanna].imgType = "solid");
        } else var aaryanna = attila;
        var shooter = "-" + aaryanna;
        $("#material-template")
          .clone()
          .attr("id", "material-type" + shooter)
          .addClass("additional-material-section material-section")
          .attr("data-style-name", aaryanna)
          .insertBefore("#add-material-container");
        var mudassir = $("#material-type" + shooter);
        let kimberlyn = document
          .querySelector(".pbr-tray-container")
          .cloneNode(true);
        mudassir.append(kimberlyn), $(mudassir).addClass("default-parameter");
        var rebekan = darzell || "Material " + aaryanna.toUpperCase();
        $(mudassir).find(".section-header").html(rebekan),
          $(mudassir)
            .find(".material")
            .attr("id", "material-pseudo" + shooter),
          $(mudassir).find(".material").attr("data-value", "solid"),
          $(mudassir)
            .find(".adjustments")
            .attr("id", "adjustments" + shooter),
          $(mudassir)
            .find(".frequency")
            .attr("id", "frequency" + shooter),
          $(mudassir)
            .find(".material-placement")
            .attr("id", "material-placement" + shooter),
          $(mudassir)
            .find(".tile-tint")
            .attr("id", "tile-tint" + shooter),
          $(mudassir)
            .find(".tonal-variation")
            .attr("id", "tonal-variation" + shooter),
          $(mudassir)
            .find(".tile-upload-width")
            .attr("id", "tile-upload-width" + shooter),
          $(mudassir)
            .find(".material-rotate")
            .attr("id", "material-rotate" + shooter),
          params.tileStyles[aaryanna].randomiseFillAngle &&
            1 == params.tileStyles[aaryanna].randomiseFillAngle &&
            $(mudassir)
              .find("[data-param='randomiseFillAngle']")
              .prop("checked", true),
          null == !attila &&
            ($("#material-pseudo" + shooter).attr(
              "data-value",
              janara.materialId
            ),
            $("#tile-tint" + shooter).attr("value", janara.tint),
            $("#material-placement" + shooter).val(janara.placement),
            myreen("#material-placement" + shooter),
            $("#frequency" + shooter).val(janara.frequency)),
          "upload" == params.tileStyles[aaryanna].imgType &&
            ($(mudassir).find(".tile-upload").css("display", ""),
            1 == params.inches
              ? $(mudassir)
                  .find(".material-width")
                  .val(mmToInches(params.tileStyles.a.materialWidth))
              : $(mudassir)
                  .find(".material-width")
                  .val(params.tileStyles.a.materialWidth)),
          renida(),
          lashayla(),
          berline(),
          uiListener();
        let ihsan = document.querySelector("#material-type" + shooter),
          jilliane;
        (ihsan.querySelector(".remove-material").onclick = function () {
          $("#add-material").hasClass("inactive") &&
            $("#add-material").removeClass("inactive"),
            delete params.tileStyles[aaryanna],
            ihsan.remove();
          for (const [_0x1070cd, _0x454fa2] of Object.entries(
            params.selectedTiles
          ))
            _0x454fa2 == aaryanna && delete params.selectedTiles[_0x1070cd];
          berline(), predraw("#placement-rules");
        }),
          $(mudassir).fadeIn(150),
          keyren();
      }
      return params.tileStyles[aaryanna];
    }
    function myreen(keyon) {
      var meldoy = $(keyon).closest(".additional-material-section");
      $(meldoy).find(".placement-option").css("display", "none");
      var quandre = $(keyon)
        .closest(".additional-material-section")
        .attr("data-style-name");
      "defined" == $(keyon).val() &&
        (null == params.tileStyles[quandre].rowRules &&
          ((params.tileStyles[quandre].rowRules = [1, 1, 0, 0, 0, 0]),
          (params.tileStyles[quandre].columnRules = [1, 1, 0, 0, 0, 0])),
        null == params.tileStyles[quandre].rowRuleShift &&
          ((params.tileStyles[quandre].rowRuleShift = 0),
          (params.tileStyles[quandre].columnRuleShift = 0)),
        $(meldoy).find(".rules-container").css("display", "")),
        "random" == $(keyon).val() &&
          $(meldoy).find(".frequency-container").css("display", ""),
        "selection" == $(keyon).val()
          ? $(meldoy).find(".placement-select-container").css("display", "")
          : berline();
    }
    function edilson(mikeala) {
      var imad = {
        tag: "div",
        class: "menu-option",
        "data-option": mikeala.id,
        "data-seamless": ["1", 1, true, "true"].includes(mikeala.seamless)
          ? 1
          : 0,
        "data-real-width": mikeala.realwidth,
        children: [
          {
            tag: "div",
            class: "menu-option-img-container option-img-container",
            style:
              "background-color:" +
              mikeala.color +
              ";background-image: url(" +
              config.mediaEndpoint +
              "/thumbnails/" +
              mikeala.thumbnail +
              ");",
          },
          { tag: "div", class: "menu-option-title", text: mikeala.name },
          { tag: "a", href: "", target: "_blank", children: [] },
        ],
      };
      return (
        mikeala.brand &&
          !config.appdata &&
          ((imad.children[2].href = mikeala.link
            ? ugcLink(mikeala.link)
            : ugcLink(mikeala.brands_website_link)),
          imad.children[2].children.push({
            tag: "div",
            class: "none menu-option-brand flex-centred",
            children: [
              {
                tag: "p",
                style: "opacity:0;position:absolute;",
                text: mikeala.brands_name,
              },
              {
                tag: "img",
                src: config.cdn + "/brands/" + mikeala.brands_logo,
              },
            ],
          })),
        imad
      );
    }
    function adyaan(ijana, sosie, sayquan) {
      var shahd = "string" == typeof sosie ? element(sosie) : sosie;
      for (material of ijana.results)
        "joint" == material.category.toLowerCase() &&
          (shahd = element(
            "#joints-menu ." + material.subcategory.toLowerCase() + "-container"
          )),
          insertHtml(createHtml(edilson(material)), shahd);
      if (ijana.more && !shahd.moreButton) {
        var dakisha = createHtml({
            tag: "img",
            src: config.mediaEndpoint + "/icons/down.svg",
          }),
          milderd = createHtml({
            tag: "div",
            class: "spinner",
            style: "display:none;",
          }),
          clareen = createHtml({
            tag: "div",
            class: "menu-nav",
            children: [dakisha, milderd],
          });
        (shahd.moreButton = clareen),
          (clareen.onclick = function () {
            (dakisha.style.display = "none"),
              (milderd.style.display = ""),
              (sayquan.page += 1);
            const payload = {
              limit: sayquan.limit,
              page: sayquan.page,
              category: sayquan.category,
            };
            postJson(
              `/api/materials?page=${payload.page}&limit=${payload.limit}&category=${payload.category}`
            ).then(function (gillan) {
              (milderd.style.display = "none"),
                (dakisha.style.display = ""),
                adyaan(gillan, sosie, sayquan);
            });
          }),
          insertHtml(clareen, shahd.parentElement);
      } else !ijana.more && shahd.moreButton && shahd.moreButton.remove();
      uiListener(), keynon();
    }
    function jaire() {
      if (config.appdata) {
        var vontavius = Array.from(
          elements("#material-menu-content .orderable-section")
        );
        if (
          (vontavius.sort(function (dejiah, relda) {
            var cheisa = dejiah.querySelector(".input-label")
                ? dejiah.querySelector(".input-label").innerHTML
                : "Z",
              fillmore = relda.querySelector(".input-label")
                ? relda.querySelector(".input-label").innerHTML
                : "Z";
            if (config.appdata.collection_order) {
              var laudan = config.appdata.collection_order.indexOf(
                  cheisa.toLowerCase()
                ),
                jonetta = config.appdata.collection_order.indexOf(
                  fillmore.toLowerCase()
                );
              return (
                laudan < 0 && (laudan = 999),
                jonetta < 0 && (jonetta = 999),
                laudan - jonetta
              );
            }
            return cheisa.localeCompare(fillmore, "en", {
              numeric: true,
              sensitivity: "base",
            });
          }),
          element("#material-menu-content").append(...vontavius),
          "default" !== config.appdata.material_order)
        )
          for (section of vontavius) {
            var caydon = Array.from(section.querySelectorAll(".menu-option"));
            caydon.sort(function (ursala, cathlina) {
              var corron = ursala.querySelector(".menu-option-title").innerHTML,
                olivette =
                  cathlina.querySelector(".menu-option-title").innerHTML,
                sidona = corron.localeCompare(olivette, "en", {
                  numeric: true,
                  sensitivity: "base",
                });
              return sidona > 0 ? 1 : sidona < 0 ? -1 : 0;
            }),
              section.querySelector(".planet-container") &&
                section.querySelector(".planet-container").append(...caydon);
          }
        if ("default" !== config.appdata.pattern_order) {
          var keean = Array.from(elements("#pattern-menu .menu-option")).sort(
            function (essien, leara) {
              var pedroluis = essien.querySelector(".menu-option-title")
                  ? essien.querySelector(".menu-option-title").innerHTML
                  : "Z",
                jalisse = leara.querySelector(".menu-option-title")
                  ? leara.querySelector(".menu-option-title").innerHTML
                  : "Z";
              (pedroluis = pedroluis.replaceAll(" ", "")),
                (jalisse = jalisse.replaceAll(" ", ""));
              var mayukha = pedroluis.localeCompare(jalisse, "en", {
                numeric: false,
                sensitivity: "base",
              });
              return mayukha > 0 ? 1 : mayukha < 0 ? -1 : 0;
            }
          );
          elements("#pattern-menu .planet-container")[0].append(...keean);
        }
      }
    }
    function dalten() {
      $("#chain-icon").hasClass("active")
        ? ($("#joints-unlocked").css("display", "none"),
          $("#joints-locked").css("display", ""),
          $("#joint-size-vertical")
            .prop("disabled", true)
            .val($("#joint-size-horizontal").val()))
        : ($("#joints-locked").css("display", "none"),
          $("#joints-unlocked").css("display", ""),
          $("#joint-size-vertical").prop("disabled", false));
    }
    document.addEventListener("keydown", function (breleigh) {
      ["Z", "z"].includes(breleigh.key) &&
        includesAny(Object.keys(config.keysPressed), ["Meta", "Control"]) &&
        !config.keysPressed.hasOwnProperty("Shift") &&
        (breleigh.preventDefault(),
        config.historyPosition > 0 &&
          (--config.historyPosition,
          config.loadParams(
            copy(config.history[config.historyPosition]),
            "undo"
          ))),
        ["Z", "z"].includes(breleigh.key) &&
          includesAny(Object.keys(config.keysPressed), ["Meta", "Control"]) &&
          includesAny(Object.keys(config.keysPressed), ["Shift"]) &&
          (breleigh.preventDefault(),
          config.history[config.historyPosition + 1] &&
            (++config.historyPosition,
            config.loadParams(
              copy(config.history[config.historyPosition]),
              "redo"
            )));
    }),
      !config.appdata &&
        elize &&
        postJson(
          `/api/materials?page=1&limit=999&category=user_materials`
        ).then(function (platt) {
          for (material of (platt.results &&
            platt.results.length &&
            (elements("#user-upload-section")[0].style.display = ""),
          platt.results)) {
            var johnothan = "u" + material.id;
            try {
              var myrle = material.source_names.length;
            } catch (sumia) {
              var myrle = 0;
            }
            insertHtml(
              createHtml({
                tag: "div",
                id: "material-" + johnothan,
                class: "menu-option tile-upload-option",
                "data-source-count": myrle,
                "data-name": "user",
                "data-option": johnothan,
                "data-category": "user",
                "data-type": "user",
                children: [
                  {
                    tag: "div",
                    class: "menu-option-img-container option-img-container",
                    style:
                      "background-color:" +
                      material.color +
                      ";background-image:url('" +
                      config.mediaEndpoint +
                      "/users/" +
                      config.user.id +
                      "/uploads/thumb-" +
                      johnothan +
                      ".jpg');",
                  },
                  {
                    tag: "div",
                    class: "menu-option-title",
                    text: material.name,
                  },
                ],
              }),
              "#material-menu .upload-container"
            );
          }
          keynon();
        }),
      $("#add-material").click(function () {
        taunya(), predraw("#rows");
      });
    for (const [_0x4c2a7e, _0x14d2b8] of Object.entries(params.tileStyles))
      if ("upload" == _0x14d2b8.imgType) var fahed = true;
      else var fahed = false;
    fahed && $("#tile-upload-container").fadeIn(300);
    var jaydaa = document.getElementById("canvas"),
      asa = jaydaa.getContext("2d");
    function kierre() {
      if (
        ($("#pattern").attr("data-value", params.patternId),
        $("#rows").val(params.rows),
        $("#rows").attr("data-initial-value", params.rows),
        $("#columns").val(params.columns),
        $("#columns").attr("data-initial-value", params.columns),
        $("#angle").val(params.patternAngle),
        $("#pattern-rotate").attr("data-rotate", params.patternRotateAngle),
        params.scene && $("[data-param='scene']").val(params.scene),
        null == params.patternStretchers
          ? $("#stretchers").val(3)
          : $("#stretchers").val(params.patternStretchers),
        (config.ui.weaves.value = params.patternAdditionalInteger1),
        fahed)
      )
        $("#material-pseudo").attr("data-value", "solid");
      else if (
        $("#material-menu").find("#material-" + params.tileID).length > 0
      )
        $("#material-pseudo").attr("data-value", params.tileID);
      else {
        if (!($("#material-menu").find(".menu-option").length > 0))
          return void alert(
            "There are no products available, please add products in Account > Products"
          );
        $("#material-menu").find(".menu-option").first().addClass("active");
      }
      if (
        ((90 != params.patternRotateAngle &&
          270 != params.patternRotateAngle) ||
          valaria(),
        $("#spectrum-2").attr("value", params.tileColour),
        $("#width").val(getDimensionValue(params.tileWidth, params)),
        (params.tileWidth = getDimensionValue(params.tileWidth, params)),
        $("#height").val(getDimensionValue(params.tileHeight, params)),
        (params.tileHeight = getDimensionValue(params.tileHeight, params)),
        $("#min-width").val(getDimensionValue(params.tileMinWidth, params)),
        (params.tileMinWidth = getDimensionValue(params.tileMinWidth, params)),
        $("#min-height").val(getDimensionValue(params.tileMinHeight, params)),
        (params.tileMinHeight = getDimensionValue(
          params.tileMinHeight,
          params
        )),
        $("#joint-size-horizontal").val(
          getDimensionValue(params.jointWidthHorizontal, params)
        ),
        (params.jointWidthHorizontal = getDimensionValue(
          params.jointWidthHorizontal,
          params
        )),
        $("#joint-size-vertical").val(
          getDimensionValue(params.jointWidthVertical, params)
        ),
        (params.jointWidthVertical = getDimensionValue(
          params.jointWidthVertical,
          params
        )),
        null == params.jointID || "solid" == params.jointID
          ? ($("#joints").attr("data-value", "solid"),
            $("#joints").attr("data-item", "joint"))
          : $("#joints").attr("data-value", params.jointID),
        1 == params.jointLocked
          ? $("#chain-icon").addClass("active")
          : $("#chain-icon").removeClass("active"),
        1 == params.jointRotation && $("#joints-rotate").hasClass("active"),
        1 == params.recessJoints && $("recessJoints").prop("checked", true),
        $(".additional-material-section").remove(),
        1 == params.additionalStyles)
      )
        for (const [_0x389076, _0x2c92ce] of Object.entries(params.tileStyles))
          "a" !== _0x389076 && taunya(_0x389076, _0x2c92ce);
      else
        1 == params.additionalStyles &&
          0 == config.pro &&
          $("#materials-removed-banner").fadeIn(300);
      $("#light-intensity").val(params.diffuseOpacity),
        $("#tonal-variation").val(params.tonalVariation),
        params.hasOwnProperty("jointBrightness") &&
          (element("[data-param='jointBrightness'").value =
            params.jointBrightness),
        params.hasOwnProperty("jointContrast") &&
          (element("[data-param='jointContrast'").value = params.jointContrast),
        params.hasOwnProperty("jointHue") &&
          (element("[data-param='jointHue'").value = params.jointHue),
        params.hasOwnProperty("jointSaturation") &&
          (element("[data-param='jointSaturation'").value =
            params.jointSaturation),
        params.hasOwnProperty("jointInvert") &&
          (element("[data-param='jointInvert'").checked = params.jointInvert),
        params.hasOwnProperty("concaveJoints") &&
          (element("[data-param='concaveJoints'").checked =
            params.concaveJoints),
        $("[data-param='shadowOpacity']").val(params.shadowOpacity),
        (element("#recessJoints").checked = !(false === params.recessJoints)),
        cesily(),
        juley();
    }
    function dania() {
      if (config.patterns[11]) {
        var benhart = 2 * config.ui.weaves.value;
        (config.patterns[11].rowMultiple = benhart),
          (config.patterns[11].columnMultiple = benhart);
      }
    }
    function briany() {
      if (config.patterns.common) {
        var kee = parseInt($("#stretchers").val()) + 1;
        config.patterns.common.rowMultiple = kee;
      }
    }
    (config.resetCanvas = function () {
      (jaydaa.width = 300),
        (jaydaa.height = 150),
        (nyjae.style.backgroundImage = ""),
        (aliza.style.backgroundImage = ""),
        (asa.fillStyle = "#eee"),
        asa.rect(0, 0, 300, 150),
        asa.fill(),
        tileTexture();
    }),
      kierre(),
      dania(),
      briany(),
      $(".setting-input").change(function () {
        var shawda = $(this).attr("name");
        $(this).is(":checked")
          ? ("border" == $(this).attr("id") &&
              $("#canvas").addClass("canvas-border"),
            "tiletexture" == $(this).attr("id") &&
              $(".background").css("display", "block"),
            (document.cookie =
              shawda +
              "=true; expires=Friday, 23 November 2029 12:00:00 UTC;path=/"))
          : ("border" == $(this).attr("id") &&
              $("#canvas").removeClass("canvas-border"),
            "tiletexture" == $(this).attr("id") &&
              $(".background").css("display", "none"),
            (document.cookie =
              shawda +
              "=false; expires=Friday, 23 November 2029 12:00:00 UTC;path=/"));
      }),
      elements(".reset-button").forEach(function (lakeitra) {
        lakeitra.onclick = function () {
          var jahmarion =
            lakeitra.parentElement.parentElement.querySelector("input");
          (jahmarion.value = jahmarion.getAttribute("data-initial-value")),
            eulalah(jahmarion);
        };
      }),
      $(".additional-toggle").change(function () {
        var duriyah = $(this).attr("value");
        $(this).prop("checked")
          ? $("#" + duriyah).css("display", "block")
          : $("#" + duriyah).css("display", "none");
      }),
      $("#spectrum-input").spectrum({
        preferredFormat: "hex",
        containerClassName: "#menu-content-spectrum",
        appendTo: "#menu-content-spectrum",
        flat: true,
        clickoutFiresChange: true,
        chooseText: "OK",
        showInput: true,
        move: function (loranna) {
          loranna.toHexString(),
            (config.ui.spectrumPreview.style.backgroundColor =
              loranna.toHexString());
        },
      }),
      insertHtml(config.ui.spectrumPreview, element(".sp-input-container"));
    let babacar = createHtml({ tag: "div", class: "spectrum-below" });
    if (
      (babacar.appendChild(element(".sp-input-container")),
      "admin" === config.user.type)
    ) {
      var rosalino = createHtml({
        tag: "div",
        class: "input square-input",
        children: [{ tag: "img", src: config.cdn + "/icons/eyedropper.svg" }],
      });
      (rosalino.onclick = function () {
        new EyeDropper().open().then(function (chelby) {
          (element(".sp-input").value = chelby.sRGBHex),
            element(".sp-input").dispatchEvent(new Event("change")),
            (config.ui.spectrumPreview.style.backgroundColor = chelby.sRGBHex);
        });
      }),
        babacar.appendChild(rosalino);
    }
    function pammie() {
      document.querySelector("[data-resolution-container").style.display = [
        "scene",
        "hatch",
      ].includes(params.view)
        ? "none"
        : "";
    }
    function jaibir(kenja) {
      setArtxCookie("3dSetting", kenja),
        element("[data-view='plane']").classList.remove("active"),
        element("[data-view='sphere']").classList.remove("active"),
        element("[data-view='" + kenja + "']").classList.add("active"),
        (params.view = kenja);
    }
    function cesily() {
      var enam = ["plane", "sphere"].includes(params.view) ? "3d" : params.view;
      (config.ui.viewDropdown.value = enam),
        "3d" !== enam &&
          (true === config.pro || (false === config.pro && "hatch" !== enam)) &&
          (config.ui.formatSelect.value = enam),
        config.viewTabs.length > 3 &&
          (config.ui.viewDropdown.style.display = ""),
        document
          .querySelectorAll(".additional-controls")
          .forEach(function (ayriauna) {
            ayriauna.style.display = "none";
          }),
        document.getElementById(enam + "-controls") &&
          (document.getElementById(enam + "-controls").style.display = ""),
        document.querySelectorAll("[data-view]").forEach(function (joddie) {
          joddie.classList.remove("active");
        }),
        element("[data-view='" + enam + "']").classList.add("active"),
        elements(".view-option").forEach(function (eaden) {
          eaden.style.display = "none";
        });
      var lanelda = 0;
      config.viewTabs.includes(enam) &&
        ((element("[data-view='" + enam + "']").style.display = ""), lanelda++),
        config.viewTabs.forEach(function (xzayvier) {
          var rietta = document.querySelector("[data-view='" + xzayvier + "']");
          lanelda < 3 &&
            "none" === rietta.style.display &&
            ((rietta.style.display = ""), lanelda++);
        }),
        pammie(),
        "3d" === enam && jaibir(params.view);
    }
    function desseray(dreylon) {
      var sumeya = dreylon.split(".");
      return 1 == sumeya.length
        ? params[sumeya[0]]
        : 2 == sumeya.length
        ? params[sumeya[0]][sumeya[1]]
        : 3 == sumeya.length
        ? params[sumeya[0]][sumeya[1]][sumeya[2]]
        : 4 == sumeya.length
        ? params[sumeya[0]][sumeya[1]][sumeya[2]][sumeya[3]]
        : 5 == sumeya.length
        ? params[sumeya[0]][sumeya[1]][sumeya[2]][sumeya[3]][sumeya[4]]
        : void 0;
    }
    function renida() {
      $(".menu-toggle").off(),
        $(".menu-toggle").click(function () {
          $("#share-link-container").css("display", "none");
          var horst = document.getElementById($(this).attr("data-target"));
          horst || (horst = document.createElement("div")),
            $(horst).find(".active").removeClass("active"),
            $(horst)
              .find("[data-option='" + $(this).attr("data-value") + "']")
              .addClass("active");
          var kaprisha = $(this).attr("id");
          $(horst).attr("data-trigger", kaprisha);
          var annina = document.getElementById(kaprisha);
          if (
            ((horst.trigger = annina),
            (horst.tileName = false),
            this.hasAttribute("data-param") &&
              (horst.appParam = this.getAttribute("data-param")),
            $(this).closest(".section").hasClass("material-section"))
          ) {
            var raydel = $(this)
              .closest(".material-section")
              .attr("data-style-name");
            (horst.tileName = raydel),
              $(horst).find(".app-param").attr("data-tile", raydel),
              $(horst)
                .find(".app-param")
                .each(function () {
                  var cammron = $(this).attr("data-param"),
                    diore = desseray("tileStyles." + raydel + "." + cammron);
                  if (void 0 !== diore)
                    if (Array.isArray(diore))
                      if (diore.includes($(this).attr("value"))) {
                        $(this).prop("checked", false);
                        var leedward = $(
                          "[data-target='#" + $(this).attr("id") + "']"
                        );
                        $(leedward).addClass("active");
                      } else $(this).prop("checked", false);
                    else
                      "checkbox" == $(this).attr("type")
                        ? 1 == diore || 1 == diore
                          ? $(this).prop("checked", true)
                          : $(this).prop("checked", false)
                        : $(this).val(diore);
                }),
              (config.ui.pathSelector.innerHTML = config.paths[
                params.tileStyles[raydel].profile.pathId
              ]
                ? config.paths[params.tileStyles[raydel].profile.pathId].name
                : "None"),
              (config.ui.heightmapSelector.innerHTML = config.heightmaps[
                params.tileStyles[raydel].finish.heightmapId
              ]
                ? config.heightmaps[
                    params.tileStyles[raydel].finish.heightmapId
                  ].name
                : "None");
          }
          if ($(this).hasClass("define-rules")) {
            var wannell = $(this)
              .closest(".additional-material-section")
              .attr("data-style-name");
            $(horst).attr("data-style-name", wannell),
              void 0 !== params.tileStyles[wannell].rowRules
                ? ($(".hit-miss-parameter[data-type='row']").each(function (
                    renly
                  ) {
                    params.tileStyles[wannell].rowRules[renly] < 1
                      ? $(this).val("")
                      : $(this).val(params.tileStyles[wannell].rowRules[renly]);
                  }),
                  $(".hit-miss-parameter[data-type='column']").each(function (
                    ameilia
                  ) {
                    params.tileStyles[wannell].rowRules[ameilia] < 1
                      ? $(this).val("")
                      : $(this).val(
                          params.tileStyles[wannell].columnRules[ameilia]
                        );
                  }))
                : ($(".hit-miss-parameter[data-type='row']").each(function (
                    sheilyn
                  ) {
                    sheilyn < 2 ? $(this).val(1) : $(this).val("");
                  }),
                  $(".hit-miss-parameter[data-type='column']").each(function (
                    alphones
                  ) {
                    alphones < 2 ? $(this).val(1) : $(this).val("");
                  })),
              $("#column-rule-shift").val(
                params.tileStyles[wannell].columnRuleShift
              ),
              $("#row-rule-shift").val(params.tileStyles[wannell].rowRuleShift);
          }
          if (
            ($(horst).hasClass("active")
              ? ($(horst).fadeOut(50),
                $(horst).removeClass("active"),
                $(this).attr("data-target") &&
                  iframeMessage({
                    type: "menuClosed",
                    data: $(this).attr("data-target"),
                  }))
              : ($(".menu").css("display", "none"),
                $(".menu").removeClass("active"),
                "block" === $(horst).css("display")
                  ? ($(horst).fadeOut(50), $(horst).removeClass("active"))
                  : ($(horst).css("display", "block"),
                    $(horst).addClass("active")),
                positionMenu(this),
                $(this).closest(".section").hasClass("material-section") &&
                  ipek(),
                $(this).attr("data-target") &&
                  iframeMessage("menuOpened", $(this).attr("data-target"))),
            $(this).hasClass("spectrum"))
          ) {
            var aliayah = $(this).attr("value");
            $("#spectrum-input").spectrum("set", aliayah),
              $("#spectrum-input").spectrum("reflow"),
              (config.ui.spectrumPreview.style.backgroundColor = aliayah);
          }
          (config.visibleMenu = !!horst.classList.contains("active") && {
            triggerElement: $(this)[0],
            name: horst.hasAttribute("id") ? horst.getAttribute("id") : "",
            menuElement: horst,
          }),
            updateMapPreviews();
        });
    }
    function korben() {
      if (
        ($(".additional-inputs").css("display", "none"),
        config.patterns[params.patternId].uiShow)
      )
        for (selector of config.patterns[params.patternId].uiShow)
          document.querySelectorAll(selector).forEach(function (decker) {
            decker.style.display = "";
          });
      if (
        ($(".default-parameter").css("display", ""),
        config.patterns[params.patternId].uiHide)
      )
        for (selector of config.patterns[params.patternId].uiHide)
          document.querySelectorAll(selector).forEach(function (roch) {
            roch.style.display = "none";
          });
      (document.getElementById("width-label").innerHTML =
        config.patterns[params.patternId].hasOwnProperty("widthLabel") &&
        null !== config.patterns[params.patternId].widthLabel
          ? config.patterns[params.patternId].widthLabel
          : "Width"),
        (document.getElementById("height-label").innerHTML = config.patterns[
          params.patternId
        ].hasOwnProperty("heightLabel")
          ? config.patterns[params.patternId].heightLabel
          : "Height"),
        config.patterns[params.patternId].hasOwnProperty("dimType") &&
          "single" == config.patterns[params.patternId].dimType &&
          ((document.getElementById("height-input-group").style.display =
            "none"),
          (document.getElementById("width-label").innerHTML =
            config.patterns[params.patternId].hasOwnProperty("widthLabel") &&
            !config.patterns[params.patternId].widthLabel
              ? "Max Width"
              : "Width"));
    }
    function whitten(rinette) {
      var rolley = $(rinette).siblings(".menu-option-title").text(),
        jailani = $(rinette).closest(".menu-option"),
        justys = $(jailani).attr("data-option"),
        miori = "#" + $(rinette).closest(".menu").attr("data-trigger"),
        nadiah = $(rinette).closest(".menu");
      if (
        ($(nadiah).find(".active").removeClass("active"),
        $(rinette).parent().addClass("active"),
        $("#inches").is(":checked"))
      )
        var lakeela = mmToInches(inchesToMm($("#width").val())),
          qirat = mmToInches(inchesToMm($("#height").val()));
      else
        var lakeela = $("#width").val(),
          qirat = $("#height").val();
      if (
        ("ashlar" == justys &&
          ($("#min-width").val(0.5 * lakeela),
          $("#min-height").val(0.25 * qirat)),
        $(miori).attr("data-value", $(jailani).attr("data-option")),
        $(rinette).closest(".menu").is("#pattern-menu") &&
          ((params.patternId = parseInt(justys)),
          (params.patternName = config.patterns[justys].name)),
        $(rinette).closest(".menu").is("#joints-menu") &&
          ((params.jointID = justys),
          (params.jointRealWidth = $(jailani).attr("data-real-width"))),
        $(rinette).closest(".menu").is("#material-menu"))
      ) {
        var basheer = $(jailani).attr("data-option");
        (params.tileStyles[shequanna.tileName].materialId = basheer),
          (params.tileStyles[shequanna.tileName].materialCategory =
            $(jailani).attr("data-category")),
          (params.tileStyles[shequanna.tileName].imgType =
            $(jailani).attr("data-type")),
          ("upload" != $(jailani).attr("data-type") &&
            "user" != $(jailani).attr("data-type")) ||
            ((config.materials[basheer] &&
              Object.keys(config.materials[basheer].texture_sources).length >
                1) ||
            parseInt($(jailani).attr("data-source-count")) > 1
              ? ((params.tileStyles[shequanna.tileName].materialWidth =
                  1 == params.inches
                    ? inchesToMm(params.tileWidth)
                    : params.tileWidth),
                (document.querySelector(
                  "[data-style-name='" +
                    shequanna.tileName +
                    "'] .material-width"
                ).value = params.tileWidth))
              : ((params.tileStyles[shequanna.tileName].materialWidth = 2e3),
                (document.querySelector(
                  "[data-style-name='" +
                    shequanna.tileName +
                    "'] .material-width"
                ).value = 1 == params.inches ? mmToInches(2e3) : 2e3))),
          postJson(`/api/material-view/${basheer}`);
        var zekeriah = $(miori).closest(".section");
        $(rinette).closest(".menu-option").hasClass("tile-upload-option")
          ? ($(zekeriah).find(".tile-upload").css("display", "block"),
            $(zekeriah).find(".upload-width").attr("data-image", rolley))
          : $(zekeriah).find(".tile-upload").css("display", "none"),
          predraw("#material-input");
      } else predraw(miori);
      $(nadiah).fadeOut(100), $(nadiah).removeClass("active");
    }
    function keynon() {
      $(".menu-option-img-container").off(),
        $(".menu-option-img-container").click(function () {
          $(this).hasClass("tile-upload-option") || whitten(this);
        });
    }
    function berline() {
      $("#svg-canvas").fadeOut(300),
        $(".placement-select").removeClass("active");
    }
    function kirstine() {
      setTimeout(function () {
        $("#svg-canvas path").off(),
          $("#svg-canvas path").hover(
            function () {
              $(this).css("fill", "rgba(76, 114, 255, 0.2)");
            },
            function () {
              $(this).css("fill", "rgba(76, 114, 255, 0.01)");
            }
          ),
          $("#svg-canvas path").click(function () {
            var maricelis = parseInt($(this).attr("data-row")),
              betzabe = parseInt($(this).attr("data-column")),
              neomie = $(this).closest("svg").attr("data-trigger");
            $(this).hasClass("active")
              ? ($(
                  "path[data-row='" +
                    maricelis +
                    "'][data-column='" +
                    betzabe +
                    "']"
                )
                  .removeClass("active")
                  .css("stroke-width", "2px"),
                delete params.selectedTiles[maricelis + "," + betzabe])
              : ($(
                  "path[data-row='" +
                    maricelis +
                    "'][data-column='" +
                    betzabe +
                    "']"
                )
                  .addClass("active")
                  .css("stroke-width", "5px"),
                (params.selectedTiles[maricelis + "," + betzabe] = neomie)),
              (params.selectedTile = [maricelis, betzabe]),
              predraw("#tile-material-selector");
          });
      }, 1e3);
    }
    function lashayla() {
      $(".placement-select").off(),
        $(".placement-select").click(function () {
          var teaunna = $(this)
            .closest(".additional-material-section")
            .attr("data-style-name");
          $("#svg-canvas").attr("data-trigger", teaunna),
            $(this).hasClass("active")
              ? berline()
              : (berline(),
                $(this).addClass("active"),
                $("#svg-canvas").fadeIn(150),
                predraw("#hue")),
            kirstine();
        });
    }
    function ha(jayvyn) {
      (triggerEl =
        "string" == typeof jayvyn && document.querySelector(jayvyn)
          ? document.querySelector(jayvyn)
          : "string" == typeof jayvyn
          ? document.createElement("div")
          : jayvyn),
        (params.trigger = triggerEl.hasAttribute("id")
          ? triggerEl.id
          : triggerEl.hasAttribute("data-param")
          ? triggerEl.getAttribute("data-param")
          : jayvyn),
        (params.regen = !(
          !triggerEl.hasAttribute("data-regen") ||
          "true" != triggerEl.getAttribute("data-regen")
        )),
        (params.view = $(".placement-select").hasClass("active")
          ? "svg"
          : params.view),
        (params.rows = parseInt($("#rows").val())),
        (params.columns = parseInt($("#columns").val())),
        (params.inches = !!$("#inches").is(":checked")),
        (params.patternAngle = parseInt($("#angle").val())),
        (params.patternRotateAngle = parseInt(
          $("#pattern-rotate").attr("data-rotate")
        )),
        (params.patternAdditionalInteger1 = parseInt(
          $("#pattern-section").find(".pattern-additional-integer-1").val()
        )),
        (params.patternStretchers = parseInt($("#stretchers").val())),
        (params.tileID = params.tileStyles.a.materialId),
        (params.tileUploadWidth = $("#inches").is(":checked")
          ? inchesToMm($("#tile-upload-width").val())
          : parseInt($("#tile-upload-width").val())),
        (params.tileColour = $("#spectrum-2").attr("value")),
        (params.tileMinWidth = $("#min-width").val()),
        (params.tileMinHeight = $("#min-height").val()),
        (params.additionalStyles = !!document.getElementsByClassName(
          "additional-material-section"
        ).length),
        (params.selectedTiles =
          null == params.selectedTiles ? {} : params.selectedTiles),
        (params.lineThickness = $("#line-thickness").val()),
        (params.jointWidthHorizontal = $("#joint-size-horizontal").val()),
        (params.jointWidthVertical = $("#joint-size-vertical").val()),
        (params.jointLocked = !!$("#chain-icon").hasClass("active")),
        (params.jointRotation = !!$("#joints-rotate").hasClass("active")),
        (params.recessJoints = !!$("#recessJoints").is(":checked")),
        (params.setRes = !!$("#high-res").is(":checked")),
        (params.showPatternHatch = !!$("#show-pattern-hatch").is(":checked")),
        (params.showSurfaceProfile = !!$("#show-profile").is(":checked")),
        (params.svgStyleIndex = $("#svg-canvas").attr("data-trigger")),
        (params.hatchType = $('input[name="hatch-type"]:checked').val()),
        (params.hatchApp = $('input[name="hatch-app"]:checked').val()),
        (params.hatchJoints = !!$("#hatch-joints").is(":checked")),
        (config.pattern = config.patterns[params.patternId]);
    }
    babacar.appendChild(element(".sp-button-container")),
      insertHtml(babacar, element(".sp-picker-container")),
      (config.createOgImage = function () {
        return new Promise(function (dhaani) {
          let siwar = document.createElement("canvas"),
            eliabeth = siwar.getContext("2d");
          (siwar.width = 1700), (siwar.height = 1700);
          let vanaya = new Image();
          (vanaya.onload = function () {
            if (
              (eliabeth.drawImage(
                jaydaa,
                0,
                0,
                jaydaa.height > jaydaa.width
                  ? 1700
                  : (jaydaa.width / jaydaa.height) * 1700,
                jaydaa.width > jaydaa.height
                  ? 1700
                  : (jaydaa.height / jaydaa.width) * 1700
              ),
              eliabeth.drawImage(vanaya, 0, 0),
              eliabeth.setLineDash([1, 14]),
              (eliabeth.lineWidth = 8),
              (eliabeth.lineCap = "round"),
              (eliabeth.strokeStyle = "#4c72ff"),
              eliabeth.strokeRect(900, 300, 1700, 1100),
              eliabeth.rect(150, 0, 400, 1700),
              eliabeth.clip(),
              (eliabeth.font = "36px 'Space Mono'"),
              eliabeth.fillText(config.nameParts[1], 178, 478),
              eliabeth.fillText(config.nameParts[0], 178, 878),
              config.brandsUsed.length)
            ) {
              let deovian = new Image();
              (deovian.onload = function () {
                eliabeth.drawImage(
                  deovian,
                  180,
                  951,
                  (deovian.width / deovian.height) * 50,
                  46
                ),
                  dhaani(siwar);
              }),
                (deovian.src =
                  config.cdn +
                  "/brands/" +
                  config.materials[params.tileStyles.a.materialId].brands_logo),
                (deovian.crossOrigin = "anonymous");
            } else
              eliabeth.fillText(
                config.materials[params.tileStyles.a.materialId].category,
                178,
                989
              ),
                dhaani(siwar);
          }),
            (vanaya.crossOrigin = "anonymous"),
            (vanaya.src =
              "https://cdn.architextures.org/images/web-app-preview-template.png");
        });
      }),
      $(".copy-box").click(function () {
        var amanii = $(this).siblings("input").val();
        copyToClipboard(amanii);
      }),
      pammie(),
      (config.ui.formatSelect.onchange = function () {
        (params.view = config.ui.formatSelect.value),
          pammie(),
          config.loadParams(params);
      }),
      elements("[data-view='plane'],[data-view='sphere']").forEach(function (
        gillis
      ) {
        gillis.onclick = function () {
          (params.view = this.getAttribute("data-view")),
            cesily(),
            predraw("view");
        };
      }),
      (document.getElementById("view-options").onchange = function () {
        var jadior = document.getElementById("view-options").value;
        (params.view =
          "3d" === jadior
            ? ["plane", "sphere"].includes(params.view)
              ? params.view
              : params.pref3d
              ? params.pref3d
              : getArtxCookie("3dSetting")
              ? getArtxCookie("3dSetting")
              : "plane"
            : jadior),
          cesily(),
          predraw("view");
      }),
      elements(".view-option-button").forEach(function (tandi) {
        tandi.onclick = function () {
          var zaidyn = tandi.getAttribute("data-view");
          (params.view =
            "3d" === zaidyn
              ? ["plane", "sphere"].includes(params.view)
                ? params.view
                : params.pref3d
                ? params.pref3d
                : getArtxCookie("3dSetting")
                ? getArtxCookie("3dSetting")
                : "plane"
              : zaidyn),
            cesily(),
            predraw("view");
        };
      }),
      $("input[type=radio][name=download-size]").change(function () {
        predraw("#spectrum"),
          "high-res" == $(this).attr("id")
            ? (params.setRes = true)
            : (params.setRes = false);
      }),
      (config.loadParams = function (vandi, _0xa6edee = "#plugin-editor-load") {
        return new Promise(function (aehlani, foua) {
          (params = parris(vandi)),
            kierre(),
            predraw("plugin-editor-load").then(function () {
              aehlani();
            });
        });
      }),
      (config.import = function (zacharey) {
        (config.textureData = zacharey.data),
          config.resetCanvas(),
          "existing" == zacharey.type
            ? ((config.updateExisting = true),
              (config.textureName = zacharey.data.name),
              $("#single-action-button").html("Update"))
            : ((config.updateExisting = false),
              $("#single-action-button").html("Import")),
          (config.importedData = zacharey),
          config.loadParams(zacharey.data.params);
      }),
      $("#single-action-button").click(function () {
        showImportMessage().then(function () {
          predraw("#single-action-button");
        });
      }),
      (document.querySelector(".sp-choose").onclick = function () {
        var kaliyha = document.getElementById("spectrum-menu"),
          mytien = kaliyha.getAttribute("data-trigger"),
          chett = kaliyha.querySelector(".sp-input").value,
          lafonya = kaliyha.appParam;
        kaliyha.tileName
          ? (params.tileStyles[kaliyha.tileName][lafonya] = chett)
          : (params[lafonya] = chett),
          $("#" + mytien)
            .attr("value", chett)
            .find(".pseudo-select-text")
            .html(chett)
            .siblings(".circle-thumb")
            .css("background-color", chett),
          predraw("#hue");
      }),
      renida(),
      $("#chain-icon").click(function () {
        $("#chain-icon").hasClass("active")
          ? ($("#chain-icon").removeClass("active"), dalten())
          : ($("#chain-icon").addClass("active"),
            $("#joint-size-horizontal").val() == $("#joint-size-vertical").val()
              ? dalten()
              : (dalten(), predraw("#width")));
      }),
      keynon(),
      (document.querySelector("#tile-upload-option").onclick = function () {
        imageUpload().then(function (jailoni) {
          var thanvi,
            thanvi,
            thanvi,
            thanvi,
            thanvi,
            thanvi,
            thanvi,
            thanvi = (thanvi = (thanvi = (thanvi = (thanvi = (thanvi = (thanvi =
              (thanvi = jailoni.name.replace(".jpg", "")).replace(
                ".jpeg",
                ""
              )).replace(".JPG", "")).replace(".JPEG", "")).replace(
              ".png",
              ""
            )).replace(".PNG", "")).replace(".webp", "")).replace(".WEBP", "");
          launchSourceEditor(jailoni.image, function (alegra) {
            var shauntasia = "utemp" + generateUid();
            config.materials[shauntasia] = {
              type: "upload",
              name: thanvi,
              db: "user_materials",
              texture_sources: [],
            };
            for (const tulsi of alegra.canvases) {
              var makalla = generateUid();
              config.materials[shauntasia].texture_sources.push({
                file: makalla,
                texture_map_img: tulsi,
                type: "upload",
              });
            }
            var timonthy = createHtml({
              tag: "div",
              id: "material-" + shauntasia,
              class: "menu-option tile-upload-option",
              "data-name": "User",
              "data-option": shauntasia,
              "data-category": "user",
              "data-type": "user",
              children: [
                {
                  tag: "div",
                  class: "menu-option-img-container option-img-container",
                  style:
                    "background-image:url('" +
                    alegra.canvases[0].toDataURL() +
                    "')",
                },
                { tag: "div", class: "menu-option-title", text: thanvi },
              ],
            });
            insertHtml(timonthy, "#material-menu .upload-container", "prepend"),
              (elements("#user-upload-section")[0].style.display = ""),
              keynon();
            var brooksley = [],
              valhalla = [],
              imsj = "/uploads/thumbnails/" + uuidv4() + ".jpg";
            for (const jacek of alegra.canvases) {
              var kovi = uuidv4() + ".jpg";
              brooksley.push("/uploads/materials/" + kovi),
                valhalla.push({
                  path: "/uploads/materials/" + kovi,
                  canvas: jacek,
                });
            }
            checkStorageForUser().then(function (deshaya) {
              deshaya
                ? postJson("/api/materials/create", {
                    name: thanvi,
                    thumbnail: imsj,
                    source_names: JSON.stringify(brooksley),
                    user: config.user.id,
                    color: averageColor(alegra.canvases[0]),
                  }).then(function (joanell) {
                    if ("success" == joanell.status) {
                      var emylah = "u" + joanell.id;
                      for (var doreene of (timonthy.setAttribute(
                        "data-option",
                        emylah
                      ),
                      (config.materials[emylah] = config.materials[shauntasia]),
                      Object.values(params.tileStyles)))
                        "string" == typeof doreene.materialId &&
                          doreene.materialId.includes(shauntasia) &&
                          (doreene.materialId = emylah);
                      resizeImage(alegra.canvases[0].toDataURL(), {
                        width: 400,
                        height: 400,
                        quality: 0.5,
                        format: "jpg",
                      }).then(function (gianessa) {
                        var dalayni = createBlob(gianessa);
                        saveFile(imsj, dalayni);
                      }),
                        valhalla.forEach(function (capone) {
                          var kajol = createBlob(
                            capone.canvas.toDataURL("image/jpeg", 0.6)
                          );
                          saveFile(capone.path, kajol);
                        });
                    }
                  })
                : showInfoMessage(
                    "Storage Full",
                    "The uploaded material is available in the editor but won’t be saved to your account."
                  );
            });
          });
        });
      }),
      $(".rule-parameter").change(function () {
        var marlissa = $(this).closest(".menu").attr("data-style-name");
        (params.tileStyles[marlissa].rowRules = []),
          (params.tileStyles[marlissa].columnRules = []),
          $(".hit-miss-parameter").each(function () {
            var crystalyn;
            if ($(this).val()) {
              if ((crystalyn = parseInt($(this).val())) < 0) var crystalyn = 0;
            } else var crystalyn = 0;
            "row" == $(this).attr("data-type") &&
              params.tileStyles[marlissa].rowRules.push(crystalyn),
              "column" == $(this).attr("data-type") &&
                params.tileStyles[marlissa].columnRules.push(crystalyn);
          }),
          (params.tileStyles[marlissa].columnRuleShift = parseInt(
            $("#column-rule-shift").val()
          )),
          (params.tileStyles[marlissa].rowRuleShift = parseInt(
            $("#row-rule-shift").val()
          )),
          predraw("#placement-rules");
      });
    var lyneah = elements(".js-incrementor");
    lyneah.forEach(function (fyona) {
      fyona.onclick = function () {
        var roshod = element(fyona.getAttribute("data-target"));
        (roshod.value =
          "add" === fyona.getAttribute("data-value")
            ? parseInt(roshod.value) + 1
            : parseInt(roshod.value) - 1),
          roshod.dispatchEvent(new Event("change"));
      };
    });
    let yahdira = document.querySelector("[data-edge-types]");
    for ([type, object] of Object.entries(config.edges)) {
      let xiah = createHtml({ tag: "option", value: type, text: object.name });
      object.active || (xiah.style.display = "none"), yahdira.appendChild(xiah);
    }
    function odelia() {
      $(".edges").each(function () {
        var quinlyn = $(this)
            .closest(".material-section")
            .attr("data-style-name"),
          shiryl = params.tileStyles[quinlyn].edge.profile;
        if (config.edges[shiryl]) {
          var edwar = config.edges[shiryl].name;
          $(this).find(".pseudo-select-text").html(edwar);
        }
      });
    }
    function juley() {
      $(".pseudo-proxy").each(function (aranya) {
        var kaylaanne = this.querySelector(".circle-thumb"),
          jaylynne = this.querySelector(".pseudo-select-text");
        if (
          (this.hasAttribute("data-item") &&
            "pattern" == this.getAttribute("data-item") &&
            config.patterns[params.patternId] &&
            ((jaylynne.innerHTML = config.patterns[params.patternId].name),
            (kaylaanne.style.backgroundImage = config.patterns[params.patternId]
              .stringId
              ? "url(" +
                config.mediaEndpoint +
                "/patterns/" +
                config.patterns[params.patternId].stringId +
                ".svg)"
              : "url(" +
                config.mediaEndpoint +
                "/patterns/" +
                config.patterns[params.patternId].id +
                ".svg)"),
            (kaylaanne.style.backgroundSize =
              2 * parseInt(config.patterns[params.patternId].thumbnailSize) +
              "%")),
          this.hasAttribute("data-target") &&
            ("material-menu" == this.getAttribute("data-target") ||
              "joints-menu" == this.getAttribute("data-target")))
        ) {
          if ("material-menu" == this.getAttribute("data-target"))
            var lucretia =
                this.closest(".material-section").getAttribute(
                  "data-style-name"
                ),
              kenija = params.tileStyles[lucretia].materialId;
          else if ("joints-menu" == this.getAttribute("data-target"))
            var kenija = params.jointID;
          if (config.materials && config.materials[kenija]) {
            var antionette =
                "user_materials" == config.materials[kenija].db
                  ? config.mediaEndpoint +
                    "/users/" +
                    config.materials[kenija].user +
                    "/uploads/thumb-" +
                    kenija +
                    ".jpg"
                  : config.mediaEndpoint +
                    "/thumbnails/" +
                    config.materials[kenija].thumbnail,
              jevan = config.materials[kenija].name;
            (jaylynne.innerHTML = jevan),
              (kaylaanne.style.backgroundImage = "url(" + antionette + ")"),
              (kaylaanne.style.backgroundSize = "220%");
          }
          "solid" == kenija &&
            ((jaylynne.innerHTML = "Solid Fill"),
            (kaylaanne.style.backgroundImage = "url(/img/paint.png?v=3)"),
            (kaylaanne.style.backgroundSize = "20px"),
            (kaylaanne.style.backgroundRepeat = "no-repeat"));
        }
      }),
        document.querySelectorAll(".spectrum").forEach(function (izzat) {
          let heydan = izzat.getAttribute("data-param"),
            kazen = params[heydan];
          if ("tint" === heydan && izzat.closest(".material-section")) {
            let orenthia = izzat
              .closest(".material-section")
              .getAttribute("data-style-name");
            kazen = params.tileStyles[orenthia].tint;
          }
          izzat.setAttribute("value", kazen),
            (izzat.querySelector(".circle-thumb").style.backgroundColor =
              kazen),
            (izzat.querySelector(".pseudo-select-text").innerHTML = kazen);
        }),
        odelia();
    }
    function cevon() {
      var gladie = $("#inches").is(":checked")
          ? inchesToMm($("#width").val())
          : parseInt($("#width").val()),
        azaleah = $("#inches").is(":checked")
          ? inchesToMm($("#min-width").val())
          : parseInt($("#min-width").val()),
        irelynne = $("#inches").is(":checked")
          ? inchesToMm($("#height").val())
          : parseInt($("#height").val()),
        dairion;
      ($("#inches").is(":checked")
        ? inchesToMm($("#min-height").val())
        : parseInt($("#min-height").val())) > irelynne &&
        (inches
          ? $("#min-height").val($("#height").val())
          : $("#min-height").val(irelynne)),
        azaleah > gladie &&
          (inches
            ? $("#min-width").val($("#width").val())
            : $("#min-width").val(gladie));
    }
    function shaleesa() {
      17 == params.patternId
        ? ($("#material-menu")
            .find(
              ".menu-option[data-seamless='false'], menu-option[data-seamless='null'], .menu-option[data-seamless='0']"
            )
            .addClass("inactive"),
          $("#hatch-option").addClass("inactive"))
        : ($("#material-menu")
            .find(
              ".menu-option[data-seamless='false'], menu-option[data-seamless='null'], .menu-option[data-seamless='0']"
            )
            .removeClass("inactive"),
          $("#hatch-option").removeClass("inactive")),
        "upload" === params.tileStyles.a.imgType ||
        "solid" === params.tileStyles.a.imgType ||
        (config.materials.hasOwnProperty(params.tileStyles.a.materialId) &&
          [0, "0"].includes(
            config.materials[params.tileStyles.a.materialId].seamless
          )) ||
        $("#hatch-option").hasClass("active")
          ? $("#pattern-17").addClass("inactive")
          : $("#pattern-17").removeClass("inactive");
    }
    function neelan() {
      document.querySelectorAll(".design-option").forEach(function (sharella) {
        sharella.onchange = function (mandisa) {
          mandisa.preventDefault();
          var odyssey = sharella.selectedOptions[0],
            leslieanne = odyssey.designOption;
          if (
            ((config.recentDesignOption = leslieanne),
            odyssey.incompatibleNames)
          ) {
            let jeronimo =
              odyssey.incompatibleNames[0].name +
              " " +
              odyssey.incompatibleNames[0].categorySingular +
              " is not compatible with this configuration and will be replaced";
            pseudoConfirm(jeronimo, false).then(function () {
              aleighna();
            });
          } else aleighna();
          function aleighna() {
            var altheria = sharella
              .closest(".material-section")
              .getAttribute("data-style-name");
            for ([optionId, option] of (params.tileStyles[altheria]
              .designOptions ||
              (params.tileStyles[altheria].designOptions = {}),
            Object.entries(params.tileStyles[altheria].designOptions)))
              option.categoryId == leslieanne.categoryId &&
                delete params.tileStyles[altheria].designOptions[optionId];
            (params.tileStyles[altheria].designOptions[leslieanne.id] =
              leslieanne),
              keygan(),
              predraw(sharella);
          }
        };
      });
    }
    function axten() {
      for (const [_0x266ec6, _0x5546e4] of Object.entries(params.tileStyles)) {
        var agneta = document.querySelector(
            "[data-style-name='" + _0x266ec6 + "']"
          ),
          kamberlyn = config.materials[_0x5546e4.materialId];
        kamberlyn &&
        "upload" !== _0x5546e4.imgType &&
        "solid" !== _0x5546e4.imgType &&
        "user" !== _0x5546e4.imgType &&
        kamberlyn.brand > 0 &&
        config.materials[_0x5546e4.materialId].params &&
        !config.appdata
          ? (document
              .querySelectorAll(".material-appearance-options")
              .forEach(function (kennyth) {
                kennyth.style.display = "none";
              }),
            document
              .querySelectorAll(".show-appearance-options")
              .forEach(function (kasiya) {
                kasiya.style.display = "";
              }),
            (agneta.querySelector(".manufacturer-label-img").src =
              config.cdn + "/brands/" + kamberlyn.brands_logo),
            (agneta.querySelector(".manufacturer-label-link").style.display =
              ""))
          : (document
              .querySelectorAll(".material-appearance-options")
              .forEach(function (jesusalberto) {
                jesusalberto.style.display = "";
              }),
            document
              .querySelectorAll(".show-appearance-options")
              .forEach(function (antwuan) {
                antwuan.style.display = "none";
              }),
            (agneta.querySelector(".design-options-container").innerHTML = ""),
            (agneta.querySelector(".design-options-container").style.display =
              "none"),
            (agneta.querySelector(".manufacturer-label-link").style.display =
              "none"));
      }
    }
    function hatty() {
      for (let derean of Object.values(params.tileStyles))
        if (derean.designOptions)
          for (var markeice of Object.values(derean.designOptions)) {
            var mairlyn = derean.materialId;
            if (markeice.incompatibles) {
              var tyannia = [];
              for (var obaloluwa of markeice.incompatibles)
                tyannia.push(obaloluwa.option);
              markeice.incompatibles.forEach(function (michiele) {
                if (
                  (!config.recentDesignOption ||
                    (config.hasOwnProperty("recentDesignOption") &&
                      config.recentDesignOption.id !== michiele.option)) &&
                  (!michiele.when_material ||
                    (michiele.when_material &&
                      michiele.when_material == mairlyn)) &&
                  config.materials[mairlyn] &&
                  config.materials[mairlyn].designOptions &&
                  config.materials[mairlyn].designOptions[michiele.option]
                ) {
                  var dorin = config.materials[mairlyn].designOptions,
                    besty = dorin[michiele.option];
                  if (
                    ((optionElement = element(
                      "[data-design-option='" + michiele.option + "']"
                    )),
                    !optionElement.madeIncompatible)
                  ) {
                    optionElement.incompatibleNames ||
                      (optionElement.incompatibleNames = []),
                      optionElement.incompatibleNames.push({
                        name: markeice.name,
                        categoryName: markeice.categoryName,
                        categorySingular: markeice.categorySingular,
                      }),
                      (optionElement.innerHTML =
                        optionElement.innerHTML + " *");
                    var timothea = michiele.when_material
                      ? "Not compatible with " +
                        markeice.name +
                        " " +
                        markeice.categorySingular +
                        " for " +
                        config.materials[michiele.when_material].name
                      : "Not compatible with " +
                        markeice.name +
                        " " +
                        markeice.categorySingular;
                    if (
                      (optionElement.setAttribute("title", timothea),
                      optionElement.selected)
                    ) {
                      delete derean.designOptions[michiele.option],
                        (optionElement.selected = false);
                      for (let parson of Object.values(dorin))
                        if (
                          parson.categoryId == besty.categoryId &&
                          !tyannia.includes(parson.id)
                        ) {
                          (element(
                            "[data-design-option='" + parson.id + "']"
                          ).selected = true),
                            (derean.designOptions[parson.id] = parson),
                            hatty();
                          break;
                        }
                    }
                    optionElement.madeIncompatible = true;
                  }
                }
              });
            }
          }
    }
    function keygan() {
      for (const [_0x16cbc8, _0x43f164] of Object.entries(params.tileStyles)) {
        var veanna = document.querySelector(
            "[data-style-name='" + _0x16cbc8 + "']"
          ),
          heike = config.materials[_0x43f164.materialId]
            ? config.materials[_0x43f164.materialId]
            : { brand: 0 };
        if (
          ((defaultMaterial = false),
          veanna.classList.contains("default-material") &&
            (defaultMaterial = true),
          "upload" !== _0x43f164.imgType &&
            "solid" !== _0x43f164.imgType &&
            "user" !== _0x43f164.imgType &&
            heike.brand > 0)
        ) {
          if (
            ((veanna.querySelector(".manufacturer-label-img").src =
              config.cdn + "/brands/" + heike.brands_logo),
            (veanna.querySelector(".manufacturer-label").style.display = ""),
            veanna.querySelector(".manufacturer-label-link") &&
              (veanna.querySelector(".manufacturer-label-link").href =
                heike.link
                  ? checkHttps(heike.link)
                  : checkHttps(heike.brands_website_link)),
            (params.tonalVariation = "0"),
            (veanna.querySelector(".design-options-container").innerHTML = ""),
            heike.designOptions || config.patternDesignOptions)
          ) {
            veanna.querySelector(".design-options-container").style.display =
              "";
            var foyster =
              "a" == _0x16cbc8
                ? Object.assign(
                    {},
                    heike.designOptions,
                    config.patternDesignOptions
                  )
                : Object.assign({}, heike.designOptions);
            if (_0x43f164.designOptions)
              for (const tayleigh of Object.keys(_0x43f164.designOptions))
                Object.keys(foyster).includes(tayleigh) ||
                  delete _0x43f164.designOptions[tayleigh];
            var asenith = [];
            if (_0x43f164.designOptions)
              for (const [_0x217a1e, _0x180720] of Object.entries(
                _0x43f164.designOptions
              ))
                asenith.push(_0x180720.categoryId);
            for (const [_0xfa106d, _0x2f62db] of Object.entries(foyster))
              _0x2f62db.isDefault &&
                !asenith.includes(_0x2f62db.categoryId) &&
                (_0x43f164.designOptions || (_0x43f164.designOptions = {}),
                (_0x43f164.designOptions[_0xfa106d] = _0x2f62db));
            designOptionElements = [];
            var lakyn = {};
            for (const [_0x498a29, _0x3fa75a] of Object.entries(foyster)) {
              lakyn.hasOwnProperty(_0x3fa75a.categoryName) ||
                ((lakyn[_0x3fa75a.categoryName] = createHtml({
                  tag: "div",
                  class: "input-group",
                  children: [
                    {
                      tag: "div",
                      class: "input-label",
                      text: _0x3fa75a.categorySingular,
                    },
                    {
                      tag: "select",
                      "data-design-option-cat": _0x3fa75a.categoryId,
                      "data-param": "designOption",
                      "data-brand": heike.brand,
                      class: "design-option",
                      children: [
                        {
                          tag: "option",
                          text: _0x3fa75a.categorySingular,
                          selected: "",
                          disabled: "",
                        },
                      ],
                    },
                  ],
                })),
                insertHtml(
                  lakyn[_0x3fa75a.categoryName],
                  veanna.querySelector(".design-options-container")
                ));
              let jantzen = createHtml({
                tag: "option",
                "data-design-option": _0x3fa75a.id,
                value: _0x3fa75a.name,
                text: _0x3fa75a.name,
              });
              _0x43f164.designOptions &&
                Object.keys(_0x43f164.designOptions).includes(
                  _0x3fa75a.id + ""
                ) &&
                (jantzen.selected = "selected"),
                (jantzen.designOption = _0x3fa75a),
                designOptionElements.push(jantzen);
            }
            for (var errion of (designOptionElements.sort(function (
              hether,
              dolorse
            ) {
              var aleeza = hether.designOption.name.localeCompare(
                dolorse.designOption.name,
                "en",
                { numeric: true, sensitivity: "base" }
              );
              return aleeza > 0 ? 1 : aleeza < 0 ? -1 : 0;
            }),
            designOptionElements))
              lakyn[errion.designOption.categoryName]
                .querySelector("select")
                .appendChild(errion);
          }
          neelan();
        } else
          _0x43f164.designOptions && delete _0x43f164.designOptions,
            defaultMaterial;
      }
      var rokiatou = params.tileStyles[Object.keys(params.tileStyles)[0]];
      if (rokiatou.designOptions)
        for (option of Object.values(rokiatou.designOptions)) {
          var remika;
          option.params.hasOwnProperty("secondMaterial") &&
            Object.keys(params.tileStyles).length < 2 &&
            (taunya(null, null, "Second Colour").addedViaDesignOption = true),
            option.params.hasOwnProperty("singleMaterial") &&
              Object.keys(params.tileStyles).forEach(function (
                bergin,
                kiernen
              ) {
                0 !== kiernen &&
                  (delete params.tileStyles[bergin],
                  removeHtml("#material-type-" + bergin));
              });
        }
    }
    config.draw = function (_0x28408d = copy(params)) {
      return (
        (config.drawSettings = {
          params: _0x28408d,
          tileTexture: false,
          returnImg: true,
        }),
        new Promise(function (cintya, demaya) {
          predraw("drawParams").then(function (latrinia) {
            cintya(latrinia);
          });
        })
      );
    };
    let ayaat = 0;
    function valaria() {
      $("#width-input-group").append($("#height-input-container")),
        $("#height-input-group").append($("#width-input-container")),
        $("#min-width-input-group").append($("#min-height-input-container")),
        $("#min-height-input-group").append($("#min-width-input-container")),
        $("#rows-input-group").append($("#columns")),
        $("#columns-input-group").append($("#rows")),
        $("#joint-size-horizontal-input-group").append(
          $("#joint-size-vertical-input-container")
        ),
        $("#joint-size-vertical-input-group").append(
          $("#joint-size-horizontal-input-container")
        );
    }
    function avrey() {
      $("#width-input-group").append($("#width-input-container")),
        $("#height-input-group").append($("#height-input-container")),
        $("#min-width-input-group").append($("#min-width-input-container")),
        $("#min-height-input-group").append($("#min-height-input-container")),
        $("#rows-input-group").append($("#rows")),
        $("#columns-input-group").append($("#columns")),
        $("#joint-size-horizontal-input-group").append(
          $("#joint-size-horizontal-input-container")
        ),
        $("#joint-size-vertical-input-group").append(
          $("#joint-size-vertical-input-container")
        );
    }
    function levanna() {
      if (config.patterns[params.patternId].tileHeightMin) {
        var normando = eval(config.patterns[params.patternId].tileHeightMin),
          xael = params.tileHeight;
        if (1 == params.inches) {
          xael = inchesToMm(xael);
          var frederi = parseInt(inchesToMm(normando));
        } else {
          xael = parseInt(xael);
          var frederi = parseInt(normando);
        }
        xael < frederi &&
          ((params.tileHeight = normando), (charrisse.value = normando));
      }
    }
    function eulalah(zahriya) {
      if (zahriya.classList.contains("app-param")) {
        if (zahriya.hasOwnProperty("appValue")) var rashiem = zahriya.appValue;
        else if ("array" == zahriya.getAttribute("data-type"))
          var rashiem = ajita(zahriya.getAttribute("data-param"));
        else if ("checkbox" == zahriya.getAttribute("type"))
          var rashiem = !!zahriya.checked;
        else if ("radio" == zahriya.getAttribute("type"))
          var rashiem = parseBool(
            document.querySelector(
              "[type='radio'][name='" +
                zahriya.getAttribute("name") +
                "']:checked"
            ).value
          );
        else
          var rashiem = zahriya.hasAttribute("data-value")
            ? this.getAttribute("data-value")
            : zahriya.value;
        "mm" == zahriya.getAttribute("data-units") &&
          1 == params.inches &&
          (rashiem = inchesToMm(rashiem)),
          "true" == rashiem
            ? (rashiem = true)
            : "false" == rashiem && (rashiem = false);
        var jon = zahriya.getAttribute("data-param");
        function ajita(luann) {
          var sofiah = [];
          return (
            elements("[data-param='" + luann + "']").forEach(function (
              lynnete
            ) {
              "checkbox" == lynnete.getAttribute("type")
                ? lynnete.checked && sofiah.push(lynnete.value)
                : sofiah.push(lynnete.value);
            }),
            sofiah
          );
        }
        if (
          ((paramParts = jon.split(".")),
          zahriya.hasAttribute("data-tile") ||
            zahriya.classList.contains("style-param"))
        ) {
          var oktavia = zahriya.classList.contains("style-param")
            ? zahriya
                .closest("[data-style-name]")
                .getAttribute("data-style-name")
            : zahriya.getAttribute("data-tile");
          1 == paramParts.length &&
            (params.tileStyles[oktavia][paramParts[0]] = rashiem),
            2 == paramParts.length &&
              (null == params.tileStyles[oktavia][paramParts[0]] &&
                (params.tileStyles[oktavia][paramParts[0]] = {}),
              (params.tileStyles[oktavia][paramParts[0]][paramParts[1]] =
                rashiem));
        } else
          1 == paramParts.length && (params[paramParts[0]] = rashiem),
            2 == paramParts.length &&
              (null == params[paramParts[0]] && (params[paramParts[0]] = {}),
              (params[paramParts[0]][paramParts[1]] = rashiem));
        zahriya.classList.contains("cookie-param") &&
          setArtxCookie(jon, rashiem);
      }
      if ("units" == zahriya.getAttribute("name"))
        if (
          (setArtxCookie("units", zahriya.value),
          (config.units = zahriya.value),
          "inches" == zahriya.value)
        ) {
          elements(".dimension-input:not(.resolution-input)").forEach(function (
            llana
          ) {
            var eiven = llana.value,
              schaefer = mmToInches(eiven);
            if (
              ((llana.value = schaefer),
              llana.classList.remove("dimension-input-mm"),
              llana.classList.add("dimension-input-inches"),
              llana.classList.contains("app-param"))
            ) {
              var jniyah = llana.getAttribute("data-param");
              params[jniyah] = schaefer;
            }
          }),
            elements(".units").forEach(function (makda) {
              (makda.innerHTML = '"'),
                makda.classList.remove("units-mm"),
                makda.classList.add("units-inches");
            });
          var devian,
            aynia,
            latonga,
            emilse =
              (devian = mmToInches(config.textureWidth)) +
              " x " +
              (aynia = mmToInches(config.textureHeight)) +
              " " +
              (latonga = "in");
          element("#texture-size").innerHTML = emilse;
        } else {
          elements(".dimension-input:not(.resolution-input)").forEach(function (
            nikali
          ) {
            var tamel = nikali.value,
              traevyn = inchesToMm(tamel);
            if (
              ((nikali.value = traevyn),
              nikali.classList.remove("dimension-input-inches"),
              nikali.classList.add("dimension-input-mm"),
              nikali.classList.contains("app-param"))
            ) {
              var syrae = nikali.getAttribute("data-param");
              params[syrae] = traevyn;
            }
          }),
            elements(".units").forEach(function (zaire) {
              (zaire.innerHTML = "mm"),
                zaire.classList.remove("units-inches"),
                zaire.classList.add("units-mm");
            });
          var devian = config.textureWidth,
            aynia = config.textureHeight,
            latonga = "mm",
            emilse = round(devian) + " x " + round(aynia) + " " + latonga;
          element("#texture-size").innerHTML = emilse;
        }
      if (zahriya.classList.contains("upload-width")) {
        var viraj = zahriya.getAttribute("data-image"),
          yahav = 99999;
        elements(".upload-width[data-image='" + viraj + "']").forEach(
          function () {
            var shria = params.inches
              ? inchesToMm(zahriya.value)
              : parseInt(zahriya.value);
            shria < yahav && (yahav = shria);
          }
        );
      }
      zahriya.classList.contains("material-placement") && myreen(zahriya),
        kirstine(),
        predraw(zahriya),
        odelia();
    }
    function keyren() {
      $(".parameter").off(),
        document
          .querySelectorAll("input[data-max], input[data-min]")
          .forEach(function (delante) {
            delante.onchange = function () {
              parseInt(delante.value) >
                parseInt(delante.getAttribute("data-max")) &&
                (delante.value = delante.getAttribute("data-max")),
                parseInt(delante.value) <
                  parseInt(delante.getAttribute("data-min")) &&
                  (delante.value = delante.getAttribute("data-min"));
            };
          }),
        (config.ui.jointHorizontal.onchange = function () {
          $("#chain-icon").hasClass("active") &&
            (config.ui.jointVertical.value = config.ui.jointHorizontal.value),
            eulalah(config.ui.jointHorizontal);
        }),
        elements(".material-rotate").forEach(function (inayah) {
          inayah.onclick = function () {
            (params.randCrop = parseInt(1e5 * Math.random())),
              (inayah.appValue = !inayah.appValue),
              eulalah(inayah);
          };
        }),
        (config.ui.reset.onclick = function () {
          (params.randCrop = parseInt(1e5 * Math.random())),
            (params.randEdge = parseInt(1e5 * Math.random())),
            (params.randTone = parseInt(1e5 * Math.random())),
            (params.randSrc = parseInt(1e5 * Math.random())),
            eulalah(config.ui.reset);
        }),
        (config.ui.pathSelector.onclick = function () {
          if (!config.ui.pathMenu) {
            var randalyn = createDataboxMenu({
              title: "Profiles",
              search: false,
              query: {
                table: "paths",
                where: [["id", "in", config.profilePaths.join(",")]],
                sort: ["id", "asc"],
                limit: 48,
              },
              footer: false,
              itemHtml: function (shaniel) {
                let florindo = pointsToCanvas(shaniel.points, 3, 50, false, 1);
                florindo.style.marginRight = "15px";
                var tijera = createHtml({
                  tag: "div",
                  class: "dbox-menu-item",
                  children: [florindo, shaniel.name],
                });
                return (
                  (tijera.style.height = "60px"),
                  (tijera.onclick = function () {
                    (params.tileStyles.a.profile.pathId = shaniel.id),
                      (config.ui.pathSelector.innerHTML = shaniel.name),
                      fadeOut(randalyn),
                      predraw("profile");
                  }),
                  tijera
                );
              },
              width: "350px",
              left: config.ui.pathSelector.getBoundingClientRect().left,
              onClose: "hide",
            });
            (config.ui.pathMenu = randalyn), insertHtml(config.ui.pathMenu);
            var raychel,
              aldair = createHtml({
                tag: "div",
                class: "dbox-menu-item",
                children: [
                  {
                    tag: "div",
                    style:
                      "width:53px;height:1px;margin-right:15px;border-bottom: 2px dashed #aaa",
                  },
                  "None",
                ],
              });
            (aldair.style.height = "60px"),
              (aldair.onclick = function () {
                delete params.tileStyles.a.profile.pathId,
                  (config.ui.pathSelector.innerHTML = "None"),
                  predraw("profile"),
                  fadeOut(randalyn);
              }),
              insertHtml(aldair, randalyn.dbox.container, "prepend");
          }
          fadeIn(config.ui.pathMenu),
            (config.ui.pathMenu.style.display = "flex");
          var shamira = config.ui.pathSelector.getBoundingClientRect(),
            tylesha = config.ui.controls.getBoundingClientRect();
          (config.ui.pathMenu.style.left = shamira.left + "px"),
            (config.ui.pathMenu.style.top =
              shamira.top - 250 < tylesha.top
                ? tylesha.top + "px"
                : shamira.top - 250 + "px"),
            (config.ui.pathMenu.style.bottom =
              shamira.top + 250 > tylesha.bottom
                ? window.innerHeight - tylesha.bottom + "px"
                : window.innerHeight - (shamira.top + 250) + "px");
        }),
        (config.ui.heightmapSelector.onclick = function () {
          if (!config.ui.heightmapMenu) {
            var rahul = createDataboxMenu({
              title: "Finishes",
              search: false,
              query: {
                table: "heightmaps",
                where: [["id", "in", config.finishHeightmaps.join(",")]],
                limit: 48,
                sort: config.appdata ? ["name", "asc"] : ["id", "asc"],
              },
              footer: false,
              itemHtml: function (mareena) {
                var tenneil = createHtml({
                    tag: "img",
                    src:
                      "http://localhost:8081/uploads/" +
                      mareena.image +
                      "?s=80&q=75",
                    style:
                      "height: 60px; width: 60px;opacity: 0.75; margin-right: 15px;object-fit: cover;",
                  }),
                  illah = createHtml({
                    tag: "div",
                    class: "dbox-menu-item",
                    style: "height:60px;padding:0;",
                    children: [tenneil, mareena.name],
                  });
                return (
                  (illah.onclick = function () {
                    (params.tileStyles.a.finish.heightmapId = mareena.id),
                      (config.ui.heightmapSelector.innerHTML = mareena.name),
                      fadeOut(rahul),
                      predraw("profile");
                  }),
                  illah
                );
              },
              width: "350px",
              left: config.ui.heightmapSelector.getBoundingClientRect().left,
              onClose: "hide",
            });
            (config.ui.heightmapMenu = rahul), insertHtml(rahul);
            var athulya = createHtml({
              tag: "div",
              class: "dbox-menu-item",
              style: "height: 60px;padding:0;",
              children: [
                {
                  tag: "div",
                  style:
                    "height: 60px; width: 60px;background-color:#ddd; margin-right: 15px;",
                },
                "None",
              ],
            });
            (athulya.onclick = function () {
              delete params.tileStyles.a.finish.heightmapId,
                (config.ui.heightmapSelector.innerHTML = "None"),
                predraw("finish"),
                fadeOut(rahul);
            }),
              insertHtml(athulya, rahul.dbox.container, "prepend");
          }
          fadeIn(config.ui.heightmapMenu);
          var brooklen = config.ui.heightmapSelector.getBoundingClientRect(),
            fedele = config.ui.controls.getBoundingClientRect();
          (config.ui.heightmapMenu.style.left = brooklen.left + "px"),
            (config.ui.heightmapMenu.style.top =
              brooklen.top - 250 < fedele.top
                ? fedele.top + "px"
                : brooklen.top - 250 + "px"),
            (config.ui.heightmapMenu.style.bottom =
              brooklen.top + 250 > fedele.bottom
                ? window.innerHeight - fedele.bottom + "px"
                : window.innerHeight - (brooklen.top + 250) + "px");
        }),
        (config.ui.weaves.onchange = function () {
          dania(), eulalah(config.ui.weaves);
        }),
        $("#stretchers").change(function () {
          briany();
        }),
        (document.getElementById("pattern-rotate").onclick = function () {
          var gerzon;
          if ((gerzon = parseInt($(this).attr("data-rotate"))) + 90 > 359) {
            $(this).attr("data-rotate", "0");
            var gerzon = 0;
          } else {
            $(this).attr("data-rotate", gerzon + 90);
            var gerzon = gerzon + 90;
          }
          valaria() || avrey(), predraw("#hue");
        }),
        $(".dimension-input").keypress(function () {
          var karely = $(this).attr("id"),
            antwanett = String.fromCharCode(event.which);
          if ($("#mm").is(":checked")) {
            if (
              "joint-size-horizontal" == karely ||
              "joint-size-vertical" == karely
            )
              var arelli = [
                "0",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "-",
              ];
            else
              var arelli = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
            -1 == arelli.indexOf(antwanett) &&
              13 != event.which &&
              event.preventDefault();
          }
          if ($("#inches").is(":checked")) {
            if (
              "joint-size-horizontal" == karely ||
              "joint-size-vertical" == karely
            )
              var arelli = [
                "0",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "/",
                '"',
                " ",
                "'",
                "-",
                ".",
              ];
            else
              var arelli = [
                "0",
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
                "/",
                '"',
                " ",
                "'",
                ".",
              ];
            -1 == arelli.indexOf(antwanett) &&
              13 != event.which &&
              event.preventDefault();
          }
        }),
        elements(".parameter").forEach(function (anaisia) {
          anaisia.onchange = function () {
            eulalah(anaisia);
          };
        });
    }
    (predraw = function (crissangel) {
      let elyanna =
        config.drawSettings && config.drawSettings.hasOwnProperty("params")
          ? config.drawSettings.params
          : params;
      if (config.patterns.hasOwnProperty(elyanna.patternId)) {
        iframeMessage("drawStarted"),
          $(".add-button").attr("data-used", "false"),
          $(".add-button").attr("data-is-saved", "false"),
          0 !== ayaat &&
            (document.getElementById("save-button").dataset.userSave = "false"),
          ayaat++,
          ["redo", "undo"].includes(crissangel) ||
            (ha(crissangel),
            setPatternMultiples(),
            cevon(),
            levanna(),
            ha(crissangel)),
          window.scrollTo(0, 0),
          showSpinner(),
          config.history ||
            ((config.history = []), (config.historyPosition = 0)),
          ["undo", "redo"].includes(crissangel) ||
            (config.history.splice(
              config.historyPosition + 1,
              config.history.length,
              copy(params)
            ),
            config.history.length > 20 && config.history.shift,
            (config.historyPosition = config.history.length - 1));
        var natalis = elyanna.patternId;
        if (
          (hatty(),
          (config.materialsUsed = []),
          (config.pathsUsed = []),
          (config.heightmapsUsed = []),
          (config.brandsUsed = []),
          ("pattern" == elyanna.trigger ||
            "initial-page-load" == elyanna.trigger) &&
            config.pattern.defaultParams)
        ) {
          for ([key, value] of ((config.pattern.defaultParams =
            "string" == typeof config.pattern.defaultParams
              ? JSON.parse(config.pattern.defaultParams)
              : config.pattern.defaultParams),
          Object.entries(config.pattern.defaultParams)))
            config.dimensionParams.includes(key) &&
              (value = getDimensionValue(value, config.pattern.defaultParams)),
              (elyanna[key] = value);
          (params.hatchJoints = !!(params.patternId > 13)),
            (element("#hatch-joints").checked = params.hatchJoints),
            kierre();
        }
        return (
          ("scene" == elyanna.trigger ||
            "initial-page-load" == elyanna.trigger) &&
            config.scenes &&
            config.scenes[params.scene] &&
            config.scenes[params.scene].params &&
            (delete elyanna.sceneTextures,
            izayuh(config.scenes[params.scene].params)),
          Promise.all(wilmer()).then(function () {
            let muhaimin = [];
            if (
              (styleLoop(function (alastor, dorna) {
                let felita;
                if (
                  (config.materials.hasOwnProperty(alastor.materialId) &&
                    "user_materials" !==
                      config.materials[alastor.materialId].db &&
                    (alastor.materialWidth =
                      config.materials[alastor.materialId + ""].realwidth),
                  config.materials.hasOwnProperty(alastor.materialId) &&
                    config.materials[alastor.materialId].brand &&
                    config.brandsUsed.push(
                      config.materials[alastor.materialId].brand
                    ),
                  Number.isInteger(
                    parseInt(("" + alastor.materialId).replace("u", ""))
                  ) &&
                    !config.materials.hasOwnProperty(alastor.materialId) &&
                    ((alastor.materialId = alastor.imgType = "solid"),
                    window.alert(
                      "One of the selected materials is not available and has been replaced"
                    )),
                  alastor.hasOwnProperty("edge") &&
                    alastor.edge.hasOwnProperty("profile") &&
                    config.edges[alastor.edge.profile].hasOwnProperty(
                      "imageData"
                    ))
                ) {
                  let deaijah;
                  config.edges[alastor.edge.profile].imageData.forEach(
                    function (marycaroline) {
                      let harmonei = [];
                      for ([key, value] of Object.entries(marycaroline)) {
                        if (
                          key.includes("_url") &&
                          !marycaroline.hasOwnProperty(key + "_img")
                        ) {
                          let dallyce = key.replace("_url", "_img");
                          marycaroline[dallyce] = new Image();
                          let rosamund = marycaroline[dallyce];
                          harmonei.push(
                            new Promise((tracer, tenile) => {
                              (rosamund.onload = function () {
                                tracer();
                              }),
                                (rosamund.onerror = function () {
                                  tracer();
                                }),
                                (rosamund.src = value),
                                (rosamund.crossOrigin = "anonymous");
                            })
                          );
                        }
                        muhaimin.push(...harmonei);
                      }
                    }
                  );
                }
              }),
              juley(),
              ["pattern", "initial-page-load", "plugin-editor-load"].includes(
                elyanna.trigger
              ))
            ) {
              let chrishna = config.patterns[elyanna.patternId];
              chrishna &&
                chrishna.definition &&
                chrishna.definition.tiles.forEach(function (yarelin) {
                  isNaN(yarelin.edges[0].edgeLength) ||
                    yarelin.hasOwnProperty("minBounds") ||
                    (yarelin.minBounds = tileMinBounds(yarelin));
                }),
                korben();
            }
            function chibuike(wattie) {
              document
                .querySelectorAll("#pattern-menu .menu-option")
                .forEach(function (isyss) {
                  let malerie = parseInt(isyss.getAttribute("data-option")),
                    teryon = config.patterns[malerie],
                    arrah = isyss.querySelector(".menu-option-img-container");
                  (wattie && !wattie.includes(malerie)) ||
                  (teryon.pro && !config.pro)
                    ? (arrah.classList.add("inactive"),
                      (arrah.style.opacity = 0.5))
                    : (arrah.classList.remove("inactive"),
                      (arrah.style.opacity = 1));
                });
            }
            config.patternDesignOptions || (config.patternDesignOptions = {}),
              ["pattern", "initial-page-load", "plugin-editor-load"].includes(
                elyanna.trigger
              ) &&
                config.brandsUsed.length &&
                muhaimin.push(
                  new Promise((cannen, aryauna) => {
                    postJson(
                      `/api/get-design-options?pattern=${elyanna.patternId}&brand=${config.brandUsed}`
                    ).then(function (esterine) {
                      esterine.forEach(function (willibaldo) {
                        willibaldo.fromPattern = elyanna.patternId;
                      }),
                        (config.patternDesignOptions = arrayToObject(
                          esterine,
                          "id"
                        )),
                        cannen();
                    });
                  })
                ),
              Promise.all(muhaimin).then(function () {
                if (
                  [
                    "material-input",
                    "initial-page-load",
                    "plugin-editor-load",
                  ].includes(elyanna.trigger)
                ) {
                  if (
                    params.tileStyles.a.materialId &&
                    config.materials.hasOwnProperty(
                      params.tileStyles.a.materialId
                    )
                  ) {
                    let althera =
                      config.materials[params.tileStyles.a.materialId];
                    althera.patterns && althera.patterns.length
                      ? (chibuike(althera.patterns),
                        althera.patterns.includes(parseInt(params.patternId)) ||
                          ((params.patternId = althera.patterns[0]), kierre()))
                      : chibuike();
                  }
                  function acia() {
                    let kianny = {
                      brightness: 1,
                      contrast: 1,
                      hue: 0,
                      saturation: 1,
                      invert: false,
                      tint: "#FFFFFF",
                      edge: {
                        profile: "fine",
                        scale: 1,
                        exclude: [],
                        width: 25,
                      },
                      gradients: [],
                      finish: {},
                      profile: {},
                    };
                    var evelinda = false;
                    for ([styleName, style] of Object.entries(
                      elyanna.tileStyles
                    ))
                      (config.materials.hasOwnProperty(style.materialId) &&
                        config.materials[style.materialId].hasOwnProperty(
                          "params"
                        ) &&
                        Object.values(config.materials[style.materialId].params)
                          .length) ||
                      (config.materials.hasOwnProperty(style.materialId) &&
                        config.materials[style.materialId].brand > 1)
                        ? ((evelinda = true),
                          style.preDefault ||
                            (style.preDefault = copy({
                              brightness: style.brightness,
                              contrast: style.contrast,
                              hue: style.hue,
                              saturation: style.saturation,
                              invert: style.invert,
                              tint: style.tint,
                              edge: style.edge,
                              gradients: style.gradients,
                              finish: {},
                              profile: {},
                            })),
                          config.materials.hasOwnProperty(style.materialId) &&
                            config.materials[style.materialId].brand > 1 &&
                            izayuh(kianny, style),
                          config.materials.hasOwnProperty(style.materialId) &&
                            Object.values(
                              config.materials[style.materialId].params
                            ).length &&
                            izayuh(
                              config.materials[style.materialId].params,
                              style
                            ))
                        : style.preDefault &&
                          (izayuh(style.preDefault, style),
                          delete style.preDefault);
                    evelinda && kierre();
                  }
                  (!["initial-page-load", "plugin-editor-load"].includes(
                    elyanna.trigger
                  ) ||
                    ("initial-page-load" === elyanna.trigger &&
                      get("materialId"))) &&
                    acia();
                }
                [
                  "pattern",
                  "material-input",
                  "plugin-editor-load",
                  "initial-page-load",
                ].includes(elyanna.trigger) && (axten(), keygan()),
                  appUi(),
                  Promise.all(wilmer()).then(() => {
                    config.preDrawJs(), hatty(), shaleesa(), tyge();
                    const kayedon = Object.values(config.materials).some(
                        (yatziry) =>
                          [
                            "graphic",
                            "organic",
                            "surfacing",
                            "landscaping",
                          ].includes(yatziry.category.toLowerCase())
                      ),
                      jenie = Object.values(config.materials).some(
                        (khailah) => khailah.brand
                      ),
                      linard = document.querySelector(
                        "[data-request='app-button']"
                      );
                    linard &&
                      (config.materialsUsed.includes("solid") ||
                      kayedon ||
                      !jenie
                        ? (linard.style.display = "none")
                        : (linard.style.display = ""));
                  });
              });
          }),
          new Promise(function (marceon) {
            config.drawResolve = marceon;
          })
        );
      }
      function tyge() {
        $.ajax({
          method: "POST",
          url: "/api/node-canvas",
          data: JSON.stringify(elyanna),
          dataType: "json",
        }).done(function (domina) {
          if (domina) {
            var trudi = new Image();
            trudi.src = "data:image/jpeg;base64," + domina.imgData;
            trudi.onload = function () {
              hideSpinner();
              jaydaa.width = trudi.width;
              jaydaa.height = trudi.height;
              asa.drawImage(trudi, 0, 0);
              tileTexture();
              if ("#high-res" === crissangel) {
                setTimeout(function () {
                  downloadTexture("canvas", 0.95);
                }, 500);
              }
            };
          }
        });
      }
      function wilmer() {
        let kishia = [];
        for (style of Object.values(elyanna.tileStyles)) {
          if (style.hasOwnProperty("designOptions"))
            for (designOption of Object.values(style.designOptions))
              designOption.hasOwnProperty("params") &&
                designOption.params.hasOwnProperty("patternId") &&
                (natalis = designOption.params.patternId),
                designOption.hasOwnProperty("params") &&
                  designOption.params.hasOwnProperty("surfaces") &&
                  designOption.params.surfaces.forEach(function (aerin) {
                    aerin.hasOwnProperty("pathId") &&
                      config.pathsUsed.push(aerin.pathId + "");
                  }),
                designOption.hasOwnProperty("params") &&
                  designOption.params.hasOwnProperty("finish") &&
                  designOption.params.finish.heightmapId &&
                  config.heightmapsUsed.push(
                    designOption.params.finish.heightmapId + ""
                  ),
                designOption.hasOwnProperty("params") &&
                  designOption.params.hasOwnProperty("profile") &&
                  designOption.params.finish.pathId &&
                  config.heightmapsUsed.push(
                    designOption.params.finish.pathId + ""
                  );
          style.surfaces &&
            style.surfaces.forEach(function (daneya) {
              daneya.hasOwnProperty("pathId") &&
                config.pathsUsed.push(daneya.pathId);
            }),
            style.hasOwnProperty("profile") &&
              style.profile.hasOwnProperty("pathId") &&
              config.pathsUsed.push(style.profile.pathId + ""),
            style.hasOwnProperty("finish") &&
              style.finish.hasOwnProperty("heightmapId") &&
              config.heightmapsUsed.push(style.finish.heightmapId + ""),
            style.materialId &&
              !config.materialsUsed.includes(style.materialId + "") &&
              config.materialsUsed.push(style.materialId + "");
        }
        config.pathsUsed.length &&
          !includesAll(Object.keys(config.paths), config.pathsUsed) &&
          kishia.push(
            new Promise((antwonne, gynesis) => {
              query({
                table: "paths",
                where: [["id", "in", config.pathsUsed.join(",")]],
              }).then(function (andrean) {
                console.log(andrean);

                andrean.results.forEach(function (lamiracle) {
                  config.paths[lamiracle.id] = lamiracle;
                }),
                  antwonne();
              });
            })
          ),
          config.heightmapsUsed.length &&
            !includesAll(
              Object.keys(config.heightmaps),
              config.heightmapsUsed
            ) &&
            kishia.push(
              new Promise((flecia, duffie) => {
                query({
                  table: "heightmaps",
                  where: [["id", "in", config.heightmapsUsed.join(",")]],
                }).then(function (kisia) {
                  kisia.results.forEach(function (sibley) {
                    (sibley.imageElement = new Image()),
                      (sibley.imageElement.onload = function () {
                        flecia();
                      }),
                      (sibley.imageElement.src = config.cdn + sibley.image),
                      (sibley.imageElement.crossOrigin = "anonymous"),
                      (config.heightmaps[sibley.id] = sibley);
                  });
                });
              })
            ),
          (config.patterns[natalis] &&
            ("definition" != config.patterns[natalis].drawMethod ||
              config.patterns[natalis].hasOwnProperty("definition"))) ||
            kishia.push(
              new Promise((jind, hayzley) => {
                postJson(`/api/patterns/${natalis}`).then(function (kendrell) {
                  config.patterns[natalis]
                    ? (config.patterns[natalis].definition =
                        kendrell.results[0].definition)
                    : ((config.patterns[natalis] = kendrell.results[0]),
                      (config.patterns[natalis].definition =
                        kendrell.results[0].definition),
                      (config.patterns[natalis].columnMultiple = 1),
                      (config.patterns[natalis].rowMultiple = 2),
                      (config.patterns[natalis].dimType = "multi")),
                    jind();
                });
              })
            ),
          config.scenes || (config.scenes = {}),
          params.scene &&
            !config.scenes.hasOwnProperty(params.scene) &&
            kishia.push(
              new Promise((bodhin, brucha) => {
                postJson(`/api/scenes/${params.scene}`).then(function (
                  shaketha
                ) {
                  if (shaketha.results.length) {
                    let yaisha = shaketha.results[0];
                    (config.scenes[params.scene] = yaisha),
                      izayuh(yaisha.params);
                  }
                  bodhin();
                });
              })
            );
        var genesia = false,
          bomani = [],
          zoriah = [];
        for (const alshon of Object.values(elyanna.tileStyles))
          "solid" === alshon.imgType ||
            "upload" === alshon.imgType ||
            "user" === alshon.imgType ||
            config.materials[alshon.materialId] ||
            bomani.push(alshon.materialId),
            "user" != alshon.imgType ||
              config.materials[alshon.materialId] ||
              zoriah.push(parseInt(alshon.materialId.replace("u", "")));
        if (
          ("solid" === elyanna.jointID ||
            config.materials[params.jointID] ||
            bomani.push(elyanna.jointID),
          bomani.length)
        ) {
          var genesia = new Promise((arati, kinnidy) => {
            postJson(`/api/materials?ids=${bomani.join(",")}`).then(function (
              jayleana
            ) {
              (designOptionPromises = []),
                jayleana.results.forEach(function (iralynn) {
                  if (
                    ((iralynn.db = "protextures"),
                    iralynn.source_data || (iralynn.source_data = {}),
                    iralynn.texture_sources)
                  ) {
                    let niesa = new Promise((carlee, shantanae) => {
                      query({
                        table: "texture_sources",
                        where: [["id", "in", iralynn.texture_sources]],
                      }).then(function (khadarius) {
                        (iralynn.texture_sources = khadarius.results), carlee();
                      });
                    });
                    kishia.push(niesa);
                  } else
                    (iralynn.texture_sources = []),
                      iralynn.source_names.forEach(function (aashray) {
                        let jaliesa = {
                          width_mm: iralynn.realwidth,
                          seamless: iralynn.seamless,
                          texture_map: "/materials/" + aashray,
                        };
                        iralynn.source_data.hasOwnProperty(aashray) &&
                          Object.assign(jaliesa, iralynn.source_data[aashray]);
                        let daejaun = jaliesa.hasOwnProperty("total_copies")
                          ? jaliesa.total_copies
                          : 1;
                        for (let deseri = 0; deseri < daejaun; deseri++)
                          iralynn.texture_sources.push(jaliesa);
                      });
                  if (
                    ((iralynn.params = iralynn.params ? iralynn.params : {}),
                    iralynn.brand)
                  ) {
                    let masonalexander = new Promise((aiker, cerria) => {
                      postJson(
                        `/api/get-design-options?material=${iralynn.id}`
                      ).then(function (naason) {
                        (naason = arrayToObject(naason, "id")),
                          (iralynn.designOptions = naason),
                          (config.materials[iralynn.id] = iralynn),
                          aiker();
                      });
                    });
                    designOptionPromises.push(masonalexander),
                      kishia.push(masonalexander);
                  } else config.materials[iralynn.id] = iralynn;
                }),
                designOptionPromises.length
                  ? Promise.all(designOptionPromises).then(function () {
                      arati();
                    })
                  : arati();
            });
          });
          kishia.push(genesia);
        }
        return (
          zoriah.length &&
            kishia.push(
              new Promise((jana, corye) => {
                postJson("/api/query11", {
                  table: "user_materials",
                  columns: ["id", "name", "source_names", "user"],
                  where: [["id", "in", zoriah.join(",")]],
                  auth: true,
                }).then(function (kamarien) {
                  kamarien.results.forEach(function (angeleia) {
                    (angeleia.db = "user_materials"),
                      (angeleia.realwidth = 2e3),
                      (angeleia.seamless = false),
                      (config.materials["u" + angeleia.id] = angeleia),
                      (config.materials["u" + angeleia.id].texture_sources =
                        []),
                      angeleia.source_names &&
                        config.materials[
                          "u" + angeleia.id
                        ].source_names.forEach(function (samanthaann) {
                          config.materials[
                            "u" + angeleia.id
                          ].texture_sources.push({
                            width_mm: angeleia.realwidth,
                            seamless: angeleia.seamless,
                            texture_map:
                              "/users/" +
                              angeleia.user +
                              "/uploads/" +
                              samanthaann,
                          });
                        });
                  }),
                    jana();
                });
              })
            ),
          kishia
        );
      }
      function izayuh(safoora, ronelda) {
        if (safoora)
          for ([param, value] of Object.entries(safoora)) {
            if ("inches" === param) continue;
            let lakshmi =
              config.tileParams.includes(param) && ronelda ? ronelda : elyanna;
            (lakshmi[param] = value),
              config.dimensionParams.includes(param) &&
                (lakshmi[param] = getDimensionValue(value, safoora));
          }
      }
      query({ table: "patterns", id: elyanna.patternId }).then(function (
        loycie
      ) {
        if (loycie.results.length) {
          let akashdeep = loycie.results[0];
          (config.patterns[akashdeep.id] = akashdeep), predraw(crissangel);
        } else errorMessage("Pattern couldn't be loaded");
      });
    }),
      false === config.plugin && true === config.autoDraw
        ? ((config.initialDraw = false), predraw("#initial-page-load"))
        : (toApp({ type: "editorLoaded" }), (config.editorLoaded = true)),
      keyren(),
      $(window).resize(function () {
        (window.innerWidth > 499 ||
          document.body.classList.contains("no-controls")) &&
          (tileTexture(), positionMenu($("#download"))),
          sizeCanvasContainer(),
          config.hasOwnProperty("plane") &&
            "plane" === params.view &&
            drawPlane();
      });
  });
