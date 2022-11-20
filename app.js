const dataset = fetch(
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
).then((response) =>
  response.json().then((data) => {
    console.log(data);
  })
);

const w = 500;
const h = 500;

const svg = d3.select('body').append('svg').attr('width', w).attr('height', h);

d3.select('svg').append('g').attr('id', 'x-axis');
d3.select('svg').append('g').attr('id', 'y-axis');
