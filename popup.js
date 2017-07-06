(function() {
  'use strict';
  let out = document.querySelector('.out');
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

  function c(el, text) {
    let node = document.createElement(el);
    if (text) node.innerHTML = text;
    return node;
  }

  function item(key, manifest) {
    let item = c('li');
    let label = c('strong', `${key}: `);
    label.title = schema.properties[key].description;
    let value;
    let type = schema.properties[key].type;
    let hasType = type? true : false;

    let list = schema.properties[key].enum;
    let hasList = list? true : false;

    if (hasType) {
      switch (type) {
        case 'string':
          value = c('span', manifest[key]);
          item.append(label, value);
          if (manifest[key].indexOf('#') === 0) {
            let colorWidget = c('input');
            colorWidget.type = 'color';
            colorWidget.value = manifest[key];
            colorWidget.disabled = true;
            colorWidget.style.width = '20px';
            item.append(colorWidget);
          }
        break;
        case 'array':
          item.append(label, c('span', manifest[key].length));
          let sublist = c('ul');
          manifest[key].forEach((listitem) => {
            sublist.append(c('li', JSON.stringify(listitem)));
          });
          item.append(sublist);
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
  };

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
          let list = c('ul');

          memberskeys.forEach((key, i) => {
            if (manifest[key]) {
              // console.log(`${key} present!`);
              list.append(item(key, manifest));
            }
          });

          out.append(list);
        } else {
          // loaded, but can't find file
          if (xhr.status == 404) {
            out.innerText = "Couldn't download manifest!";
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
        out.append(c('h2', 'No manifest found!'));
      }
    }
  );
}());
