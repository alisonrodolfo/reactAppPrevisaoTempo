import { connect } from 'react-redux';
import Login from '../screens/Login.js';
import { updateEmail, updatePassword, loginThunk, signupThunk }  from '../actions';


const mapStateToProps = state => {
    return {
        user: state.user,
        email: state.email,
        password: state.password,
        error: state.error,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateemail: email => dispatch(updateEmail(email)),
        updatepassword: password => dispatch(updatePassword(password)),
        loginThunk: () => dispatch(loginThunk()),
        signupThunk: () => dispatch(signupThunk()),
        setError: error => dispatch(setError(error)),
    };
};



const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

export default LoginContainer;






