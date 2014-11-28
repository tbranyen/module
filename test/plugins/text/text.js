function splitId(name) {
  var lastIndex = name.lastIndexOf('.');
  return [
    name.substring(0, lastIndex),
    name.substring(lastIndex + 1)
  ];
}

function fetchText(address) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', address, true);
    xhr.onreadystatechange = function() {
      var status, err;
      if (xhr.readyState === 4) {
        status = xhr.status;
        if (status > 399 && status < 600) {
          //An http 4xx or 5xx error. Signal an error.
          err = new Error(address + ' HTTP status: ' + status);
          err.xhr = xhr;
          reject(err);
        } else {
          resolve(xhr.responseText);
        }
      }
    };
    xhr.responseType = 'text';
    xhr.send(null);
  });
}

module.export = {
  normalize: function(loader, name, refererName) {
    var parts = splitId(name),
        ext = parts[1];
    return loader.normalize(parts[0], refererName).then(function(value) {
      return value + (ext ? '.' + ext : '');
    });
  },

  moduleNormalize: function(loader, name, refererName) {
    var parts = splitId(name),
        ext = parts[1];
    return loader.normalize(parts[0], refererName) + (ext ? '.' + ext : '');
  },

  locate: function(loader, entry, extension) {
    var parts = splitId(entry.name),
    ext = parts[1];

    // Favor extension on the entry.name vs passed in one, since loader
    // favors 'js' if the name does not have any extension.
    return loader.locate({
      name: parts[0]
    }, (ext || extension || ''));
  },

  moduleLocate: function(loader, name, extension) {
    var parts = splitId(name),
        ext = parts[1];

    // Favor passed in extension over one on the entry.name for the sync
    // locate used inside a module value.
    return loader.moduleLocate({
      name: parts[0]
    }, (extension || ext || ''));
  },

  fetch: function(loader, entry) {
    return fetchText(entry.address);
  }
};