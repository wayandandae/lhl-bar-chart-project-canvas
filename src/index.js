const padding = 100;
const tickLength = 10;
// function to set parameters for drawBarChart API
function setParameter() {
  const rawData = $(".saved_data");
  const data = [];

  for (let i = 0; i < rawData.length; i++) {
    data.push(strToArray(rawData[i].innerText));
  }

  const options = {
    barWidth: document.getElementById("barwidth").value,
    barHeight: document.getElementById("barheight").value,
    barSpace: document.getElementById("barspace").value,
    barColour: document.getElementById("barcolour").value,
    barLineWidth: document.getElementById("barlinewidth").value,
    barLineColour: document.getElementById("barlinecolour").value,
    labelPosition: document.getElementById("labelposition").value,
    labelColour: document.getElementById("labelcolour").value,
    axisWidth: document.getElementById("axiswidth").value,
    axisColour: document.getElementById("axiscolour").value,
    titleText: document.getElementById("titletext").value,
    titleSize: document.getElementById("titlesize").value,
    titleColour: document.getElementById("titlecolour").value,
  };

  const element = $("#chart");

  return [data, options, element];
}
// button action for adding chart data
function addData(inputData) {
  const newData = document.createElement("p");
  const dataArray = strToArray(inputData);
  if (isDataValid(dataArray) && isSameLength(dataArray)) {
    newData.setAttribute("type", "text");
    newData.setAttribute("class", "saved_data");
    newData.innerText = dataArray;
    document.getElementById("datalist").appendChild(newData);
  } else if (!isDataValid(dataArray)) {
    errorMsg("INVALID_DATA");
  } else if (!isSameLength(dataArray)) {
    errorMsg("DIFF_DATA_LENGTH");
  }

  $("#chartdata").val("");
}
// check if a new array has the same length as previous entry
function isSameLength(dataArray) {
  let saveData = "";

  if ((saveData = document.getElementsByClassName("saved_data")[0])) {
    return strToArray(saveData.innerText).length === dataArray.length;
  }

  return true;
}
// check if array contains numbers
function isDataValid(dataArray) {
  for (let i = 0; i < dataArray.length; i++) {
    return dataArray[i] && !isNaN(dataArray[i]);
  }
}
// change raw input to array
function strToArray(input) {
  let rawData = input.split(",");
  const dataArray = [];

  for (let data of rawData) {
    dataArray.push(data.trim());
  }

  return dataArray;
}
/// DRAW BAR CHART ///
function drawBarChart(data, options, element) {
  $("#chart").html("");
  const canvasHeight = element.outerHeight();
  const canvasWidth = element.outerWidth();
  options.titleText = options.titleText || "Bar Chart by Jack Kang";
  $addLabel(padding + 100, padding + 50, options.titleText, {
    fontSize: options.titleSize || "25px",
    color: options.titleColour,
  });

  // drawAxes(options.axisWidth, options.axisColour);
  $drawAxes(options.axisWidth, options.axisColour, canvasWidth, canvasHeight);
  $yAxisTicks(data, options.axisWidth, options.axisColour, canvasHeight);
  $drawBars(
    data,
    options.barWidth,
    options.barHeight,
    options.barSpace,
    options.barLineWidth,
    options.barLineColour,
    options.barColour,
    options.labelSize,
    options.labelColour,
    canvasWidth,
    canvasHeight
  );
}
// get maximum value of x-axis
function xAxisMax(data) {
  let xAxisMaxVal = 0;

  return (xAxisMaxVal = data[0].length);
}
// get maximum value of y-axis
function yAxisMax(data) {
  let yAxisMaxVal = 0;

  for (let i = 0; i < data.length; i++) {
    yAxisMaxVal += Math.max(...data[i]);
  }

  return yAxisMaxVal;
}
// check if created data bars are out of bounds
function isOutOfBounds(
  data,
  barWidth,
  barHeight,
  barSpace,
  canvasWidth,
  canvasHeight
) {
  let error = false;
  const xAxisLength = canvasWidth - padding * 2;
  const yAxisLength = canvasHeight - padding * 2;

  if (Math.round(yAxisMax(data) * 1.25) * barHeight > yAxisLength) {
    error = true;
    errorMsg("HEIGHT_OUT_OF_LIMIT");
  }
  if (
    xAxisMax(data) * barWidth + (xAxisMax(data) + 1) * barSpace >
    xAxisLength
  ) {
    error = true;
    errorMsg("WIDTH_OUT_OF_LIMIT");
  }
  return error;
}
// create ticks on y-axis
function $yAxisTicks(data, axisWidth, axisColour, canvasHeight) {
  const tickNumber = Math.round(yAxisMax(data) * 1.25);
  const tickWidth = (canvasHeight - padding * 2) / tickNumber;

  for (let i = 0; i < tickNumber; i++) {
    $("#chart").line(
      padding,
      canvasHeight - padding - i * tickWidth,
      padding - tickLength,
      canvasHeight - padding - i * tickWidth,
      {
        color: axisColour,
      }
    );
    $addLabel(padding - 20, canvasHeight - padding - i * tickWidth - 5, i, {
      color: axisColour,
    });
  }
}

