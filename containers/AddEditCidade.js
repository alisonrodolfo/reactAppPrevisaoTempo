import { connect } from 'react-redux';
import AddEditCidade from '../screens/AddEditCidade.js';
import { add, update, del } from '../actions';

const mapStateToProps = state => {
  return {
    cidades: state.cidades,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    add: item => dispatch(add(item)),
    update: item => dispatch(update(item)),
    del: key => dispatch(del(key)),
  };
};

const AddEditCidadeContainer = connect(
  null,
  mapDispatchToProps
)(AddEditCidade);

export default AddEditCidadeContainer;
