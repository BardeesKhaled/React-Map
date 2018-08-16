import React, {Component} from 'react';
import SearchBox from './SearchBox';

class PlacesList extends Component {
	constructor(props) {
        super(props);
        this.state = {
            'locations': '',
            'query': '',
        };

        this.filterLocations = this.filterLocations.bind(this);
    }
    filterLocations(event) {
        this.props.closeInfoWindow();
        const {value} = event.target;
        var locations = [];
        this.props.locations.forEach(function (location) {
            if (location.longname.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                location.marker.setVisible(true);
                locations.push(location);
            } else {
                location.marker.setVisible(false);
            }
        });
         this.setState({
            'locations': locations,
            'query': value
        });
    }

    componentWillMount() {
        this.setState({
            'locations': this.props.locations
        });
    }

    render() {
        var Placeslist = this.state.locations.map(function (listItem, index) {
            return (
                <SearchBox key={index} openInfoWindow={this.props.openInfoWindow.bind(this)} data={listItem}/>
            );
        }, this);

        return (
            <div className="search">
                <input role="search" aria-labelledby="filter" id="search-field" className="search-field" type="text" placeholder="Filter"
                       value={this.state.query} onChange={this.filterLocations}/>
                <ul>
                    { Placeslist}
                </ul>
            </div>
        );
    }
}

export default PlacesList;