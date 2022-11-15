(function ($) {
  let helpers = {
    createLine: function (x1, y1, x2, y2, options) {
      if (x2 < x1) {
        let temp = x1;
        x1 = x2;
        x2 = temp;
        temp = y1;
        y1 = y2;
        y2 = temp;
      }
      let line = document.createElement("div");

      line.className = options.class;

      let length = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

      line.style.width = length + "px";
      // line.style.height = options.height + "px";
      line.style.borderBottom = options.stroke + "px " + options.style;
      line.style.borderColor = options.color;
      line.style.position = "absolute";
      line.style.zIndex = options.zindex;

      const angle = Math.atan((y2 - y1) / (x2 - x1));
      line.style.top = y1 + 0.5 * length * Math.sin(angle) + "px";
      line.style.left = x1 - 0.5 * length * (1 - Math.cos(angle)) + "px";
      line.style.transform =
        line.style.MozTransform =
        line.style.WebkitTransform =
        line.style.msTransform =
        line.style.OTransform =
          "rotate(" + angle + "rad)";

      return line;
    },
    createLabel: function (x1, y1, content, options) {
      let label = document.createElement("div");

      label.className = options.class;

      label.setAttribute("class", "datalabel");
      label.innerText = content;
      label.style.fontSize = options.fontSize + "px";
      label.style.color = options.color;
      label.style.position = "absolute";

      label.style.top = y1 + "px";
      label.style.left = x1 + "px";

      return label;
    },
  };

  $.fn.line = function (x1, y1, x2, y2, options, callbacks) {
    return $(this).each(function () {
      let callback = "";
      if (typeof options === "function") {
        callback = options;
        options = null;
      } else {
        callback = callbacks;
      }
      options = $.extend({}, $.fn.line.defaults, options);

      $(this)
        .append(helpers.createLine(x1, y1, x2, y2, options))
        .promise()
        .done(function () {
          if (typeof callback === "function") {
            callback.call();
          }
        });
    });
  };
  $.fn.line.defaults = {
    zIndex: 10000,
    color: "#000000",
    stroke: "1",
    style: "solid",
    class: "line",
    // height: "5",
  };

  $.fn.label = function (x1, y1, content, options, callbacks) {
    return $(this).each(function () {
      let callback = "";
      if (typeof options === "function") {
        callback = options;
        options = null;
      } else {
        callback = callbacks;
      }
      options = $.extend({}, $.fn.label.defaults, options);

      $(this)
        .append(helpers.createLabel(x1, y1, content, options))
        .promise()
        .done(function () {
          if (typeof callback === "function") {
            callback.call();
          }
        });
    });
  };
  $.fn.label.defaults = {
    zIndex: 9999,
    color: "#000000",
    stroke: "1",
    style: "solid",
    class: "label",
    fontSize: "10",
  };
}(jQuery));
