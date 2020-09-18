import React, { Component } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../../hocs/Auxiliary/Auxiliary';

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {
      state = {
        error: null,
      };

      componentWillMount() {
        this.reqIntercetor = axios.interceptors.request.use(req => {
          this.setState({error: null});
          return req;
        });

        this.resIntercetor = axios.interceptors.response.use(res => res, error => {
          this.setState({error: error});
        });
      }

      componentWillUnmount() {
        axios.interceptors.request.eject(this.reqIntercetor);
        axios.interceptors.response.eject(this.resIntercetor);
      }

      errorConfirmedHandler = () => {
        this.setState({error: null});
      }

      render() {
        return (
          <Aux>
            <Modal
              show={this.state.error}
              modalClosed={this.errorConfirmedHandler}
              >
                { this.state.error ? this.state.error : null }
            </Modal>
            <WrappedComponent {...this.props} />
          </Aux>
        );
      }
    }
}

export default withErrorHandler;