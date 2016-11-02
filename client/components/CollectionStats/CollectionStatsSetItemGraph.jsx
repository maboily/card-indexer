CollectionStatsSetItemGraph = React.createClass({
    propTypes: {
        cardSet: React.PropTypes.object.isRequired,
        stats: React.PropTypes.object.isRequired
    },

    getStatsId() {
        return `stats_owned_${this.props.cardSet._id}`;
    },

    componentDidMount() {
        let el = this.getDOMNode();
        let svg = d3.select(el)
                    .append('svg:svg')
                        .attr('id', this.getStatsId())

        this.updateChart(this.props);
    },

    componentWillUpdate(nextProps) {
        this.updateChart(nextProps);
    },

    render() {
        return (
            <div className="chart"></div>
        )
    },

    updateChart(props) {
        let data = [
            {
                label: `Not owned - ${100 - props.stats.cardsCompleted.percent.total}%`,
                value: 100 - props.stats.cardsCompleted.percent.total,
                sliceColor: '#EEEEEE'
            },

            {
                label: `Owned - ${props.stats.cardsCompleted.percent.total}%`,
                value: props.stats.cardsCompleted.percent.total,
                sliceColor: '#888888'
            }
        ];

        let radius = 100;

        let svg = d3.select(`#${this.getStatsId()}`);
        svg = svg.data([data]).attr('width', 500).attr('height', 200).append('svg:g').attr("transform", "translate(100,100)");

        let arc = d3.svg.arc()
            .outerRadius(radius);

        let pie = d3.layout.pie()
            .value((d) => { return d.value; });

        let arcs = svg.selectAll('g.slice')
            .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
            .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
                .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                    .attr("class", "slice");    //allow us to style things in the slices (like text)
        arcs.append("svg:path")
            .attr("fill", function(d) { return d.data.sliceColor; } ) //set the color for each slice to be chosen from the color function defined above
            .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function
        arcs.append("svg:text")
                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                //we have to make sure to set these before calling arc.centroid
                d.innerRadius = 0;
                d.outerRadius = radius;
                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
            })
            .attr("text-anchor", "middle")                          //center the text on it's origin
            .text(function(d, i) { return data[i].label; });        //get the label from our original data array


    }
});
