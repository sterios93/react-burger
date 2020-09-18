import React , { Component } from 'react';
import Aux from '../../hocs/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hocs/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
  salad: .5,
  cheese: .4,
  meat: 1.3,
  bacon: .7,
}

class BurgerBuilder extends Component {
  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0,
    },
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    loading: false,
  }

  updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((result, current) => {
        return result + current;
      }, 0);

    this.setState({purchasable: sum > 0})
  }

  addIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    const updateCount = oldCount + 1;
    const updatedIngrediants = {
      ...this.state.ingredients
    }
    updatedIngrediants[type] = updateCount;

    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;

    this.setState({ingredients: updatedIngrediants, totalPrice: newPrice});
    this.updatePurchaseState(updatedIngrediants);
  }

  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if (!oldCount) return;

    const updateCount = oldCount - 1;
    const updatedIngrediants = {
      ...this.state.ingredients
    }
    updatedIngrediants[type] = updateCount;

    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;

    this.setState({ingredients: updatedIngrediants, totalPrice: newPrice});
    this.updatePurchaseState(updatedIngrediants);
  }

  purchaseHandler = () => {
    this.setState({purchasing: true});
  }

  purchaseCancelHandler = () => {
    this.setState({purchasing: false});
  }

  purchaseContinueHandler = () => {
    //alert('You continue!');

    this.setState({loading: true});
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice, // you should recalculate the price on the server
      customer: {
        name: 'Pesho',
        address: {
          street: 'Tsarigragsko 1',
          zipCode: '123123',
          country: 'Tanzania',
        },
        email: 'test@test.com',
      },
      deliveryMethod: 'fastest',
    };

    axios.post('/orders.json', order)
      .then(res => {
        this.setState({loading: false, purchasing: false});
      })
      .catch(err => {
        this.setState({loading: false, purchasing: false});
      });
  }

  render() {
    const disabledInfo = {
      ...this.state.ingredients
    };

    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0;
    }

    let orderSummary =  <OrderSummary
      purchaseCanceled={this.purchaseCancelHandler}
      purchaseContinued={this.purchaseContinueHandler}
      ingredients={this.state.ingredients}
      price={this.state.totalPrice}
    />

    if (this.state.loading) {
      orderSummary = <Spinner />
    }

    return (
      <Aux>
          <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
           {orderSummary}
          </Modal>
          <Burger ingredients = { this.state.ingredients } />
          <BuildControls
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disabledInfo}
            purchasable={this.state.purchasable}
            price={this.state.totalPrice}
            ordered={this.purchaseHandler}
            />
      </Aux>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);