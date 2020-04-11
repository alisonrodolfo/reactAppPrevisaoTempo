import { connect } from 'react-redux';
import Cidades from '../screens/Cidades.js';
import { add, del, update, toggle, load, loadRemoteList } from '../actions';

const mapStateToProps = state => {
  return {
    cidades: state.cidades,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    add: item => dispatch(add(item)),
    del: id => dispatch(del(id)),
    update: item => dispatch(update(item)),
    toggle: id => dispatch(toggle(id)),
    load: cidades => dispatch(load(cidades)),
    loadFromFirebase: () => dispatch(loadRemoteList()),
  };
};

const CidadesContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Cidades);

export default CidadesContainer;
