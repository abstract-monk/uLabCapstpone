import React, {Component} from 'react';
import Column from './Column'
import _ from 'lodash';

class Grid extends Component {
  render() {
    // Make sure the cols are in the right order
    let sortedCols = _.sortBy(this.props.cols, 'order');

    return (
      <div className="Grid">
        <div className="Grid_Flex">
        {
          sortedCols.map(({id, title, words}) => {
            return (<Column key={_.uniqueId()} col_id={id} title={title} words={words} add={this.props.add}
                            selectedVoice={this.props.selectedVoice} editorToggle={this.props.editorToggle}
                            removeFromGrid={this.props.removeFromGrid} />);
          })
        }

        </div>
      </div>
    );
  }
}

Grid.propTypes = {
  cols: React.PropTypes.array,
  add: React.PropTypes.func,
};

Grid.defaultProps = {
  cols: [{
    id: "0",
    title: "test",
    words: [{id: "1", word:"love", symbol_path:"", alt:""}]
  }],
};

export default Grid;
