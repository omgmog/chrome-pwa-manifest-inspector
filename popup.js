(function () {
  'use strict';
  let out = document.querySelector('.out');

  let members = [
    {
      'name': 'name',
      'tag': 'h2'
    },
    {
      'name': 'short_name',
      'tag': 'h3'
    },
    {
      'name': 'start_url',
      'tag': 'p'
    },
    {
      'name': 'display',
      'tag': 'p'
    },
    {
      'name': 'orientation',
      'tag': 'p'
    },
    {
      'name': 'background_color',
      'tag': 'p'
    },
    {
      'name': 'theme_color',
      'tag': 'p'
    },
    {
      'name': 'theme_color',
      'tag': 'p'
    },
    {
      'name': 'description',
      'tag': 'p'
    },
    {
      'name': 'dir',
      'tag': 'p'
    },
    {
      'name': 'lang',
      'tag': 'p'
    },
    {
      'name': 'scope',
      'tag': 'p'
    },
    {
      'name': 'serviceworker',
      'tag': 'p'
    },
    {
      'name': 'icons',
      'children': [
        {
          'name': 'purpose',
        },
        {
          'name': 'src',
        },
        {
          'name': 'sizes',
        },
        {
          'name': 'type',
        }
      ]
    },
    {
      'name': 'prefer_related_applications',
      'tag': 'p'
    },
    {
      'name': 'related_applications',
      'children': [
        {
          'name': 'platform',
        },
        {
          'name': 'url',
        },
        {
          'name': 'id',
        }
      ]
    }

  ]

  function c(el, text) {
    let node = document.createElement(el);
    node.innerText = text;
    return node;
  }

  function getManifestURL () {
    return document.head.querySelector('link[rel="manifest"]').href;
  }

  function grabManifestContents (url) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.send();

    xhr.onreadystatechange = function (e) {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          let manifest = JSON.parse(xhr.responseText);

          members.forEach((member) => {
            let value = manifest[member.name];
            if (member.tag) {
              out.append(c(member.tag, `${member.name}: ${value?value:'not specified'}`));
            }
            if (member.children) {
              out.append(c('ul', null));
              let list = out.lastChild;
              list.append(c('li', member.name));

              value.forEach((subvalue) => {
                member.children.forEach((child) => {
                  if (subvalue[child.name]) {
                    list.append(c('li', `${child.name}: ${subvalue[child.name]}`))
                  }
                });
              });

            }
          });


          out.innerHTML += manifest;
          console.log(manifest);
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