const getData = async () => {
  await fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
  )
    .then((response) => response.json().then((data) => displayChart(data)))
    .then(hideloader())
    .catch((error) => console.log(error));
};
getData();

function hideloader() {
  document.getElementById('loading').style.display = 'none';
}

const displayChart = (data) => {
  const dataset = data.data;
  const w = 600;
  const h = 280;
  const padding = 50;

  const svg = d3
    .select('.container')
    .append('svg')
    .attr('viewBox', `0 0 ${w} ${h}`);

  svg
    .append('text')
    .attr('id', 'title')
    .attr('x', w / 2)
    .attr('y', padding)
    .attr('text-anchor', 'middle')
    .style('fill', 'green')
    .style('font-size', '2rem')
    .text('United States GDP');

  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -200)
    .attr('y', 80)
    .style('font-size', '.7rem')
    .text('Gross Domestic Product');

  svg
    .append('text')
    .attr('x', w / 2 - 50)
    .attr('y', h - 10)
    .style('font-size', '0.6rem')
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

  const rectWidth = (w - padding - padding) / dataset.length;

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
    .select('.container')
    .append('div')
    .attr('id', 'tooltip')
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
    .style('fill', 'green')
    .on('mouseover', function (d, i) {
      d3.select(this).transition().duration('50').attr('opacity', '.85');
      tooltip.transition().duration(100).style('opacity', 1);
      const index = this.getAttribute('index');
      tooltip
        .html(
          years[index] +
            '<br>' +
            '$' +
            GDP[index].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') +
            ' Billion'
        )
        .attr('data-date', dataset[index][0])
        .style('left', d.pageX + 10 + 'px')
        .style('top', d.pageY + 10 + 'px');
    })
    .on('mouseout', function (d, i) {
      d3.select(this).transition().duration('50').attr('opacity', '1');
      tooltip.transition().duration(100).style('opacity', 0);
    });
};