// function to draw a line
function jQueryHelper(ctx, begin, end, lineWidth = 1, lineColour = "black") {
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = lineColour;

  ctx.beginPath();
  ctx.moveTo(...begin);
  ctx.lineTo(...end);
  ctx.stroke();
}
// function to draw a rectangle
function $drawRect(
  tLeft,
  bLeft,
  bRight,
  tRight,
  lineWidth = 1,
  lineColour = "black",
  barColour = "white"
) {
  $("#chart").line(tLeft[0], tLeft[1], tRight[0], tRight[1], {
    color: lineColour,
  });
  $("#chart").line(tRight[0], tRight[1], bRight[0], bRight[1], {
    color: lineColour,
  });
  $("#chart").line(bRight[0], bRight[1], bLeft[0], bLeft[1], {
    color: lineColour,
  });
  $("#chart").line(bLeft[0], bLeft[1], tLeft[0], tLeft[1], {
    color: lineColour,
  });
}

function drawRect(
  ctx,
  tLeft,
  bLeft,
  bRight,
  tRight,
  lineWidth = 1,
  lineColour = "black",
  barColour
) {
  barColour = barColour || "white";
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = lineColour;

  ctx.beginPath();
  ctx.moveTo(...tLeft);
  ctx.lineTo(...bLeft);
  ctx.lineTo(...bRight);
  ctx.lineTo(...tRight);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = barColour;
  ctx.fill();
}

function $addLabel(xPos, yPos, content, options) {
  $("#chart").label(xPos, yPos, content, options);
}

function $drawAxes(axisWidth, axisColour, canvasWidth, canvasHeight) {
  axisWidth = null;

  $("#chart").line(padding, padding, padding, canvasHeight - padding, {
    color: axisColour,
  });
  $("#chart").line(
    padding,
    canvasHeight - padding,
    canvasWidth - padding,
    canvasHeight - padding,
    {
      color: axisColour,
    }
  );
}
function $drawBars(
  data,
  barWidth,
  barHeight,
  barSpace,
  barLineWidth,
  barLineColour,
  barColour,
  labelSize,
  labelColour,
  canvasWidth,
  canvasHeight
) {
  barSpace = barSpace || 50;
  const xAxisLength = canvasWidth - padding * 2;
  const yAxisLength = canvasHeight - padding * 2;

  if (!barWidth) {
    barWidth = (xAxisLength - (xAxisMax(data) + 1) * barSpace) / xAxisMax(data);
  }

  if (!barHeight) {
    barHeight = yAxisLength / Math.round(yAxisMax(data) * 1.25);
  }

  if (!isOutOfBounds(data, barWidth, barHeight, barSpace, canvasWidth)) {
    const yBaseValue = [];

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        i === 0 && yBaseValue.push(canvasHeight - padding);
        const newYBase = yBaseValue[j] - data[i][j] * barHeight;
        const leftX = padding + j * barWidth + (j + 1) * barSpace;

        $drawRect(
          [leftX, newYBase],
          [leftX, yBaseValue[j]],
          [leftX + barWidth, yBaseValue[j]],
          [leftX + barWidth, newYBase],
          barLineWidth,
          barLineColour,
          barColour
        );
        $addLabel(
          padding - 5 + (j + 0.5) * barWidth + (j + 1) * barSpace,
          newYBase + 5,
          data[i][j],
          { color: labelColour, fontSize: labelSize }
        );
        i === 0 &&
          $addLabel(
            padding - 20 + (j + 0.5) * barWidth + (j + 1) * barSpace,
            canvasHeight - padding + 5,
            `Entry ${j + 1}`,
            { color: labelColour, fontSize: labelSize }
          );
        yBaseValue[j] = newYBase;
      }
    }
  }
}

function errorMsg(errorType) {
  let errorMessage = "";

  switch (errorType) {
    case "WIDTH_OUT_OF_LIMIT":
      errorMessage =
        "Width is out of boundary. Please set the bar width to a smaller value.";
      break;

    case "HEIGHT_OUT_OF_LIMIT":
      errorMessage =
        "Height is out of boundary. Please set the bar height to a smaller value.";
      break;

    case "INVALID_DATA":
      errorMessage = "Invalid input detected. Please enter numbers only.";
      break;

    case "DIFF_DATA_LENGTH":
      errorMessage =
        "The number of values should match the previous entry. Please try again.";
      break;

    default:
      break;
  }

  return alert(errorMessage);
}
