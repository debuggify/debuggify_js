/**
 * Debuggify Utils
 * @module debuggify/utils
 * @author Ankur Agarwal
 */

(function( debuggify, undefined ) {

  var utils = debuggify.Utils = debuggify.Utils || (function() {

    // Global Dom Objects
    var win = window;
    var doc = win.document;

    /**
     * Reference http://ejohn.org/blog/javascript-micro-templating
     * @param  {string} str  template as string
     * @param  {Object} data Data needed for the template processing
     * @return {function|string}      Compiled template or processed output
     */
    function processTemplate(str, data) {

            var caller = processTemplate;

            caller.cache = caller.cache || {};

            caller.tmpl = caller.tmpl || function tmpl(str, data) {
              // Figure out if we're getting a template, or if we need to
              // load the template - and be sure to cache the result.
              var fn = !/\W/.test(str) ?
                caller.cache[str] = caller.cache[str] ||
                  caller.tmpl(doc.getElementById(str).innerHTML) :

                // Generate a reusable function that will serve as a template
                // generator (and which will be cached).
                new Function('obj',
                  'var p=[],print=function(){p.push.apply(p,arguments);};' +

                  // Introduce the data as local variables using with(){}
                  "with(obj){p.push('" +

                  // Convert the template into pure JavaScript
                  str
                    .replace(/[\r\t\n]/g, ' ')
                    .split('<%').join('\t')
                    .replace(/((^|%>)[^\t]*)'/g, '$1\r')
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split('\t').join("');")
                    .split('%>').join("p.push('")
                    .split('\r').join("\\'") + "');}return p.join('');");

              // Provide some basic currying to the user
              return data ? fn(data) : fn;
            };

            return caller.tmpl(str, data);
      }

    /**
     * Extract query string from input url
     * @param  {string} url URL need to processed
     * @return {Object}     query string as key value pair of object
     */
    function queryString(url) {

      try {

        var q = url.split('?')[1];
        var a = q.split('&');

        if (a === '') {
          return {};
        }

        var i;
        var b = {};

        for (i = 0; i < a.length; i = i + 1) {

          try {

            var p = a[i].split('=');

            if (p.length !== 2) {
              throw 'continue';
            }

            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));

          } catch (e) {

          }
        }
        return b;

      } catch (err) {

        return {};

      }

    }

    /**
     * Stack Trace for at any step
     * @return {Array} Stack trace
     */
    function getStackTrace () {

      if (win.printStackTrace) {
        return win.printStackTrace.apply(this, arguments);
      }

    }

    return {
      processTemplate: processTemplate,
      queryString: queryString,
      getStackTrace: getStackTrace

    };
  }());

}( debuggify ) );