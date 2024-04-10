import * as d3 from "d3";
import "./viz.css";

////////////////////////////////////////////////////////////////////
////////////////////////////  Init  ///////////////////////////////
// svg
const svg = d3.select("#svg-container").append("svg").attr("id", "svg");
let width = parseInt(d3.select("#svg-container").style("width"));
let height = parseInt(d3.select("#svg-container").style("height"));
const margin = { top: 6, right: 30, bottom: 40, left: 70 };

// parsing & formatting
const formatXAxis = d3.timeFormat("%Y");

// scale
xScale = d3
  .scaleBand()
  .domain(global_data.map((d) => d.year))
  .range([margin.left, width - margin.right])
  .padding(0.2);
yScale = d3
  .scaleLinear()
  .domain([lower_bound_ext[0], upper_bound_ext[1]])
  .range([height - margin.bottom, margin.top]);

margin = { top: 30, right: 30, left: 60, bottom: 80 };
// axis

const xAxis = d3
  .axisBottom(xScale)
  .ticks(86)
  .tickFormat((d) => formatXAxis(d))
  .tickSizeOuter(0);

const yAxis = d3
  .axisLeft(yScale)
  .ticks(5)
  .tickSize(-width + margin.right + margin.left);

// line
const line = d3
  .line()
  .curve(d3.curveCardinal)
  .x((d) => xScale(d.parseTime))
  .y((d) => yScale(d.avg));
// svg elements

////////////////////////////////////////////////////////////////////
////////////////////////////  Load CSV  ////////////////////////////
//  data (d3.csv)
let data = [];
let lastValue;
let path, circle;

d3.json("data/global_temp_data.json").then((raw_data) => {
  console.log(raw_data);
  data = raw_data.map((d) => {
    d.date_parsed = parseTime(d.timestamp);
    return d;
  });

  console.log(data);

  //axis
  svg;
  yAxis = (g) =>
    g
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale).tickSize(10).ticks(6));

  svg.append("g");
  xAxis = (g) =>
    g.attr("transform", `translate(0,${height - margin.bottom})`).call(
      d3
        .axisBottom()
        .scale(xScale)
        .tickValues(xScale.domain().filter((d, i) => !(i % 20)))
    );

  //path
  path = svg
    .append("path")
    .datum(data)
    // = selectall append
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "grey")
    .attr("stroke-width", 1.5);

  //last value
  lastValue = data[data.length - 1];

  d3.select("#price").text(formatPrice(lastValue.price));
  d3.select("#date").text(formatDate(lastValue.date_parsed));

  //circle
  circle = svg
    .append("circle")
    .attr("cx", xScale(lastValue.date_parsed))
    .attr("cy", yScale(lastValue.price))
    .attr("r", 5)
    .attr("fill", "grey");
});

//Resize
window.addEventListener("resize", () => {
  width = parseInt(d3.select("#svg-container").style("width"));
  height = parseInt(d3.select("#svg-container").style("height"));

  xScale.range([margin.left, width - margin.right]);
  yScale.range([height - margin.bottom, margin.top]);

  line.x((d) => xScale(d.date_parsed)).y((d) => yScale(d.price));

  path.attr("d", line);

  circle
    .attr("cx", xScale(lastValue.date_parsed))
    .attr("cy", yScale(lastValue.price));

  d3.select(".x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);
  d3.select(".y-axis")
    .attr("transform", `translate(${margin.left})`)
    .call(yAxis);
  yAxis.tickSize(-width + margin.right + margin.left);
});
