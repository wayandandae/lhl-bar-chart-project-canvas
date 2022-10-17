const padding = 100;
// function to set parameters for drawBarChart API
function setParameter() {
  // const rawData = document.getElementsByClassName("saved_data");
  // const rawDataArray = [];

  // for (let i = 0; i < rawData.length; i++) {
  //   rawDataArray.push(
  //     document.getElementsByClassName("saved_data")[i].value
  //   );
  // }
  // rawDataArray[1] ? (data = rawDataArray) : (data = rawDataArray[0]);
  let data = strToArray(document.getElementById("chartdata").value);

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

  const element = document.querySelector("canvas");

  return [data, options, element];
}
// button action for adding chart data
function addData(inputData) {
  const newData = document.createElement("p");
  const dataArray = strToArray(inputData);

  if (isDataValid(dataArray) && isSameLength(dataArray)) {
    newData.setAttribute("type", "text");
    newData.setAttribute("class", "saved_data");
    newData.setAttribute("value", dataArray);
    document.getElementById("chartdata").appendChild(newData);
  } else if (!isDataValid(dataArray)) {
    errorMsg("INVALID_DATA");
  } else if (!isSameLength(dataArray)) {
    errorMsg("DIFF_DATA_LENGTH");
  }
}
// check if a new array has the same length as previous entry
function isSameLength(dataArray) {
  const saveData = document.getElementsByClassName("saved_data");

  if (saveData) {
    return saveData[0].length === dataArray.length;
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
  const context = element.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  addTitle(options.titleText, options.titleSize, options.titleColour);

  drawAxes(options.axisWidth, options.axisColour);
  yAxisTicks(data, options.axisWidth, options.axisColour);
  drawBars(
    data,
    options.barWidth,
    options.barHeight,
    options.barSpace,
    options.barLineWidth,
    options.barLineColour,
    options.barColour,
    options.labelColour
  );
}
// get maximum value of x-axis
function xAxisMax(data) {
  let xAxisMaxVal = 0;

  Array.isArray(data[0])
    ? (xAxisMaxVal = data[0].length) // if data is an array of array
    : (xAxisMaxVal = data.length);

  return xAxisMaxVal;
}
// get maximum value of y-axis
function yAxisMax(data) {
  let dataMaxY = 0;
  let yAxisMaxVal = 0;

  if (Array.isArray(data[0])) {
    for (let i = 0; i < data.length; i++) {
      dataMaxY += Math.max(...data[i]);
    }
  } else {
    dataMaxY = Math.max(...data);
  }

  return (yAxisMaxVal = parseInt((dataMaxY * 6) / 5));
}
// check if created data bars are out of bounds
function isOutOfBounds(xAxisL, yAxisL, xMaxVal, yMaxVal, barW, barH, barS) {
  let error = false;
  if (yMaxVal * barH > yAxisL) {
    error = true;
    errorMsg("HEIGHT_OUT_OF_LIMIT");
  }
  if (xMaxVal * barW + (xMaxVal + 1) * barS > xAxisL) {
    error = true;
    errorMsg("WIDTH_OUT_OF_LIMIT");
  }
  return error;
}
// create ticks on y-axis
function yAxisTicks(data, axisWidth, axisColour) {
  const canvas = document.querySelector("#canvas");
  const canvasHeight = canvas.height;
  const canvasWidth = canvas.width;

  const tickSize = 10;
  const tickNumber = yAxisMax(data);
  const tickWidth = (canvasHeight - padding * 2) / tickNumber;

  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");

    for (let i = 0; i < tickNumber; i++) {
      drawLine(
        ctx,
        [padding, canvasHeight - padding - i * tickWidth],
        [padding - tickSize, canvasHeight - padding - i * tickWidth],
        axisWidth,
        axisColour
      );
      addDataLabel(
        i,
        padding - 20,
        canvasHeight - padding - i * tickWidth,
        axisColour
      );
    }
  }
}
// function to draw a line
function drawLine(ctx, begin, end, lineWidth = 1, lineColour = "black") {
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = lineColour;

  ctx.beginPath();
  ctx.moveTo(...begin);
  ctx.lineTo(...end);
  ctx.stroke();
}
// function to draw a rectangle
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
function addTitle(titleText, titleSize = 200, titleColour = "black") {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  if (!titleText) {
    titleText = "Bar chart by Jack";
  }
  context.font = `${titleSize}px Arial`;
  context.fillStyle = titleColour;
  context.fillText(titleText, 150, 50);
}
function addDataLabel(content, xPos, yPos, labelColour) {
  labelColour = labelColour || "black";
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  context.font = "20px Arial";
  context.fillStyle = labelColour;
  context.fillText(content, xPos, yPos);
}
// function to draw x and y-axes
function drawAxes(axisWidth, axisColour) {
  const canvas = document.querySelector("#canvas");
  const canvasHeight = canvas.height;
  const canvasWidth = canvas.width;

  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    // y-axis
    drawLine(
      ctx,
      [padding, padding],
      [padding, canvasHeight - padding],
      axisWidth,
      axisColour
    );
    // x-axis
    drawLine(
      ctx,
      [canvasWidth - padding, canvasHeight - padding],
      [padding, canvasHeight - padding],
      axisWidth,
      axisColour
    );
  }
}
// function to draw bars
function drawBars(
  data,
  barWidth,
  barHeight,
  barSpace,
  barLineWidth,
  barLineColour,
  barColour,
  labelColour
) {
  barSpace = barSpace || 30;
  const canvas = document.querySelector("#canvas");
  const canvasHeight = canvas.height;
  const canvasWidth = canvas.width;
  const xAxisLength = canvasWidth - padding * 2;
  const yAxisLength = canvasHeight - padding * 2;

  if (!barWidth) {
    barWidth = xAxisLength / xAxisMax(data) - barSpace;
  }
  if (!barHeight) {
    barHeight = yAxisLength / yAxisMax(data);
  }
  if (
    canvas.getContext ||
    !isOutOfBounds(
      xAxisLength,
      yAxisLength,
      xAxisMax(data),
      yAxisMax(data),
      barWidth,
      barHeight,
      barSpace
    )
  ) {
    const ctx = canvas.getContext("2d");

    if (!Array.isArray(data[0])) {
      for (let i = 0; i < data.length; i++) {
        drawRect(
          ctx,
          [
            padding + i * barWidth + (i + 1) * barSpace,
            canvasHeight - padding - data[i] * barHeight,
          ],
          [padding + i * barWidth + (i + 1) * barSpace, canvasHeight - padding],
          [
            padding + (i + 1) * barWidth + (i + 1) * barSpace,
            canvasHeight - padding,
          ],
          [
            padding + (i + 1) * barWidth + (i + 1) * barSpace,
            canvasHeight - padding - data[i] * barHeight,
          ],
          barLineWidth,
          barLineColour,
          barColour
        );
        addDataLabel(
          `Data ${i + 1}`,
          padding - 22 + (i + 0.5) * barWidth + (i + 1) * barSpace,
          canvasHeight - padding + 20,
          labelColour
        );
        addDataLabel(
          data[i],
          padding - 8 + (i + 0.5) * barWidth + (i + 1) * barSpace,
          canvasHeight - data[i] * barHeight - padding + 20,
          labelColour
        );
      }
    }
    // } else {
    //   const yBaseValue = [];
    //   yBaseValue.push(canvasHeight - padding);

    //   for (let i = 0; i < data.length; i++) {
    //     for (let j = 0; j < data[i].length; j++) {
    //       i === 0 && yBaseValue.push(yBaseValue[0]);
    //       yBaseValue[j] -= data[i][j] * barHeight;

    //       drawRect(
    //         ctx,
    //         [
    //           padding + j * barWidth + (j + 1) * barSpace,
    //           yBaseValue[i + 1],
    //         ],
    //         [padding + j * barWidth + (j + 1) * barSpace, yBaseValue[i]],
    //         [
    //           padding + (j + 1) * barWidth + (j + 1) * barSpace,
    //           yBaseValue[i],
    //         ],
    //         [
    //           padding + (j + 1) * barWidth + (j + 1) * barSpace,
    //           yBaseValue[i + 1],
    //         ],
    //         barLineWidth,
    //         barLineColour,
    //         barColour[i]
    //       );
    //     }
    //   }
    // }
  }
}
// button action for adding options
function addOption(options) {
  // let optionObject = {options.barWidth};
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

  return errorMessage;
}
