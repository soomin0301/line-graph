import * as d3 from "d3";
import "./viz.css";

////////////////////////////////////////////////////////////////////
////////////////////////////  Init  ///////////////////////////////
// svg
const svg = d3.select("#svg-container").append("svg").attr("id", "svg");
let width = parseInt(d3.select("#svg-container").style("width"));
let height = parseInt(d3.select("#svg-container").style("height"));
const margin = { top: 6, right: 30, bottom: 60, left: 50 };

// parsing & formatting
const parseTime = d3.timeParse("%Y-%m-%dT00:00:00Z");

// scale
const xScale = d3.scaleTime().range([margin.left, width - margin.right]);
const yScale = d3.scaleLinear().range([height - margin.bottom, margin.top]);
// axis

// line
const line = d3
  .line()
  .curve(d3.curveCardinal)
  .x((d) => xScale(d.date_parsed))
  .y((d) => yScale(d.price));
// svg elements

////////////////////////////////////////////////////////////////////
////////////////////////////  Load CSV  ////////////////////////////
//  data (d3.csv)
let data = [];
d3.json("data/bitcoin-data.json").then((raw_data) => {
  console.log(raw_data);
  data = raw_data.map((d) => {
    d.date_parsed = parseTime(d.timestamp);
    return d;
  });
  // scale
  //   console.log(data);
  xScale.domain(d3.extent(data, (d) => d.date_parsed));
  yScale.domain(d3.extent(data, (d) => d.price));

  svg
    .append("text")
    .attr("x", width - 20)
    .attr("y", height - 15)
    .style("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Date");

  svg
    .append("text")
    .attr("x", 30)
    .attr("y", 20)
    .style("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Price");

  var xAxis = d3.axisBottom().scale(xScale);
  var yAxis = d3.axisLeft().scale(yScale);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g").call(yAxis);

  svg
    .append("line")
    .attr("x1", 0)
    .attr("y1", height)
    .attr("x2", width)
    .attr("y2", height)
    .attr("stroke", "black")
    .attr("stroke-width", 2.5);

  svg
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", height)
    .attr("stroke", "black")
    .attr("stroke-width", 2.5);

  //   console.log(d3.extent(data, (d) => d.price));
  svg
    .append("path")
    .datum(data)
    // = selectall append
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", 1.5);
});

//path
