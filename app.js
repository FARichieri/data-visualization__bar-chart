const getData = async () => {
  await fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
  )
    .then((response) => response.json().then((data) => show(data)))
    .then(hideloader());
};
getData();

function hideloader() {
  document.getElementById('loading').style.display = 'none';
}

const show = (data) => {
  const dataset = data.data;
  console.log(dataset);
  const w = 800;
  const h = 400;
  const padding = 50;

  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

  svg
    .append('text')
    .attr('id', 'title')
    .attr('x', w / 2)
    .attr('y', padding)
    .attr('text-anchor', 'middle')
    .text('United States GDP');

  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -250)
    .attr('y', 80)
    .text('Gross Domestic Product');

  svg
    .append('text')
    .attr('x', w / 2 - 100)
    .attr('y', h + 0)
    .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
    .attr('class', 'info');

  const xScale = d3
    .scaleLinear()
    .domain([1947, 2015.75])
    .range([padding, w - padding]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([h - padding, padding]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  const rectWidth = (w - padding) / dataset.length;

  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0,' + (h - padding) + ')')
    .call(xAxis.tickFormat(d3.format('d')));
  svg
    .append('g')
    .attr('id', 'y-axis')
    .attr('transform', 'translate(' + padding + ',0)')
    .call(yAxis.tickFormat(d3.format('d')));

  const tooltip = d3
    .select('svg')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0);

  const overlay = d3
    .select('svg')
    .append('div')
    .attr('class', 'overlay')
    .style('opacity', 0);

  const years = dataset.map(function (item) {
    let quarter;
    const temp = item[0].substring(5, 7);

    if (temp === '01') {
      quarter = 'Q1';
    } else if (temp === '04') {
      quarter = 'Q2';
    } else if (temp === '07') {
      quarter = 'Q3';
    } else if (temp === '10') {
      quarter = 'Q4';
    }

    return item[0].substring(0, 4) + ' ' + quarter;
  });

  const GDP = dataset.map(function (item) {
    return item[1];
  });

  svg
    .selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('data-date', (d) => d[0])
    .attr('data-gdp', (d) => d[1])
    .attr('class', 'bar')
    .attr('x', (d, i) => i * rectWidth + padding)
    .attr('y', (d) => h - (h - yScale(d[1])))
    .attr('width', rectWidth)
    .attr('height', (d) => h - yScale(d[1]) - padding)
    .attr('index', (d, i) => i)
    .style('fill', '#33adff')
    .on('mouseover', function (event, d) {
      var i = this.getAttribute('index');
      overlay
        .transition()
        .duration(0)
        .style('height', d + 'px')
        .style('width', rectWidth + 'px')
        .style('opacity', 0.9)
        .style('left', i * rectWidth + 0 + 'px')
        .style('top', h - d + 'px')
        .style('transform', 'translateX(60px)');
      tooltip.transition().duration(200).style('opacity', 0);
      tooltip
        .html(
          years[i] +
            '<br>' +
            '$' +
            GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') +
            ' Billion'
        )
        .attr('data-date', dataset[i][0])
        .style('left', i * rectWidth + 30 + 'px')
        .style('top', h - 100 + 'px')
        .style('transform', 'translateX(60px)');
    })
    .on('mouseout', function () {
      tooltip.transition().duration(200).style('opacity', 0);
      overlay.transition().duration(200).style('opacity', 0);
    });
};
