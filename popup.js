(function() {
  'use strict';

  let out = document.querySelector('.overview');
  var home = document.querySelector('.homescreen');
  let schema = {
    title: "JSON schema for Web Application manifest files",
    $schema: "http://json-schema.org/draft-04/schema#",
    type: "object",
    properties: {
      lang: {
        description: "The primary language for the values of the manifest.",
        type: "string"
      },
      dir: {
        description: "The base direction of the manifest.",
        enum: [
          "ltr",
          "rtl",
          "auto"
        ],
        default: "auto"
      },
      name: {
        description: "The name of the web application.",
        type: "string"
      },
      description: {
        description: "Description of the purpose of the web application",
        type: "string"
      },
      short_name: {
        description: "A string that represents a short version of the name of the web application.",
        type: "string"
      },
      scope: {
        description: "A string that represents the navigation scope of this web application's application context.",
        type: "string",
        format: "uri"
      },
      icons: {
        description: "The icons member is an array of icon objects that can serve as iconic representations of the web application in various contexts.",
        type: "array",
        items: {
          $ref: "#/definitions/image"
        }
      },
      display: {
        description: "The item represents the developer's preferred display mode for the web application.",
        enum: [
          "fullscreen",
          "standalone",
          "minimal-ui",
          "browser"
        ],
        default: "browser"
      },
      orientation: {
        description: "The orientation member is a string that serves as the default orientation for all top-level browsing contexts of the web application.",
        enum: [
          "any",
          "natural",
          "landscape",
          "portrait",
          "portrait-primary",
          "portrait-secondary",
          "landscape-primary",
          "landscape-secondary"
        ]
      },
      start_url: {
        description: "Represents the URL that the developer would prefer the user agent load when the user launches the web application.",
        type: "string",
        format: "uri"
      },
      theme_color: {
        description: "The theme_color member serves as the default theme color for an application context.",
        type: "string"
      },
      background_color: {
        description: "The background_color member describes the expected background color of the web application.",
        type: "string"
      },
      screenshots: {
        description: "The screenshots member is an array of image objects represent the web application in common usage scenarios.",
        type: "array",
        items: {
          $ref: "#/definitions/image"
        }
      },
      serviceworker: {
        description: "The service worker of the web application.",
        type: "object",
        properties: {
          src: {
            description: "URL representing a service worker.",
            type: "string",
            format: "uri"
          },
          scope: {
            description: "The service worker's associated scope URL.",
            type: "string",
            format: "uri"
          },
          type: {
            description: "The service worker's worker type.",
            type: "string"
          },
          use_cache: {
            description: "Determines whether the user agent cache should be used when fetching the service worker.",
            type: "boolean"
          }
        }
      },
      related_applications: {
        description: "Array of application accessible to the underlying application platform that has a relationship with the web application.",
        type: "array",
        items: {
          $ref: "#/definitions/related_application"
        }
      },
      prefer_related_applications: {
        description: "Boolean value that is used as a hint for the user agent to say that related applications should be preferred over the web application.",
        type: "boolean"
      }
    },
    definitions: {
      image: {
        type: "object",
        properties: {
          sizes: {
            description: "The sizes member is a string consisting of an unordered set of unique space-separated tokens which are ASCII case-insensitive that represents the dimensions of an image for visual media.",
            oneOf: [{
              type: "string",
              pattern: "^[0-9 x]+$"
            }, {
              enum: [
                "any"
              ]
            }]
          },
          src: {
            description: "The src member of an image is a URL from which a user agent can fetch the icon's data.",
            type: "string",
            format: "uri"
          },
          type: {
            description: "The type member of an image is a hint as to the media type of the image.",
            type: "string",
            pattern: "^[\sa-z0-9\-+;\.=\/]+$"
          },
          purpose: {
            type: "string"
          },
          platform: {
            $ref: "#/definitions/platform"
          }
        }
      },
      related_application: {
        type: "object",
        properties: {
          platform: {
            $ref: "#/definitions/platform"
          },
          url: {
            description: "The URL where the application can be found.",
            type: "string",
            format: "uri"
          },
          id: {
            description: "Information additional to the URL or instead of the URL, depending on the platform.",
            type: "string"
          },
          min_version: {
            description: "Information about the minimum version of an application related to this web app.",
            type: "string"
          },
          fingerprints: {
            description: "An array of fingerprint objects used for verifying the application.",
            type: "array",
            items: {
              type: "object",
              properties: {
                type: {
                  type: "string"
                },
                value: {
                  type: "string"
                }
              }
            }
          }
        }
      },
      platform: {
        description: "The platform it is associated to.",
        enum: [
          "play",
          "itunes",
          "windows"
        ]
      }
    }
  };

  function c(el) {
    let node = document.createElement(el);
    return node;
  }
  function t(el,text) {
    el.innerText = text;
    return el;
  }

  function item(key, manifest) {
    let item = [];
    let label = t(c('dt'), `${key}: `);
    label.title = schema.properties[key].description;
    let value;
    let type = schema.properties[key].type;
    let hasType = type? true : false;

    let list = schema.properties[key].enum;
    let hasList = list? true : false;

    if (hasType) {
      switch (type) {
        case 'string':
          value = t(c('dd'), manifest[key]);
          if (manifest[key].indexOf('#') === 0) {
            let colorWidget = c('input');
            colorWidget.type = 'color';
            colorWidget.value = manifest[key];
            colorWidget.disabled = true;
            colorWidget.style.width = '20px';
            value.append(colorWidget);
          }
          item.push(label, value);
        break;
        case 'array':
          let totalItems = manifest[key].length;
          label.append(t(c('span'), totalItems));
          item.push(label);
          let sublist = c('dd');
          manifest[key].forEach((listitem) => {
            sublist.append(t(c('div'), JSON.stringify(listitem)));
          });
          item.push(sublist);
        break;
      }
      // normal things

      // string
    } else {
      if (hasList) {
        // do something with that
        console.log(key);
        console.log(manifest[key]);
      }
    }
    return item;
  }

  function truncate(string, length){
    return string.length > length ? string.substring(0,length)+'…' : string;
  }
  function prefixURL(string, prefix) {
    // remove last fragment from url
    prefix = prefix.split('/');
    prefix.pop();
    prefix = prefix.join('/');
    if (string.charAt(0) !== '/') {
      string = '/' + string;
    }
    return prefix + string;
  }

  function getManifestURL() {
    return document.head.querySelector('link[rel="manifest"]').href;
  }

  function grabManifestContents(url) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();
    xhr.onreadystatechange = function(e) {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          let manifest = JSON.parse(xhr.responseText);
          let members = schema.properties;
          let memberskeys = Object.keys(members);
          let list = c('dl');
          list.classList.add('uk-description-list');

          memberskeys.forEach((key, i) => {
            if (manifest[key]) {
              // console.log(`${key} present!`);
              item(key, manifest).forEach((item) => list.append(item));
            }
          });

          out.append(list);

          if (manifest.icons.length) {
            let target = home.querySelector('.icon');
            let targetImg = target.querySelector('img');
            let targetLabel = target.querySelector('span');
            let imgSrc = manifest.icons[0].src;
            let labelText = manifest.short_name ? manifest.short_name : manifest.name;

            targetImg.src = prefixURL(imgSrc, url);
            targetLabel.innerText = truncate(labelText, 11);
          }

          document.querySelector('html').style.height = window.getComputedStyle(document.body).height;

          let tabs = [document.querySelector('.tab-overview'), document.querySelector('.tab-homescreen')];
          tabs.forEach((tab) => {
            tab.addEventListener('click', function (e) {
              console.log(tab);
              let target = document.querySelector(tab.dataset.target);
              let activeEls = document.querySelectorAll('.uk-active');
              for (let i=0; i<activeEls.length; i++) {
                activeEls[i].classList.remove('uk-active');
              }
              tab.classList.add('uk-active');
              target.classList.add('uk-active');

              document.querySelector('html').style.height = window.getComputedStyle(document.body).height;
            }, false);
          });
          // tabNodes.addEventListener('click', (e) => {
          //   console.log('click');
          // }, {capture:true});

        } else {
          // loaded, but can't find file
          if (xhr.status == 404) {
            out.append(t(c('p'), 'Couldn\'t download manifest!'));
            document.querySelector('.uk-tab').remove();
          }
        }
      }
    };
  }
  chrome.tabs.executeScript({
      code: `(${getManifestURL})();`
    },
    (results) => {
      if (results[0]) {
        grabManifestContents(results[0]);
      } else {
        out.append(t(c('p'), 'No manifest found!'));
        document.querySelector('.uk-tab').remove();
      }
    }
  );
}());
